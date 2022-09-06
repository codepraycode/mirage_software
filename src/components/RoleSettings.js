import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSettingsStaffs, getSettingsRoles, getSettingsUpdateStatus, updateRoles } from '../app/settingsSlice';
import { statuses } from '../constants/statuses';

import { capitalize, isObjectEmpty } from '../constants/utils';


const RoleItem = React.memo(({ role_name, role_data, staffs, onChange }) =>{

    const staff = staffs.find((a_staff) => a_staff._id === role_data.staff_id);

    const handleInputChange = (e)=>{
        e.preventDefault();

        let input_name = e.target.name;
        let input_value = e.target.value;

        onChange(role_name, {
            ...role_data,
            [input_name]:input_value
        });
    }

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
                        name={'label'}
                        value={role_data?.label ?? ''}
                        onChange={handleInputChange}
                    />
                </div>


                <div className="form-group">

                    <select
                        className="form-control"
                        name={'staff_id'}
                        value={staff?._id ?? ''}
                        onChange={handleInputChange}
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
});


const RoleSettings = () => {

    const all_staffs = useSelector(getSettingsStaffs);

    const roles = useSelector(getSettingsRoles);
    const status = useSelector(getSettingsUpdateStatus);

    const storeDispatch = useDispatch();

    const [roleData, setRoleData] = useState(()=>{
        if(!Boolean(roles)) return {};


        return {...roles}
    });


    const [loading, setLoading] = useState(false);
    const [noOfChanges, setNoOfChanges] = useState(0);


    const anyChanges = noOfChanges > 0;



    const handleRoleChange = (name, data) => {
        
        console.log("changes in", name, ">>",data);

        let role_setting = roles[name];

        if (!Boolean(role_setting)) return;


        if (Array.isArray(role_setting)){
            // 
        }else{
            role_setting = {
                ...role_setting,
                ...data
            }
        }

        setRoleData((prev) => {
            return {
                ...prev,
                [name]: role_setting
            }
        });

        if (Boolean(roles)) {
            setNoOfChanges((pp) => {

                if (Object.is(role_setting, data)) {
                    if (pp === 0) return 0;

                    return pp - 1;
                }

                return pp + 1;
            })
        }

    }


    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(roleData);

        storeDispatch(updateRoles(roleData));
        setLoading(true);
    }


    if (isObjectEmpty(roles)) {
        return (
            <p className="text-muted text-center">
                Could not load roles
            </p>
        )
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
                    className={`btn btn-outline-primary`}
                    type="submit"
                >
                    Save
                </button>
            )
        }

        return null;
    }



    const checkLoadStatus = () => {
        if (status === statuses.idle && loading) {
            setLoading(false);
            setNoOfChanges(0);
            
        }
    }

    useEffect(() => {
        checkLoadStatus();
    })

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
                            Object.entries(roleData).map(([role_name, role_data], i) => {

                                if(Array.isArray(role_data)) return null;

                                return <RoleItem 
                                    role_name={role_name} 
                                    role_data={role_data} 
                                    key={i} 
                                    staffs={all_staffs}
                                    onChange={handleRoleChange}
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