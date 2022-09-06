import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAuthUser, getUserUpdateStatus, updateAuth, updateUser } from '../app/userSlice';
import { UserUpdateFormConfig } from '../constants/form_configs';
import { statuses } from '../constants/statuses';

import { createField, createFormDataFromSchema, isObjectEmpty } from '../constants/utils';

function ProfileSettings() {

    const userInfo = useSelector(getAuthUser);


    const [userProfile, setUserProfile] = useState(() => {
        let form_ = createFormDataFromSchema(UserUpdateFormConfig);

        if (!Boolean(userInfo)) return form_;


        for (let [field, config] of Object.entries(form_.form)) {

            if (userInfo[field]) {

                config.config.value = userInfo[field]
            }
        }

        return form_
    });

    const [loading, setLoading] = useState(false);
    const status = useSelector(getUserUpdateStatus);
    const storeDispatch = useDispatch();

    const [noOfChanges, setNoOfChanges] = useState(0);
    const anyChanges = noOfChanges > 0;



    const gatherData = () => {
        let data = {};
        let _form = userProfile.form;

        for (let [field, config] of Object.entries(_form)) {
            data[field] = config.config.value;
        }

        return data;
    }

    const handleSave = () => {
        const _data = gatherData();

        const data = { _id: userInfo._id, ..._data }

        storeDispatch(updateUser(data));
        storeDispatch(updateAuth(data));
        // console.log();


        setLoading(true);
    }

    const handleInputChange = (e) => {
        // console.log(e.target.name, "Changed");
        let field_name = e.target.name;
        let field_value = e.target.value;

        let _form = userProfile.form;


        if (!Boolean(_form[field_name])) return;


        _form[field_name].config.value = field_value;

        setUserProfile((prev) => {
            return {
                ...prev,
                form: _form
            }
        });

        setNoOfChanges((pp) => {

            if (Object.is(userInfo[field_name], field_value)) {
                if(pp === 0) return 0;
                return pp - 1;
            }

            return pp + 1;
        })
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
        <div className="card">

            <div className="card-header">
                <h4>Edit Profile</h4>

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
                {
                    isObjectEmpty(userInfo) ?
                        <p className="text-center text-muted mb-2">
                            Could not get authenticated user data
                        </p>
                    :
                    <>
                        {createField({ form: userProfile.form, groups: userProfile.groups }, handleInputChange)}
                    </>
                }

            </div>
        </div>
    )
}

export default ProfileSettings;
