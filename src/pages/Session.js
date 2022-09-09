import React from 'react';
import { useParams } from 'react-router-dom';


const Session = () => {
  const {sessionId} = useParams();

  return (
    <div>Session with id {sessionId}</div>
  )
}

export default Session