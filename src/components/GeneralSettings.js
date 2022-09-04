import React from 'react';

import Loading from '../widgets/Preloader/loading';
import { capitalize } from '../constants/utils';

function GeneralSettings() {

    const settings = null;
    const loading = false;
    const processing = false;
    const anyChanges = false;

    

    const handleInputChange = (e) => {
        e.preventDefault();

        let field_name = e.target.name;
        let field_value = e.target.value;


        console.log(field_name, "changed to", field_value);
    }

    const handleSubmit = () => {

        console.log(settings);
    }

    // console.log(settings);

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
        <>
            {/* Session General Settings */}


            <form className="card" onSubmit={handleSubmit}>
                <div className="card-header">
                    <h4>Sessions Settings</h4>

                    <div className="card-header-action">
                        {renderButton()}
                    </div>
                </div>

                <div className="card-body">
                    {
                        loading ?
                            <Loading />
                            :
                            <>

                                <div className="row">
                                    <div className="form-group col-md-6 col-12">
                                        <label>Sessions should be Classified into</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={capitalize(settings?.verbose)}
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
                                            value={settings?.no_of_terms}
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
                                            <label className="selectgroup-item">
                                                <input
                                                    className="selectgroup-input"
                                                    onChange={(e) => { }}
                                                />

                                                <span className="selectgroup-button">Yes</span>
                                            </label>


                                            <label className="selectgroup-item">
                                                <input
                                                    className="selectgroup-input"
                                                    onChange={(e) => { }}
                                                />

                                                <span className="selectgroup-button">No</span>
                                            </label>


                                        </div>

                                    </div>

                                    <div className="form-group col-md-6 col-12">
                                        <label>Least Percentage for promotion (%)</label>
                                        <input
                                            type="number"
                                            min={1}
                                            max={100}
                                            value={settings?.pass_mark * 100}
                                            className="form-control"
                                            name={"pass_mark"}
                                            onChange={(e) => {
                                                e.target.value = parseInt(e.target.value) / 100

                                                handleInputChange(e);
                                            }}
                                        />

                                    </div>
                                </div>
                            </>
                    }

                </div>
            </form>

        </>

    )
}

export default GeneralSettings;
