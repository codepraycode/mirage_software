import React from 'react'

function Spinner({text,...rest}) {
    return (
        <span {...rest}>
            <span className={`spinner ${text ? 'mr-2':''}`}>
                <i className="fas fa-spinner"></i>
            </span>
            <span className="text-muted">
                {text}
            </span>
            
        </span>
    )
}

export default Spinner
