import React from 'react';

import Loading from '../widgets/Preloader/loading';
import { isArrayEmpty } from '../constants/utils';


function GradesSettings() {

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
            {/* Grades Settings */}
            <form className="card" onSubmit={handleSubmit}>

                <div className="card-header">
                    <h4>Grades Settings</h4>

                    <div className="card-header-action">
                        {renderButton()}
                    </div>
                </div>

                <div className="card-body p-0">
                    {
                        loading ?
                            <Loading />
                            :
                            <div className="table-responsive">
                                {/* {_id: 'afcd36b5', key: '70-100', value: 'A', remark: 'EXCELLENT'} */}

                                {
                                    isArrayEmpty(settings) ?
                                        <p className="text-center text-muted">
                                            No Grades Settings
                                        </p>
                                        :

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
                                                    settings.map((each, i) => {
                                                        return (<tr key={i}>

                                                            <td>{each.value}</td>
                                                            <td>{each.key}</td>
                                                            <td>
                                                                <div className="badge ">{each.remark}</div>
                                                            </td>
                                                        </tr>)
                                                    })
                                                }

                                            </tbody>

                                        </table>
                                }
                            </div>
                    }
                </div>
            </form>
        </>

    )
}

export default GradesSettings;
