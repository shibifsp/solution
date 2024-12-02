import React from 'react'
import '../css/CustomAlert.css'

export default function CustomAlert({message, onSure, onCancel}) {
  return (
    <div className='custom-alert'>
      <div className="alert_body">
        <p>{message}</p>
        <div className="alert_actions">
          <button className="btn_clear" onClick={onSure}>Yes</button>
          <button className="btn_cancel" onClick={onCancel}>No</button>
        </div>
      </div>
      
    </div>
  )
}
