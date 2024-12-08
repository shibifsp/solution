import React,{ useEffect,useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../Config/supabaseClient';
import '../css/MemberInfo.css';
import moment from 'moment';

export default function MemberInfo() {

  const { id } = useParams();
  const [dataDefined, setDataDefined] = useState([]);
 
  useEffect(  () => {
    const takeData = async () => {
      const { data, error } = await supabase
       .from('calculations')
       .select('*')
       .eq( 'coustomer_id', id)

      if(error){
        console.error("Your fetchData isn't fetch", error)
      } else {
        setDataDefined(data);
      }
    }
    takeData();
   },[id])

   const deleteRow = async (itemId) => {
    const { data, error } = await supabase  
      .from('calculations')
      .delete()
      .eq('id',itemId)

    if(error) {
      console.error("Your deleting process didn't working..", error);
    } else {
      setDataDefined(dataDefined.filter((row) => row.id !== itemId));
    }
   }

  return (
    <>
      <div className='memberInfo'>
        <div className="container-details">
          <div className="nav-bar">
            <h1>For will Getting</h1>
          </div>
          <div className="content-memberInfo">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Info</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th className='blank'></th>
                </tr>
              </thead>
              <tbody>
                {dataDefined.map((item) => {
                  const takedDate = item.date;
                  const formattedDate = moment(takedDate).format('DD-MMM-YYYY')
                  return (
                    <tr key={item.id}>
                      <td className='date'>{formattedDate}</td>
                      <td>{item.info}</td>
                      <td>{item.amount}</td>
                      <td className='type'>{item.type === 'C' ? "Credit" : "Debit"}</td>
                      <td className='delete'>
                       <img src="https://cdn-icons-png.flaticon.com/128/11540/11540197.png" srcset="https://cdn-icons-png.flaticon.com/128/11540/11540197.png 4x" alt="Delete" 
                       onClick={() => {deleteRow(item.id)}} />
                      </td>
                    </tr>
                  )  
                })}
                
              </tbody>
            </table>
          </div>
        </div>
        <div className="container-about">
          <div className="nav-bar">

          </div>
        </div>
      </div>
    </>
   
  )
}
