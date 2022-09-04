import React, { useState } from 'react'

import Loading from '../widgets/Preloader/loading';

import { isArrayEmpty, parseFileUrl } from '../constants/utils';
import { avatar } from '../constants/assets';

function AppUsers() {
    // const [state, setState] = useState({
    //     users: [],
    //     loading: true,
    //     loaded: false,
    // })

    const users = [];

    const [loading, setLoading] = useState(false);


    if (loading) {
        return <Loading />
    }


    if (isArrayEmpty(users)) {
        return (
            <p className="text-muted text-center">
                Unable to load app users
            </p>
        )
    }


    return (
        <div className="card">
            <div className="card-header d-flex justify-content-between align-item-center">
                <h4>App Users</h4>

                <div className="card-header-action">
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            alert('You will create a new user when you are logged out')
                            // window.api.request('restart_app')

                            return;
                        }}
                    >
                        Add User
                    </button>
                </div>

            </div>

            <div className="card-body p-0">
                <div className="card-body">
                    <ul className="list-unstyled user-details list-unstyled-border list-unstyled-noborder">
                        {
                            users.map((each, i) => {
                                return (<li className="media" key={i}>

                                    <img
                                        src={parseFileUrl(each.avatar)}
                                        onError={
                                            ({ currentTarget }) => {
                                                currentTarget.onerror = null; // prevents looping
                                                currentTarget.src = avatar;
                                            }
                                        }
                                        alt={`${each.first_name}'s passport`}
                                        className=" mr-3 rounded-circle"
                                        width="50"
                                    />

                                    <div className="media-body">
                                        <div className="media-title">
                                            {each.first_name} {each.last_name}
                                        </div>
                                        <div className="text-job text-muted">{each.email}</div>
                                        {/* <small className="text-muted">
                                            <i> 
                                                <b>Last logged in: 2 minutes ago</b>
                                            </i>
                                        </small> */}
                                    </div>

                                </li>)
                            })
                        }
                    </ul>
                </div>


            </div>
        </div>
    )
}

export default AppUsers;
