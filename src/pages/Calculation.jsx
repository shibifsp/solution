import React, { useState, useEffect } from "react";
import "../css/calculation.css";
import supabase from "../Config/supabaseClient";
import { useParams, Link } from "react-router-dom";
import CustomAlert from "./CustomAlert";
import moment from "moment";

export default function Calculation() {
  const { id } = useParams();

  const [error, setError] = useState();
  const [fetchDatas, setFetchDatas] = useState([]);
  const [total, setTotal] = useState(0);
  const [name, setName] = useState();
  const [datas, setDatas] = useState([
    {
      info: "",
      amount: "",
      type: "",
      coustomer_id: id,
    },
  ]);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const fetchName = async () => {
      const { data: fetchName, error: nameError } = await supabase
        .from("dealers")
        .select("name")
        .eq("id", id)
        .single();

      if (nameError) {
        console.error(error);
      } else {
        setName(fetchName.name);
      }

      const { data: fetchSum, error: sumError } = await supabase
        .from("calculations")
        .select("*")
        .eq("coustomer_id", id);

      if (sumError) {
        console.log("fetch sum is error", sumError);
      } else {
        calculateSum(fetchSum);
        setFetchDatas(fetchSum);
        setShowAlert(false);
      }
    };

    if (id) {
      fetchName();
    }
  }, [id]);

  const handleChange = (index, field, value) => {
    const updatedData = [...datas];
    updatedData[index][field] = value;
    setDatas(updatedData);

    if (error) {
      setError(null);
    }
  };

  const postData = async (e) => {
    e.preventDefault();

    const hasIncompleteRow = datas.some(
      (row) =>
        (row.info || row.amount || row.type) &&
        (!row.info || !row.amount || !row.type)
    );

    if (hasIncompleteRow) {
      setError("Please complete the row you started.");
      return;
    }

    const validRows = datas.filter((row) => row.info && row.amount && row.type);

    if (validRows.length === 0) {
      setError("Please fill in at least one complete row before submitting.");
      return;
    }

    const { data, error } = await supabase
      .from("calculations")
      .insert(validRows);

    if (!error) {
      setError(null);
      setDatas([{ info: "", amount: "", type: "", coustomer_id: id }]);
      fetchData();
    } else {
      console.log(Error);
    }
  };

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("calculations")
      .select("*")
      .eq("coustomer_id", id);

    if (error) {
      console.error("Fetch Error", error);
    } else {
      console.log("Fetch Data:", data);
      setFetchDatas(data);
      calculateSum(data);
    }
  };

  const calculateSum = (data) => {
    const totalAmount = data.reduce((total, item) => {
      const amount = parseFloat(item.amount) || 0;
      if (item.type === "C") {
        return total + amount;
      } else if (item.type === "D") {
        return total - amount;
      }
      return total;
    }, 0);
    setTotal(totalAmount);

    if (totalAmount === 0) {
      setShowAlert(true);
    }
  };

  const clearEnteries = () => {
    setDatas([{ info: "", amount: "", type: "", coustomer_id: "id" }]);
    setShowAlert(false);
  };

  const addRow = () => {
    setDatas([...datas, { info: "", amount: "", type: "", coustomer_id: id }]);
  };

  const deleteRow = (index) => {
    setDatas((prevDatas) => prevDatas.filter((_, i) => i !== index));
  };

  const absoluteTotal = Math.abs(total);
  const formatedTotal = absoluteTotal.toLocaleString("en-US");

  return (
    <div className="calculation">
      <div className="container">
        <div className="nav-bar">
          <Link to={`/memberInfo/${id}`}>
            <h1>{name}</h1>
          </Link>
          <div className="img-home-icon">
            <Link to={`/memberInfo/${id}`}>
              <img
                src="https://cdn-icons-png.flaticon.com/128/12225/12225935.png"
                loading="lazy"
                alt="Profile picture "
                title="Account info "
              />
            </Link>
          </div>
        </div>

        <div className="table-form">
          <div className="error-message">
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
          <form onSubmit={postData}>
            <div className="table-head">
              <label htmlFor="info" className="info">
                <h2>Info</h2>
              </label>
              <label htmlFor="amount" className="info">
                <h2>Amount</h2>
              </label>
              <label htmlfor="type" className="type">
                <h2>Type</h2>
              </label>
            </div>

            <div className="middle">
              {datas.map((row, index) => (
                <div className="row" key={index}>
                  <div className="input">
                    <input
                      type="text"
                      id="info"
                      placeholder="Enter info"
                      value={row.info}
                      onChange={(e) =>
                        handleChange(index, "info", e.target.value)
                      }
                    />
                  </div>
                  <div className="input">
                    <input
                      type="numeric"
                      id="amount"
                      placeholder="Enter amount"
                      value={row.amount}
                      onChange={(e) =>
                        handleChange(index, "amount", e.target.value)
                      }
                    />
                    {row.amount && !/^\d*$/.test(row.amount) && (
                      <div className="error">Please enter a valid number</div>
                    )}
                  </div>
                  <div className="type-select">
                    <input
                      type="text"
                      id="type"
                      placeholder="D/C"
                      value={row.type}
                      onChange={(e) =>
                        handleChange(index, "type", e.target.value)
                      }
                    />
                  </div>
                  <div className="btn-out">
                    <button type="button" className="add" onClick={addRow}>
                      Add
                    </button>

                    <button
                      type="button"
                      className="delete"
                      onClick={() => deleteRow(index)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="button">
              <button type="submit">Submit</button>
              <button type="button" onClick={() => setShowAlert(true)}>
                clear
              </button>
            </div>
          </form>

          <div className="footer">
            <h2>Total balance</h2>
            <h2
              style={{ color: total > 0 ? "red" : "green" }}
            >
              {total < 0 ? (
                <div className="total-consider">
                  <span style={{ color: "#636262"}}>You wil Get</span>
                  {formatedTotal}
                </div>
              ) : (
                <div className="total-consider">
                  <span style={{ color: "#636262" }}>You wil Give</span>
                  {formatedTotal}
                </div>
              )}
            </h2>
          </div>
        </div>

        {showAlert && (
          <CustomAlert
            message="Are you ready for to clean your entries ?"
            onSure={clearEnteries}
            onCancel={() => setShowAlert(false)}
          />
        )}

        <div className="history">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Info</th>
                <th>Amount</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {fetchDatas.map((fData, index) => {
                const fetchedDate = fData.date;
                const formattedDate = moment(fetchedDate).format("DD-MMM-yyyy");

                const formatedAmount = fData.amount.toLocaleString("en-US");

                return (
                  <tr key={index}>
                    <td className="td-date">{formattedDate}</td>
                    <td>{fData.info}</td>
                    <td
                      className="amount"
                      style={{
                        color: fData.type === "C" ? "#26923f" : "#d92638",
                      }}
                    >
                      {formatedAmount}
                    </td>
                    <td className="td_type">
                      {fData.type === "D" ? "DEBIT" : "CREDIT"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="home-icon">
        <Link to={`/`}>
          <img
            src="https://cdn-icons-png.flaticon.com/128/9449/9449216.png"
            alt="Home"
            title="Home"
            class="lzy lazyload--done"
          />
        </Link>
      </div>
    </div>
  );
}
