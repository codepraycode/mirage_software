import React, { useState } from 'react';

import StaffListings from './StaffListings';
import NewStaff from './NewStaff';

const StaffSettings = () => {

    const [addStaff, setAddStaff] = useState(false);
    const [updatingStaffId, setUpdatingStaffId] = useState(null);


    return (

        <div className="card">

            <div 
                className="card-header d-flex justify-content-between align-item-center"
            >
                <h4>Staffs</h4>

                <div className="card-header-action">
                    <button
                        className={`btn btn-primary ${addStaff ? 'disabled' : ''}`}
                        onClick={() => { setAddStaff(true) }}
                    >
                        Add Staff
                    </button>
                </div>
            </div>

            <div className="card-body p-0">
                {
                    addStaff ?
                        <NewStaff
                            goBack={() => {

                                setAddStaff(false);

                                if(updatingStaffId !== null){
                                    setUpdatingStaffId(null);
                                }
                            }}

                            staff_id={updatingStaffId}
                        />
                        :
                        <StaffListings 
                            toUpdate={(id = null) => { 
                                // console.log(id); 

                                setAddStaff(true);

                                if ( !Object.is(id, updatingStaffId) ){
                                    setUpdatingStaffId(id);
                                }
                            }}

                        />
                }


            </div>


        </div>
    );
};

export default StaffSettings;