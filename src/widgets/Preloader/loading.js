import React from 'react';

const Loading = (props) => {
    let extra_style = {
        ...props.styles
    }
    
    return (
        <div className="text-center text-muted" style={extra_style}>
            <p className="spinner">
                Loading {props.text}
                <i className="ml-1 fad fa-spinner-third"></i>
            </p>
        </div>
    );
};

export default Loading;