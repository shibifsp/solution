import React, { useState, useEffect } from "react";
import supabase from "../Config/supabaseClient";
import "../css/Index.css";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import CustomAlert from "./CustomAlert";
import moment from "moment";

export default function Index() {
  const [searchItem, setSearchItem] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState("");
  const [memberRemove, setMemberRemove] = useState(null);
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [everyDebitBalance, setEveryDebitBalance] = useState([]);
  const [everyCreditBalance, setEveryCreditBalance] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    fetchTotalDebit();
    fetchDealers();
  }, []);

  const fetchDealers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("dealers")
      .select("*, calculations(amount.sum(), type)");

    if (error) {
      console.error("Error fetching members", error);
    } else {
      setMembers(data);

      let sumOfCredit = 0;
      let sumOfDebit = 0;
      data.forEach((member) => {
        if (Array.isArray(member.calculations)) {
          const eachTotal = member.calculations.reduce((total, item) => {
            return item.type === "C" ? total + item.sum : total - item.sum;
          }, 0);

          if (eachTotal > 0) {
            sumOfDebit += eachTotal;
          } else if (eachTotal < 0) {
            sumOfCredit += eachTotal;
          }
        }
      });

      setEveryCreditBalance(sumOfCredit);
      setEveryDebitBalance(sumOfDebit);
      setLoading(false);
    }
  };

  const fetchTotalDebit = async () => {
    const { data, error } = await supabase
      .from("calculations")
      .select("amount.sum(), type");
    if (error) {
      console.error("Error fetching data for Total", error);
    } else {
      const debitItem = data.find((item) => item.type === "D");
      const creditItem = data.find((item) => item.type === "C");

      setTotalDebit(debitItem?.sum || 0);
      setTotalCredit(creditItem?.sum || 0);
    }
  };

  console.log(members);
  const handleSearchItem = (e) => {
    setSearchItem(e.target.value);
  };

  const removeMember = async (id) => {
    const { data, error } = await supabase
      .from("dealers")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
    } else {
      setMembers(members.filter((member) => member.id !== id));
      setMemberRemove(false);
      fetchTotalDebit();
      await fetchDealers();
    }
  };

  const netAmount = (totalDebit || 0) - (totalCredit || 0);
  const absoluteNetAmount = Math.abs(netAmount);
  const formattedNetAmount = absoluteNetAmount.toLocaleString("en-US");

  const creditBalance = everyCreditBalance;
  const absoluteCreditBalance = Math.abs(creditBalance);
  const formatedCreditBalance = absoluteCreditBalance.toLocaleString("en-US");

  const debitBalance = everyDebitBalance;
  const formatedDebitBalance = debitBalance.toLocaleString("en-US");

  return (
    <div className="index">
      <div className="container">
        <div className="nav-bar">
          <h2>Solution</h2>
        </div>
        <div className="bottom">
          <div className="net-amount">
            <div className="balance">
              <p>You will Get:</p>
              <h3 style={{ color: "green" }}>{formatedCreditBalance}</h3>
            </div>

            <div className="net-balance">
              <p>NET BALANCE:</p>
              {netAmount > 0 ? (
                <div className="current-amount">
                  <p>You'll Get:</p>
                  <h2 style={{ color: "green" }}>{formattedNetAmount}</h2>
                </div>
              ) : netAmount < 0 ? (
                <div className="current-amount">
                  <p> You'll Give:</p>
                  <h2 style={{ color: "red" }}>{formattedNetAmount}</h2>
                </div>
              ) : (
                netAmount
              )}
            </div>

            <div className="balance">
              <p>You will Give:</p>
              <h3 style={{ color: "red" }}>{formatedDebitBalance}</h3>
            </div>
          </div>

          <div className="search">
            <input
              type="text"
              id="search-val"
              placeholder="Search Member"
              value={searchItem}
              onChange={handleSearchItem}
            />
            <label for="search-val" className="logo-container">
              <FaSearch className="search-icon" />
            </label>
          </div>

          <div className="members">
            <div className="blur"></div>
            <ul>
              {members

                .filter((member) =>
                  member.name.toLowerCase().includes(searchItem)
                )

                .map((member, i) => {
                  const everySum = member.calculations.reduce((total, item) => {
                    return item.type === `C`
                      ? total + item.sum
                      : total - item.sum;
                  }, 0);
                  const absoluteEverySum = Math.abs(everySum);
                  const formattedEverySum =
                    absoluteEverySum.toLocaleString("en-US");



                  const takedDate = members.map(member => new Date(member.date));
                  const latestDate = new Date(Math.max(...takedDate));
                  const formattedTakedDate =
                    moment(latestDate).format("DD-MM-YYYY");

                  return (
                    <div key={i} className="member-row">
                      <div className="content-members">
                        <div className="date">
                          <li
                            onClick={() => {
                              navigate(`/calculation/${member.id}`);
                            }}
                          >
                            {member.name}
                          </li>
                          <p className="current-date">{formattedTakedDate}</p>
                        </div>
                        <div className="row-total">
                          <p
                            className="current-total"
                            style={{
                              color:
                                everySum < 0
                                  ? "green"
                                  : everySum > 0
                                  ? "red"
                                  : "black",
                            }}
                          >
                            {formattedEverySum}
                          </p>
                        </div>

                        <div
                          className="img-delete"
                          onClick={() => setMemberRemove(member.id)}
                        >
                          <img
                            src="https://cdn-icons-png.flaticon.com/512/8835/8835390.png"
                            alt="Delete icon member"
                            title="Delete this Member"
                          />
                        </div>
                      </div>

                      {memberRemove === member.id && (
                        <CustomAlert
                          message={`Do you want to delete " ${member.name} " and all their data? This action is permanent.`}
                          onSure={() => removeMember(member.id)}
                          onCancel={() => setMemberRemove(null)}
                        />
                      )}
                    </div>
                  );
                })}
            </ul>
          </div>
          <Link to={"/login"} className="add-member">
            ADD MEMBER
          </Link>
        </div>
      </div>
    </div>
  );
}
