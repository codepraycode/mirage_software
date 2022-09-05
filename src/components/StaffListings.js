import React, { useState } from 'react';


import { isArrayEmpty, capitalize, getDate, parseFileUrl, isObjectEmpty } from '../constants/utils';

import Loading from '../widgets/Preloader/loading';
import Modal from '../widgets/Modal/modal';
import { avatar } from '../constants/assets';
import { useSelector, useDispatch } from 'react-redux';
import { deleteStaff, getSettingsStaffs } from '../app/settingsSlice';





const StaffListings = ({ toUpdate }) => {


    const staffs = useSelector(getSettingsStaffs);
    const storeDispatch = useDispatch();

    const loading = false;
    const [deletingStaff, setDeletingStaff] = useState(null);



    if (loading) {
        return (
            <Loading />
        )
    }



    if (isArrayEmpty(staffs)) {
        return (
            <p className="text-muted text-center">
                No Staffs Data
            </p>
        )
    }

    const renderStaffDelete = () => {
        
        if (isObjectEmpty(deletingStaff)) return;

        let { _id, title, first_name, last_name } = deletingStaff;

        return (
            <Modal
                title={`Delete ${title} ${first_name} ${last_name}`}
                onClose={() => { setDeletingStaff(null) }}

                onSave={() => { 
                    console.log("Deleting staff with id", _id);

                    
                }}

                loading={loading}
                
                hideActionBtn={true}
            >
                <p>
                    Are you sure you want to delete
                </p>

                <h4>{capitalize(title)} {capitalize(first_name)} {capitalize(last_name)}</h4>

                <p>from being a staff ? (this cannot be reverted)</p>

                <div className="d-flex align-center justify-content-center">
                    <button
                        className="btn btn-primary mr-4"
                        onClick={() => { setDeletingStaff(null) }}
                    >
                        No
                    </button>

                    <button
                        className="btn btn-danger"
                        onClick={() => { 
                            console.log("Deleting staff with id", _id);
                            storeDispatch(deleteStaff(_id));
                            setDeletingStaff(null);
                        }}
                    >
                        Yes
                    </button>
                </div>

            </Modal>
        )
    }

    return (

        <>
            {renderStaffDelete()}
            

            <table className="table table-striped v_center">

                <thead>
                    <tr className="">
                        <th>Name</th>
                        <th>Date Added</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {
                        staffs.map((each, i) => {
                            return (
                                <tr key={i}>
                                    <td className="">
                                        <div className="d-flex align-items-center">

                                            <img
                                                src={parseFileUrl(each.passport)}
                                                onError={
                                                    ({ currentTarget }) => {
                                                        currentTarget.onerror = null; // prevents looping
                                                        currentTarget.src = avatar;
                                                    }
                                                }
                                                alt={`${each.first_name}'s passport`}
                                                className=" mr-3 img-fluid"
                                                width="35"
                                                data-toggle="tooltip"
                                                title={`${each.first_name}'s passport`}
                                            />

                                            <span>
                                                {each.preffix} {capitalize(each.first_name)} {capitalize(each.last_name)}
                                            </span>
                                        </div>
                                    </td>

                                    <td>
                                        <small>
                                            {getDate(each.date_added)}
                                        </small>
                                    </td>

                                    <td>
                                        <div className="badge badge-success">
                                            Active
                                        </div>
                                    </td>

                                    <td className='d-flex justify-content-around align-items-center'>
                                        <button
                                            className="btn text-primary"
                                            onClick={() => toUpdate(each._id)}
                                        >
                                            <i className="fas fa-cog"></i>
                                        </button>

                                        <button
                                            className="btn text-danger"
                                            onClick={() => { setDeletingStaff(()=>each) }}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>

                                </tr>
                            )
                        })
                    }

                </tbody>


            </table>
        </>
    );
};

export default StaffListings;