import React from 'react';

import { isObjectEmpty, capitalize } from '../constants/utils';
import { getSettingsAttrs } from '../app/settingsSlice';
import { useSelector } from 'react-redux';


function AttrSettings() {

    const attrs = useSelector(getSettingsAttrs);


    if (isObjectEmpty(attrs)) {
        return (
            <p className="text-center text-muted">
                No Skill/Behavioural Settings
            </p>
        )
    }

    

    return (
        <>
            {/* Skills/Behavioural Settings */}
            <div className="card">
                <div className="card-header">
                    <h4>Skill/Behavioural Settings</h4>
                </div>

                <div className="card-body">
                    {/* Attr keys */}
                    <div className="badges">
                        {
                            attrs.keys.map((each, i) => {
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
                            attrs.mappings.map((each, i) => {
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
                </div>
            </div>
        </>

    )
}

export default AttrSettings;
