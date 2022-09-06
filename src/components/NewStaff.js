import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSettingsUpdateStatus, updateStaffs, getSettingsStaffById } from '../app/settingsSlice';
import { StaffsDataSchema } from '../constants/form_configs';
import { statuses } from '../constants/statuses';

import { createFormDataFromSchema, createField, } from '../constants/utils';


const NewStaff = ({ goBack, staff_id }) => {

    const staff = useSelector((state) => getSettingsStaffById(state,staff_id));

    const status = useSelector(getSettingsUpdateStatus);
    const storeDispatch = useDispatch();   

    const [staffProfile, setStaffProfile] = useState(() => {
        const form_ = createFormDataFromSchema(StaffsDataSchema);
        if (!Boolean(staff)) return form_;


        for (let [field, config] of Object.entries(form_.form)) {

            if (staff[field]) {

                config.config.value = staff[field]
            }
        }

        return form_
    });


    const [loading, setLoading] = useState(false);

    const [noOfChanges, setNoOfChanges] = useState(0);


    const anyChanges = noOfChanges > 0;


    const gatherData = () => {
        // Gather Data from state
        let phase_data = {};
        for (let [field, config] of Object.entries(staffProfile.form)) {
            phase_data[field] = config.config.value;
        }

        if(Boolean(staff)){
            phase_data._id = staff._id;
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


        // console.log(field_name, "changed to", field_value);

        let state_form = staffProfile.form;

        if (!Boolean(state_form[field_name])) return;

        state_form[field_name].config.value = field_value;

        setStaffProfile((prev) => {
            return {
                ...prev,
                form: state_form
            }
        });

        if (Boolean(staff)){
            setNoOfChanges((pp) => {
                if (pp === 0) return 0;

                if (Object.is(state_form[field_name], field_value)) {
                    return pp - 1;
                }

                return pp + 1;
            })
        }
        

    }


    const handleSubmit = (e) => {
        e.preventDefault();

        let data = gatherData();
        // console.log(data);

        storeDispatch(updateStaffs(data));


        setLoading(true);

       
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

        if (!anyChanges) {
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

    const checkLoadStatus = () => {
        if (status === statuses.idle && loading) {
            // setLoading(false);
            // setNoOfChanges(0);
            goBack()
        }
    }

    useEffect(() => {
        checkLoadStatus();
    })

    return (

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
                    onClick={() => {
                        if (loading) return

                        goBack()
                    }}
                    style={{ fontSize: '19px', cursor: 'pointer' }}
                ></i>

                <div
                    className='d-flex align-items-center justify-content-between'
                >
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

    );
};

export default NewStaff;