import React,{useState} from 'react';
import CreateAccount from '../pages/CreateAccount';
import CreateUser from '../pages/CreateUser';
import '../scss/auth_style.scss';

const Initialization = ()=>{
    const [stageIndex, setStateIndex] = useState(1);


    let headerText = "Setup App";

    if(stageIndex === 1){
        headerText = "Setup school"
    }else if(stageIndex === 2){
        headerText = "Add account"
    }

    const renderFormSection = () => {
        
        if (stageIndex === 1) {
            return <CreateAccount proceed={()=>setStateIndex(2)} />
        }
        else {
            return <CreateUser goBack={() => setStateIndex(1)} />
        }

    }

    return (
        <div className="auth_screen">
            <div className="container register">

                <div className="row">
                    <div className="col-md-3 register-left">
                        <img src="./logo.png" alt="Mirage School Software" />
                        <h3>Welcome</h3>
                        <p>Take a few steps to quickly setup</p>
                    </div>

                    <div className="col-md-9 register-right">
                        <div className="headings">
                            <h3 className="register-heading">
                                {headerText}
                            </h3>

                            <ul className="nav nav-tabs nav-justified" id="myTab" role="tablist">
                                <li className="nav-item">
                                    <span
                                        className={`nav-link ${stageIndex === 1 ? 'active' : ''}`}
                                    >
                                        School
                                    </span>
                                </li>

                                <li className="nav-item">
                                    <span
                                        className={`nav-link ${stageIndex === 2 ? 'active' : ''}`}
                                    >
                                        User
                                    </span>
                                </li>

                            </ul>
                        </div>
                        <div className="tab-content" id="myTabContent">
                            {
                                renderFormSection()
                            }


                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
};


export default Initialization;