import React from 'react';
import './modal.scss';

function Modal(props) {
    /* 
    props includes 
    {
        title:str,
        onClose:function(),
        onSave:function(),
        affirmTxt:str,
        cancelTxt:str,
        loading:boolean,
        disableAffirm:boolean,
        hideActionBtn:boolean,
    }
     */
    // console.log(props.disableAffirm, props.loading)
    return (
        <div className="appModal">
            <div className="overlay"></div>

            <div className="card">
                <div className="card-header">
                    <h5 className="modal-title mr-auto" id="exampleModalLabel">
                        {props.title}
                    </h5>
                    {
                        !props.loading ? 
                        <button type="button" className="btn-close" onClick={()=>props.onClose()}>
                            <i className="fa fa-times" aria-hidden="true"></i>
                        </button>
                        :
                        <span className="spinner">
                            <i className="ml-1 fad fa-spinner-third"></i>
                        </span>
                    }
                    
                </div>
                
                <div className="card-body" style={{overflowX:'hidden'}}>
                    {props.children}
                </div>

                <div className="card-footer">
                    {
                       props.hideActionBtn === true ? 
                    null
                    :
                    <>
                        <button 
                            type="button" 
                            className="btn btn-secondary mr-4" 
                            onClick={()=>props.onClose()}
                            disabled = {Boolean(props.loading)}
                        >
                            {!props.cancelTxt ? 'Cancel':props.cancelTxt}
                        </button>

                        <button 
                            type="button" 
                            className={props.disableAffirm ? "btn btn-primary disabled"  : "btn btn-primary" }
                            onClick={()=>props.onSave()}
                            disabled={
                                props.disableAffirm === true || Boolean(props.loading)
                                ? 
                                true : false
                            }
                        >
                            {!props.affirmTxt ?'Continue':props.affirmTxt}

                        </button>
                    </>
}
                </div>
            </div>
        </div>

    )
}

export default Modal;
