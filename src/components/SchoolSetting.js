import React, { useState } from 'react';

import Loading from '../widgets/Preloader/loading';

import { createField, createFormDataFromSchema } from '../constants/utils';
import { InitializeSchoolFormConfig } from '../constants/form_configs';


function SchoolSettings () {



    const [schoolProfile, setSchoolProfile] = useState(() => {
        const form_ = createFormDataFromSchema(InitializeSchoolFormConfig);
        return form_
    });

    
    const [loading, setLoading] = useState(false);
    const [anyChanges, setAnyChanges] = useState(false);

    const handleInputChange = (e) => {
        // console.log(e.target.name, "Changed");
        let field_name = e.target.name;
        let field_value = e.target.value;


        console.log(field_name,"changed to", field_value);
    }

    const gatherData = () => {
        let data = {};
        let state_form = schoolProfile.form;

        for (let [field, config] of Object.entries(state_form)) {
            data[field] = config.config.value;
        }

        return data;
    }

    const handleSave = () => {
        // let form_data = gatherData();

        // // console.log(form_data)
        // updateSettings({ id: state.setting_id, ...form_data })
        //     .then((n_data) => {
        //         // console.log(n_data);
        //         setState({
        //             ...state,
        //             any_changes: false,
        //             processing: false
        //         })
        //     })


        // setState({
        //     ...state,
        //     processing: true
        // })
    }


    if(loading){
        return <Loading />
    }

    // if(loaded){
    //     return (
    //         <p className="text-muted text-center">
    //             Unable to load school profile
    //         </p>
    //     )
    // }




    return (


        <div className="card">
            <div className="card-header">
                <h4>School Profile</h4>

                <div className="card-header-action">
                    {
                        anyChanges ?
                            <button
                                className={`btn btn-primary btn-icon icon-left ${loading ? 'disabled' : ''}`}
                                onClick={() => { handleSave() }}
                            >
                                {
                                    loading ?
                                        <span className="spinner">
                                            <i className="fas fa-spinner"></i>
                                        </span>
                                        :
                                        null
                                }

                                Save

                            </button>
                            :
                            null
                    }

                </div>

            </div>

            <div className="card-body">
                <>
                    {createField({ form: schoolProfile.form, groups: schoolProfile.groups }, handleInputChange)}
                </>
            </div>
        </div>

    )
}

export default SchoolSettings;
