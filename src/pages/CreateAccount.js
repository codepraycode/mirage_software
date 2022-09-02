import React, { useState } from 'react';
import { InitializeSchoolFormConfig } from '../constants/form_configs';
import {createField, createFormDataFromSchema} from '../constants/utils';


const CreateAccount = () => {
    const [schoolProfile, setSchoolProfile] = useState(()=>{
        const form_ = createFormDataFromSchema(InitializeSchoolFormConfig);
        return form_
    });

    const [loading, setLoading] = useState(false);
    const [canProceed, setCanProceed] = useState(false);


    const handleInputChange = (e) => {
        // e.preventDefault();
        let target = e.target.name;
        let value = e.target.value;
        // console.log(target,value);
        let form = schoolProfile.form;

        if (form[target]) {
            form[target].config.value = value;
        }

        setSchoolProfile((prev)=>{
            return{
                ...prev,
                form
            }
        })
    }


    const handleSubmit = (e)=>{
        e.preventDefault();
    }


    const renderButton = () => {
        if (loading) {
            return (
                <button
                    className="btn btn-primary disabled btnRegister login loading"
                    disabled={true}
                >
                    <span className="spinner load_spinner">
                        <i className="fas fa-spinner"></i>
                    </span>
                    Loading...
                </button>
            )
        }


        const btnProp = {
            type: "submit",
            className: canProceed ? "btnRegister" : "btn btn-primary btnRegister disabled",
            disabled: !canProceed
        }

        return (
            <button {...btnProp}>
                Next
            </button>
        )
    }



    return (
        <form onSubmit={handleSubmit}>
            <div>
                {
                    createField({ form: schoolProfile.form, groups: schoolProfile.groups }, handleInputChange, 'School')
                }
            </div>

            <div className="form_footer my-3">
                <div className="custom-control custom-checkbox">
                    <input
                        type="checkbox"
                        className="custom-control-input"
                        id={'accept_tc'}

                        // onChange={(e) => { setState({ ...state, canProceed: !state.canProceed }) }}
                        readOnly={true}
                    />
                    <label className="custom-control-label" htmlFor={'accept_tc'}>
                        I accept the Terms and Conditions of Mirage
                    </label>
                </div>

                {
                    renderButton()
                }
            </div>

        </form>
    )
}

export default CreateAccount;