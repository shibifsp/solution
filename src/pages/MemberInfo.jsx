import React,{ useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function MemberInfo() {

  const { id } = useParams();
 
  useEffect(  () => {
    
  })

  return (
    <div className='member-info'>
      {id}
    </div>
  )
}
