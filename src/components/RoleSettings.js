import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSettingsStaffs, getSettingsRoles, getSettingsUpdateStatus, updateRoles, getSettingsLevels } from '../app/settingsSlice';
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
    const all_levels = useSelector(getSettingsLevels)

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
        

        let role_setting = roles[name];

       
        setRoleData((prev) => {
            if (Boolean(role_setting)){
                return {
                    ...prev,
                    [name]: {
                        ...role_setting,
                        ...data,
                    },
                }
            }else{
                 // working on levels which is an array
                 let updated = false;

                let level_roles = prev.level_roles.map((each) => {

                    if (each.level_id === data.level_id) {
                        updated = true;
                        return {
                            ...each,
                            ...data,
                        }
                    }

                    return each;
                })

                if(!updated){
                    level_roles.push(data);
                }

                return {
                    ...prev,
                    level_roles
                }
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


    const { school_head, level_roles } = roleData;
    

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
                        <RoleItem
                            role_name={'school_head'}
                            role_data={school_head}
                            staffs={all_staffs}
                            onChange={handleRoleChange}
                        />

                        {
                            Object.entries(all_levels).map(([_id, level_info], i) => {

                                const level__role = level_roles.find(lvl=>lvl?.level_id === _id) || null;

                                return (<RoleItem
                                    key={_id}
                                    role_name={level_info.label}
                                    role_data={{
                                        level_id: _id,
                                        label: level__role?.label || 'class teacher',
                                        ...level__role,
                                    }}
                                    staffs={all_staffs}
                                    onChange={handleRoleChange}
                                />);
                            })
                        }
                    </div>
                </div>
            </div>
        </form>
    );
};

export default RoleSettings;