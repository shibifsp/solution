import React from 'react';
import '../css/calculation.css'

export default function Calculation() {
  return (
    <div className='calculation'>
      <div className="container">
        <div className="nav-bar">
          <h1>Name</h1>
        </div>
        <div className="content">
          <div className="calculation-contents">
            <form action="">
              <table>
                <thead>
                  <tr>
                    <th>Info</th>
                    <th>Amout</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <input type="text" />
                    <input type="text" />
                    <td className="button">
                      <button>+</button>
                      <button>-</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Cash</td>
                    <td>50000</td>
                    <td className="button">
                      <button>+</button>
                      <button>-</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Cash</td>
                    <td>20000</td>
                    <td className="button">
                      <button>+</button>
                      <button>-</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Cash</td>
                    <td>7500</td>
                    <td className="button">
                      <button>+</button>
                      <button>-</button>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <th colSpan={3}>
                      <span>Total</span> 
                      <span>amount</span>
                    </th>
                  </tr>
                </tfoot>
              </table>
            </form>
            
          </div>
          <div className="buttons">
            <button>History</button>
            <button>Clear</button>
            <button>Enter</button>
          </div>
        </div>
        <div className="history">

        </div>
      </div>
    </div>
  )
}
