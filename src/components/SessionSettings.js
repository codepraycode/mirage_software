import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { capitalize } from '../constants/utils';

import { getSettingsSessions, getSettingsUpdateStatus, updateSessionSetting } from '../app/settingsSlice';
import { statuses } from '../constants/statuses';

function SessionSettings() {

    const session = useSelector(getSettingsSessions);
    const status = useSelector(getSettingsUpdateStatus);
    const storeDispatch = useDispatch();


    const [sessionSetting, setSessionSetting] = useState(() => {
        
        if (!Boolean(session)) return {};

        return session
    });

    const [loading, setLoading] = useState(false);

    const [noOfChanges, setNoOfChanges] = useState(0);


    const anyChanges = noOfChanges > 0;

    

    const handleInputChange = (e) => {
        e.preventDefault();

        let field_name = e.target.name;
        let field_value = e.target.value;


        // console.log(field_name, "changed to", field_value);

        if (!Boolean(sessionSetting[field_name])) return;

        setSessionSetting((prev) => {
            return {
                ...prev,
                [field_name]: field_value
            }
        });

        if (Boolean(session)) {
            setNoOfChanges((pp) => {

                if (Object.is(session[field_name], field_value)) {
                    if (pp === 0) return 0;
                    return pp - 1;
                }

                return pp + 1;
            })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        storeDispatch(updateSessionSetting(sessionSetting));

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
        <>
            {/* Session General session */}


            <form className="card" onSubmit={handleSubmit}>
                <div className="card-header">
                    <h4>Sessions session</h4>

                    <div className="card-header-action">
                        {renderButton()}
                    </div>
                </div>

                <div className="card-body">
                    <div className="row">
                        <div className="form-group col-md-6 col-12">
                            <label>Sessions should be Classified into</label>
                            <input
                                type="text"
                                className="form-control"
                                value={capitalize(sessionSetting?.verbose)}
                                name={"verbose"}
                                onChange={handleInputChange}
                            />

                        </div>

                        <div className="form-group col-md-6 col-12">
                            <label>Number of Terms</label>
                            <input
                                type="number"
                                min={1}
                                max={6}
                                value={sessionSetting?.no_of_terms}
                                className="form-control"
                                name={"no_of_terms"}
                                onChange={handleInputChange}
                            />

                        </div>
                    </div>

                    <div className="row">
                        <div className="form-group col-md-6 col-12">
                            <label>Auto Promote Students</label>
                            <div className="selectgroup w-100">
                                <label 
                                    className="selectgroup-item"
                                    onClick={() => handleInputChange({preventDefault:()=>{}, target:{name: 'auto_promote', value: true} })}
                                >
                                    <input
                                        className="selectgroup-input"
                                        // onChange={handleInputChange}
                                        name="auto_promote"
                                        // data-val={true}
                                    />

                                    <span className="selectgroup-button">Yes</span>
                                </label>


                                <label 
                                    className="selectgroup-item"
                                    
                                    onClick={() => handleInputChange({ preventDefault: () => { }, target:{name: 'auto_promote', value: false} })}
                                >
                                    <input
                                        className="selectgroup-input"
                                        // onChange={handleInputChange}
                                        name="auto_promote"
                                        // data-val={false}
                                    />

                                    <span className="selectgroup-button">No</span>
                                </label>


                            </div>

                        </div>

                        <div className="form-group col-md-6 col-12">
                            <label>Least Percentage for promotion (%)</label>
                            <input
                                type="number"
                                min={10}
                                max={100}
                                value={(sessionSetting?.pass_mark || 0) * 100}
                                className="form-control"
                                name={"pass_mark"}
                                onChange={(e) => {
                                    e.target.value = parseInt(e.target.value) / 100

                                    handleInputChange(e);
                                }}
                            />

                        </div>
                    </div>

                </div>
            </form>

        </>

    )
}

export default SessionSettings;
