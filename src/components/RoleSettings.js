import React, { useState } from 'react';

import { capitalize } from '../constants/utils';
import Loading from '../widgets/Preloader/loading';

const RoleSettings = () => {

    const all_staffs = [];

    const roles_settings = [];


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
        console.log(roles_settings);
    }

 
    const renderRole = (role_data) => {
        let { role_name, ...rest } = role_data;

        return (

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
                        value={rest.role_label}
                        onChange={(e) => {
                            handleInputChange(e, role_name)

                        }}
                    />
                </div>

                {
                    rest.staff_id || rest.staff_id === null ?
                        <div className="form-group">

                            <select
                                className="form-control"
                                name={'staff_id'}
                                value={rest.staff_id ?? ''}
                                onChange={(e) => {
                                    handleInputChange(e, role_name)

                                }}
                            >
                                <option value="">Select Staff</option>
                                {
                                    all_staffs.map((each, i) => {
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
                        :
                        null
                }
            </div>

        )
    }


    if (loading) return <Loading />;

    if (error) {
        return (
            <p className="text-muted text-center">
                {capitalize(error)}
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
                            Object.entries(roles_settings).map(([field, conf], i) => {
                                let role_data = {
                                    role_name: field,
                                    ...conf
                                }

                                return (
                                    <div key={i}>
                                        {renderRole(role_data, i)}
                                        <hr />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </form>
    );
};

export default RoleSettings;