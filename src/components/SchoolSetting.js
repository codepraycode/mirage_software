import React, { useEffect, useState } from 'react';
import {useSelector, useDispatch} from 'react-redux';


import { getSettingsSchool, getSettingsUpdateStatus, updateSchool } from '../app/settingsSlice';


import Loading from '../widgets/Preloader/loading';

import { createField, createFormDataFromSchema } from '../constants/utils';
import { InitializeSchoolFormConfig } from '../constants/form_configs';
import { statuses } from '../constants/statuses';


function SchoolSettings () {


    const school = useSelector(getSettingsSchool);


    const [schoolProfile, setSchoolProfile] = useState(() => {
        let form_ = createFormDataFromSchema(InitializeSchoolFormConfig);
        
        if(!Boolean(school)) return form_;


        for (let [field, config] of Object.entries(form_.form)) {

            if (school[field]) {

                config.config.value = school[field]
            }
        }

        return form_
    });

    
    const [loading, setLoading] = useState(false);
    const status = useSelector(getSettingsUpdateStatus);
    const storeDispatch = useDispatch();    

    const [noOfChanges, setNoOfChanges] = useState(0);


    const anyChanges = noOfChanges > 0;

    const handleInputChange = (e) => {
        // console.log(e.target.name, "Changed");
        let field_name = e.target.name;
        let field_value = e.target.value;

        let school_form = schoolProfile.form;


        if (!Boolean(school_form[field_name])) return;


        school_form[field_name].config.value = field_value;

        setSchoolProfile((prev)=>{
            return {
                ...prev,
                form: school_form
            }
        });

        setNoOfChanges((pp) => {

            if (Object.is(school[field_name], field_value)){
                return pp-1;
            }

            return pp+1;
        })
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
        const data = gatherData();

        storeDispatch(updateSchool(data));


        setLoading(true);
    }


    const checkLoadStatus = ()=>{
        if (status === statuses.idle && loading){
            setLoading(false);
            setNoOfChanges(0);
        }
    }

    useEffect(()=>{
        checkLoadStatus();
    })

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
