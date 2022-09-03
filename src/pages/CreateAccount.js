import React, { useState } from 'react';
import {useSelector, useDispatch} from 'react-redux';


// Slices
import { getSettingsUpdateStatus, updateSettings } from '../app/settingsSlice';

// Constants
import { InitializeSchoolFormConfig } from '../constants/form_configs';
import {createField, createFormDataFromSchema} from '../constants/utils';
import {statuses} from '../constants/statuses';


const CreateAccount = () => {

    const status = useSelector(getSettingsUpdateStatus)
    // const error = useSelector(getSettingsUpdateError)

    const storeDispatch = useDispatch();

    
    const [schoolProfile, setSchoolProfile] = useState(()=>{
        const form_ = createFormDataFromSchema(InitializeSchoolFormConfig);
        return form_
    });

    const [loading, setLoading] = useState(false);
    const [canProceed, setCanProceed] = useState(false);


    // const loading = status === statuses.loading;


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


    const gatherData = () => {
        let data = {}

        for (let [field, config] of Object.entries(schoolProfile.form)) {
            data[field] = config.config.value
        }


        return data;
    }


    const handleSubmit = (e)=>{
        e.preventDefault();

        let form_data = gatherData();

        console.log(form_data);

        storeDispatch(updateSettings({section:'school', data:form_data}))
        setLoading(true)

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

                        onChange={(e) => { 
                            setCanProceed((prev)=>{
                                return !prev;
                            }) 
                        }}
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