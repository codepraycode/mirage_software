import { formatDistanceToNow } from 'date-fns';
import React from 'react'

const Time = ({time}) => {
    const date = new Date(time);
    return (
        <span>
            {date.toDateString()} {", "}
            {
                formatDistanceToNow(date, {
                    includeSeconds: false,
                    addSuffix: true,
                })
            }
        </span>
    )
}

export default Time