import React from 'react';

import { useToast} from 'izitoast-react'
import 'izitoast-react/dist/iziToast.css';

const Toast = (props) => {
  const showMessage = useToast({
    message: 'Show my message :)',
    position:'bottomLeft',
    color:'yellow'
  });
  // useEffect(() => {
  //   immediateToast('info', {
  //     message: 'Hi, how it is going'
  //   })
  // });


  return (
    <div onClick={showMessage} style={{cursor:'pointer'}}>
        {props.children}
    </div>
  )
};

export default Toast;