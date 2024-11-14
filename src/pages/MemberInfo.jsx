import React,{ useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function MemberInfo() {

  const { id } = useParams();
 
  useEffect(  () => {
    
  })

  return (
    <div className='member-info'>
      <div className="container">
        <table>
          <thead>
            <tr>
              <th>Info</th>
              <th>Amount</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>cash</td>
              <td>55250</td>
              <td>+</td>
            </tr>
            <tr>
              <td>k1</td>
              <td>35250</td>
              <td>-</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th>Total</th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
