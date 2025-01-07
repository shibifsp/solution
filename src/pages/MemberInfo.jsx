import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../Config/supabaseClient";
import "../css/MemberInfo.css";
import moment from "moment";
import EditForm from "./EditForm";
import { Link } from "react-router-dom";

export default function MemberInfo() {
  const { id } = useParams();
  const [dataDefined, setDataDefined] = useState([]);
  const [about, setAbout] = useState();
  const [personalTotal, setPersonalTotal] = useState(0);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const takeData = async () => {
      const { data, error } = await supabase
        .from("calculations")
        .select("*")
        .eq("coustomer_id", id);

      if (error) {
        console.error("Your fetchData isn't fetch", error);
      } else {
        setDataDefined(data || []);
      }
    };
    takeData();
  }, [id]);

  useEffect(() => {
    fetchDealerTable();
  }, [id]);

  const fetchDealerTable = async () => {
    const { data, error } = await supabase
      .from("dealers")
      .select("*")
      .eq("id", id);

    if (error) {
      console.error("Your fetcing name is incorrect!..");
    } else {
      setAbout(
        data && data.length > 0 ? data[0] : <h2>The about array is empty...</h2>
      );
    }
  };

  useEffect(() => {
    const personalSum = () => {
      const sum = dataDefined.reduce((total, data) => {
        return data.type === "C" ? total + data.amount : total - data.amount;
      }, 0);
      setPersonalTotal(sum);
    };
    personalSum();
  }, [dataDefined]);

  const deleteRow = async (itemId) => {
    const { data, error } = await supabase
      .from("calculations")
      .delete()
      .eq("id", itemId);

    if (error) {
      console.error("Your deleting process didn't working..", error);
    } else {
      setDataDefined(dataDefined.filter((row) => row.id !== itemId));
    }
  };

  const absolutePersonalTotal = Math.abs(personalTotal);
  const formatedPersonalTotal = absolutePersonalTotal.toLocaleString("en-US");

  return (
    <div className="memberInfo">
      <div className="container-details">
        <div className="nav-bar">
          <h1 style={{ color: personalTotal > 0 ? "#fd5b5b" : "#00f900" }}>
            {personalTotal > 0 ? "For will Give" : "For will Get"}
          </h1>
          <div className="logos">
            <Link to={`/`}>
              <img
                src="https://cdn-icons-png.flaticon.com/128/3220/3220642.png"
                loading="lazy"
                alt="members list logo "
                title="members list "
                className="fst-img"
              />
            </Link>
            <Link to={`/calculation/${id}`}>
              <img
                src="   https://cdn-icons-png.flaticon.com/512/3742/3742501.png "
                alt="logo caculation"
                title="Calculation page"
                class="img-small"
              />
            </Link>

            <Link 
              to="#"
              onClick={(e) => {
                e.preventDefault();
                const target = document.getElementById("section-about");
                if(target) {
                  target.scrollIntoView({behavior: "smooth"})
                }
              }}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/128/12225/12225935.png"
                loading="lazy"
                alt="logo account "
                title="Account info "
              />
            </Link>
          </div>
        </div>
        <div className="content-memberInfo">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Info</th>
                <th>Amount</th>
                <th>Type</th>
                <th className="blank"></th>
              </tr>
            </thead>
            <tbody>
              {dataDefined.map((item) => {
                const takedDate = item.date;
                const formattedDate = moment(takedDate).format("DD-MMM-YYYY");

                const formatedAmount = item.amount.toLocaleString("en-US");

                return (
                  <tr key={item.id}>
                    <td className="date">{formattedDate}</td>
                    <td>{item.info}</td>
                    <td
                      className="amount"
                      style={{ color: item.type === "C" ? "green" : "red" }}
                    >
                      {formatedAmount}
                    </td>
                    <td
                      className="type"
                      // style={{ color: item.type === "C" ? "green" : "red" }}
                    >
                      {item.type === "C" ? "Credit" : "Debit"}
                    </td>
                    <td className="delete">
                      <img
                        src="https://cdn-icons-png.flaticon.com/128/11540/11540197.png"
                        srcSet="https://cdn-icons-png.flaticon.com/128/11540/11540197.png 4x"
                        alt="Delete"
                        onClick={() => {
                          deleteRow(item.id);
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="footer">
          <h3>Total balance</h3>
          <h3
            className="sum"
            style={{ color: personalTotal < 0 ? "green" : "red" }}
          >
            {formatedPersonalTotal}
          </h3>
        </div>
      </div>

      <div className="container-about" id="section-about">
        <div className="top">
          <div className="img-about">
            <p>Image</p>
          </div>
          <div className="icon-edit">
            <img
              src="https://cdn-icons-png.flaticon.com/128/1159/1159633.png"
              loading="lazy"
              alt="Edit "
              title="Edit"
              onClick={() => setShowForm(true)}
            />
          </div>
        </div>
        <div className="bottom">
          {about ? (
            <>
              <div className="detail">
                <h1>{about.name}</h1>
                <h2>{about.number}</h2>
                <h2 className="place">{about.place}</h2>
                <h2 className="email">{about.email}</h2>
              </div>

              {!about.name || !about.number || !about.place || !about.email ? (
                <div className="add-more">
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/15632/15632210.png"
                    loading="lazy"
                    alt="Add "
                    title="Add details"
                    onClick={() => setShowForm(true)}
                  />
                </div>
              ) : null}
            </>
          ) : (
            <h1>Your fetch datas are not found</h1>
          )}
        </div>

        {showForm && (
          <div className="editing">
            <EditForm
              onSave={() => setShowForm(false)}
              onUpdate={fetchDealerTable}
              id={id}
            />
          </div>
        )}
      </div>

      <div className="icons">
        <Link to={`/`}>
          <img
            src="https://cdn-icons-png.flaticon.com/128/9449/9449216.png"
            alt="Home"
            title="Home page"
            className="lzy lazyload--done"
          />
        </Link>
        <Link to={`/calculation/${id}`}>
          <img
            src="https://cdn-icons-png.flaticon.com/128/7506/7506073.png"
            loading="lazy"
            alt="Calculator "
            title="Calculation page "
          />
        </Link>
      </div>
    </div>
  );
}
