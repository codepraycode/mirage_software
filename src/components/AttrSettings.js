import React, { useState } from 'react';

import Loading from '../widgets/Preloader/loading';

import { isObjectEmpty, capitalize } from '../constants/utils';


function AttrSettings() {
    const settings = null;
    const loading = false;
    const processing = false;
    const anyChanges = false;

    const handleSubmit = () => {

        console.log(settings);
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
        <>
            {/* Skills/Behavioural Settings */}
            <form className="card" onSubmit={handleSubmit}>
                <div className="card-header">
                    <h4>Skill/Behavioural Settings</h4>

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
                                {
                                    isObjectEmpty(settings) ?
                                        <p className="text-center text-muted">
                                            No Settings Found
                                        </p>
                                        :
                                        <>
                                            {/* Attr keys */}
                                            <div className="badges">
                                                {
                                                    settings.keys.map((each, i) => {
                                                        return (
                                                            <span className="badge badge-primary" key={i}>
                                                                {capitalize(each.value)}
                                                            </span>
                                                        )
                                                    })
                                                }

                                            </div>


                                            <ul className="list-group">
                                                {
                                                    settings.mappings.map((each, i) => {
                                                        return (
                                                            <li
                                                                className="list-group-item d-flex justify-content-between align-items-center"
                                                                key={i}
                                                            >
                                                                <span className="badge badge-primary badge-pill">
                                                                    {each.point}
                                                                </span>

                                                                {each.value}
                                                            </li>
                                                        )
                                                    })
                                                }


                                            </ul>

                                        </>
                                }



                            </>
                    }
                </div>
            </form>
        </>

    )
}

export default AttrSettings;
