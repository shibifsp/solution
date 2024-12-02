import React, { useState, useEffect } from 'react';
import supabase from "../Config/supabaseClient"
import '../css/Index.css';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


export default function Index() {
   
  const [searchItem, setSearchItem] = useState(""); 
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState("");

  const navigate = useNavigate();

  useEffect( () => {
    const fetchDealers = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('dealers')
        .select('*')

      if (error) {
        console.error("Error fetching members", error);
      } else {
        setMembers(data)
        console.log(data)
      }
      setLoading(false)
    };

    fetchDealers();

  },[])

  const handleSearchItem = (e) => {
    setSearchItem(e.target.value)
  }
  
  const removeMember = async () => {
    const { data, error } = await supabase
      .from('dealers')
      .select('name')
      .del('name',id)

    if(error){
      console.error(error)
    } else {
      
    }
  }

  return (
    <div className='index'>
      <div className="container">
        <div className="nav-bar">
          <h2>Solution</h2>
        </div>
        <div className="bottom">
          <div className="search">
            <input 
              type="text" 
              id='search-val'
              placeholder='Search Member'
              value={searchItem}
              onChange={handleSearchItem}
            />
            <label for="search-val" className="logo-container">
              <FaSearch className='search-icon' />
            </label>
          </div>
          <div className="members">
            <div className="blur"></div>
            <ul>
              {members.map((member, id) => (
                <div className="member-row">
                  <li key={id}
                    onClick={() => {
                      navigate(`/calculation/${member.id}`)
                  }}
                  >{member.name}</li>

                  <img src="https://cdn-icons-png.flaticon.com/512/8835/8835390.png" alt="Recycle bin free icon" title="Recycle bin free icon" onClick={removeMember}/> 
                </div>               
              ))}
            </ul> 
          </div>
          <Link to={"/login"} className="add-member">
            ADD MEMBER
          </Link>
        </div>
      </div>
    </div>
  )
}
