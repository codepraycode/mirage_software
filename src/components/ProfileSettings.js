import React, { useState } from 'react'
import { avatar } from '../constants/assets';

import { parseFileUrl } from '../constants/utils';

import Loading from '../widgets/Preloader/loading';

function ProfileSettings() {

    const userInfo = null;


    return (
        <>
            <div className="card">
                <div className="card-header">
                    <h4>Edit Profile</h4>
                </div>

                <div className="card-body">
                    {
                        userInfo === null ?
                            <Loading />
                            :
                            <>
                                <div className="form-group img_group">
                                    <div
                                        className="preview-container text-center"
                                        style={{ height: "100px", margin: '0 0 20px 0' }}
                                    >
                                        <img
                                            src={parseFileUrl(userInfo.avatar)}
                                            onError={
                                                ({ currentTarget }) => {
                                                    currentTarget.onerror = null; // prevents looping
                                                    currentTarget.src = avatar;
                                                }
                                            }
                                            alt={`${userInfo.first_name}'s passport`} className="img-fluid"
                                            style={{ height: "100%" }}
                                        />
                                    </div>

                                    <input
                                        type="text"
                                        name="passport"
                                        className="form-control"
                                        value={userInfo.avatar ? userInfo.avatar : ''}
                                        placeholder="No Passport uploaded"
                                        readOnly={true}
                                    />
                                </div>

                                <div className="row">
                                    <div className="form-group col-md-6 col-12">
                                        <label>First Name</label>
                                        <input type="text" className="form-control"
                                            value={userInfo.first_name}
                                            //    onChange={(e)=>{console.log(e.target.value)}}
                                            readOnly
                                        />

                                    </div>

                                    <div className="form-group col-md-6 col-12">
                                        <label>Last Name</label>
                                        <input type="text" className="form-control"
                                            value={userInfo.first_name}
                                            //    onChange={(e)=>{console.log(e.target.value)}}
                                            readOnly
                                        />

                                    </div>
                                </div>

                                <div className="row">
                                    <div className="form-group col-md-7 col-12">
                                        <label>Email</label>
                                        <input type="email" className="form-control"
                                            value={userInfo.email}
                                            //    onChange={(e)=>{console.log(e.target.value)}}
                                            readOnly
                                        />

                                    </div>
                                    <div className="form-group col-md-5 col-12">
                                        <label>Phone</label>
                                        <input
                                            type="tel" className="form-control"
                                            value={userInfo.phone_number}
                                            //    onChange={(e)=>{console.log(e.target.value)}}
                                            readOnly
                                        />
                                    </div>
                                </div>


                                <div className="row">
                                    <div className="form-group col-md-7 col-12">
                                        <label>Username</label>
                                        <input type="text" className="form-control"
                                            value={userInfo.username}
                                            //    onChange={(e)=>{console.log(e.target.value)}}
                                            readOnly
                                        />
                                    </div>
                                    <div className="form-group col-md-5 col-12">
                                        <label>Password</label>
                                        <input type="password" className="form-control"
                                            value={userInfo.password}
                                            //    onChange={(e)=>{console.log(e.target.value)}}
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </>
                    }

                </div>
            </div>



        </>
    )
}

export default ProfileSettings;
