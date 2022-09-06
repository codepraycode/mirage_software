import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { getSettingsStaffs, getSettingsRoles } from '../app/settingsSlice';

import { capitalize, isObjectEmpty } from '../constants/utils';
import Loading from '../widgets/Preloader/loading';


const RoleItem = ({role_name,role_data, staffs }) =>{

    const staff = staffs.find((a_staff) => a_staff._id === role_data.staff_id);
    
    return (
        <>

            <div className='d-flex align-items-center justify-content-between px-3 py-3'>

                <p className="lead lead-sm">
                    <b>For {capitalize(role_name)}</b>
                </p>

                <div className="form-group">
                    <label htmlFor="">This role is addressed as ?</label>
                    <input
                        className="form-control"
                        type="text"
                        name={'role_label'}
                        value={role_data?.label}
                        onChange={(e) => {
                            // handleInputChange(e, role_name)
                        }}
                    />
                </div>


                <div className="form-group">

                    <select
                        className="form-control"
                        name={'staff_id'}
                        value={staff?._id ?? ''}
                        onChange={(e) => {
                            handleInputChange(e, role_name)

                        }}
                    >
                        <option value="">Select Staff</option>
                        {
                            staffs.map((each, i) => {
                                let name = `${each.title} ${each.first_name} ${each.last_name}`;

                                return (
                                    <option value={each._id} key={i}>
                                        {name}
                                    </option>
                                )

                            })
                        }
                    </select>

                </div>
            </div>
        
            <hr />
        </>

    )
}


const RoleSettings = () => {

    const all_staffs = useSelector(getSettingsStaffs);

    const roles = useSelector(getSettingsRoles);

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [anyChanges, setAnyChanges] = useState(false);


    const handleInputChange = (e, side) => {
        let field_name = e.target.name;
        let field_value = e.target.value;


        console.log(field_name, "changed to", field_value);

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(roles_settings);
    }


    if (loading) return <Loading />;

    if (error) {
        return (
            <p className="text-muted text-center">
                {capitalize(error)}
            </p>
        )
    }

    if (isObjectEmpty(roles)) {
        return (
            <p className="text-muted text-center">
                Could not load roles
            </p>
        )
    }


    const renderButton = () => {
        if (processing) {
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
                    className={`btn btn-outline-primary`}
                    type="submit"
                >
                    Save
                </button>
            )
        }

        return null;
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="card">
                <div className="card-header d-flex justify-content-between align-item-center">
                    <h4>Roles</h4>

                    <div className="card-header-action">
                        {
                            renderButton()
                        }
                    </div>
                </div>

                <div className="card-body p-0">
                    <div className="text-muted text-center">
                        {
                            Object.entries(roles).map(([role_name, role_data], i) => {

                                if(Array.isArray(role_data)) return null;

                                return <RoleItem 
                                    role_name={role_name} 
                                    role_data={role_data} 
                                    key={i} 
                                    staffs={all_staffs}
                                />;
                            })
                        }
                    </div>
                </div>
            </div>
        </form>
    );
};

export default RoleSettings;