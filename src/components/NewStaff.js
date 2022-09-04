import React, { useState } from 'react';
import { StaffsDataSchema } from '../constants/form_configs';

import { createFormDataFromSchema, createField, } from '../constants/utils';

import Loading from '../widgets/Preloader/loading';


const NewStaff = (props) => {

    const [staffProfile, setStaffProfile] = useState(() => {
        const form_ = createFormDataFromSchema(StaffsDataSchema);
        return form_
    });


    const [loading, setLoading] = useState(false);
    const [anyChanges, setAnyChanges] = useState(false);


    const gatherData = () => {
        // Gather Data from state
        let phase_data = {};
        for (let [field, config] of Object.entries(staffProfile.form)) {
            phase_data[field] = config.config.value;
        }

        return phase_data;
    }

    const handleInputChange = (e) => {

        let field_name = e.target.name;
        let field_type = e.target.type;
        let field_value = e.target.value;


        if (!['radio'].includes(field_type)) {
            e.preventDefault();
        } else {
            field_value = e.target.dataset.val;
        }


        console.log(field_name, "changed to", field_value);

        // let state_form = staffProfile.form;

        // let field = state_form[field_name]
        // // console.log(field_name,`in phase${current_phase}`,field);
        // if (!field) return;

        // field.config.value = field_value;

        // state_form[field_name] = { ...field }

        // setState({
        //     ...state,
        //     form: state_form,
        //     any_actions: true
        // })

    }


    const handleSubmit = (e) => {
        e.preventDefault();

        let form_data = gatherData();
        console.log(form_data);

       
    }


    const renderButton = () => {
        if (loading) {
            return (
                <button
                    className={`btn btn-outline-primary disabled`}
                    disabled={true}
                >
                    <span className="spinner mr-3">
                        <i className="fas fa-spinner"></i>
                    </span>
                    Saving...
                </button>
            )
        }

        if (anyChanges) {
            return (
                <button
                    className={`btn btn-outline-primary disabled`}
                    disabled={true}
                >
                    Save
                </button>
            )
        }

        return (
            <button
                className={`btn btn-outline-primary`}
                type="submit"
            >
                Save
            </button>
        )
    }

    // console.log(state);

    return (

        <>
            {
                loading ?
                    <Loading />
                    :

                    <form 
                        className="container" 
                        onSubmit={handleSubmit}
                    >

                        <div 
                            className="d-flex align-items-center justify-content-between my-3"
                        >

                            <i
                                className="fa fa-arrow-left text-primary" 
                                aria-hidden="true"
                                onClick={() => props.goBack()}
                                style={{ fontSize: '19px', cursor: 'pointer' }}
                            ></i>

                            <div 
                                className='d-flex align-items-center justify-content-between'
                            >
                                {
                                    props.staff_id ?

                                        <div className="form-group my-auto mr-3">
                                            
                                            <label className="custom-switch mt-2">

                                                <input
                                                    type="checkbox"
                                                    name="custom-switch-checkbox"
                                                    className="custom-switch-input"
                                                    // checked={state.status.active}
                                                    checked={true}
                                                    onChange={() => { }}
                                                />

                                                <span className="custom-switch-indicator"></span>
                                                <span className="custom-switch-description">

                                                    Active
                                                    
                                                </span>
                                            </label>
                                        </div>
                                        :
                                        null

                                }

                                <div>

                                    {renderButton()}
                                </div>
                                
                            </div>

                        </div>

                        <div className='text-center text-muted'>
                            {createField({ form: staffProfile.form, groups: staffProfile.groups }, handleInputChange)}

                            <div className="d-flex justify-content-between my-2">
                                <div className=""></div>
                                {renderButton()}
                            </div>
                        </div>

                    </form>
            }
        </>

    );
};

export default NewStaff;