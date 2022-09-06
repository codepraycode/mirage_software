import React from 'react';
import { useSelector } from 'react-redux';

import Loading from '../widgets/Preloader/loading';
import { isArrayEmpty } from '../constants/utils';

import { getSettingsGrades } from '../app/settingsSlice';

function GradesSettings() {

    const grades = useSelector(getSettingsGrades);


    if (isArrayEmpty(grades)){
        return (
            <p className="text-center text-muted">
                No Grade Settings
            </p>
        )
    }


    return (
        <>
            {/* Grades Settings */}
            <div className="card">

                <div className="card-header">
                    <h4>Grades Settings</h4>

                    {/* <div className="card-header-action">
                        {renderButton()}
                    </div> */}
                </div>

                <div className="card-body p-0">
                    <div className="table-responsive">
                        {/* {_id: 'afcd36b5', key: '70-100', value: 'A', remark: 'EXCELLENT'} */}

                        <table
                            className="table text-center table-striped table-md v_center"
                        >

                            <thead>
                                <tr>

                                    <th>Grade</th>
                                    <th>Range</th>
                                    <th>Remark</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    grades.map((each, i) => {
                                        return (<tr key={i}>

                                            <td>{each.value}</td>
                                            <td>{each.key}</td>
                                            <td>
                                                <div className="badge ">
                                                    {each.remark}
                                                </div>
                                            </td>
                                        </tr>)
                                    })
                                }

                            </tbody>

                        </table>
                    </div>
                </div>
            </div>
        </>

    )
}

export default GradesSettings;
