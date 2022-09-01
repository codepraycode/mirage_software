import { immediateToast } from 'izitoast-react'
import 'izitoast-react/dist/iziToast.css';


export const BottomRightToast = (message) => {
    immediateToast('info', {
        message,
        position: 'bottomLeft',
    })
}