import React from 'react';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllSets, getSetError, getSetStatus } from '../app/setSlice';


import { setsUrl } from "../constants/app_urls";
import { statuses } from '../constants/statuses';
import Loading from '../widgets/Preloader/loading';
import Time from '../widgets/Time.js';

const ClassSetError = ({message, icon}) => {
    return (
        <div className="no_act carded">
            <span className='icon'>
                {
                    icon || <i className="fas fa-users-class"></i>
                }
                
            </span>

            <p>{message || "No class set"}</p>
        </div>
    )
}


const ClassSets = ({ set, link }) => {
    const navigate = useNavigate();
    const { name, label, createdAt, updatedAt, stats, isOpened} = set;
    const total = stats?.total;
    const boys = stats?.admitted_male;
    const girls = stats?.admitted_female;

    return (
        <div className={`set_card ${isOpened ? 'disabled':''}`} title={isOpened ? "Set is not closed, check admission screen": undefined} onClick={() => {

            if (isOpened) return
            navigate(link)

        }}>

            <div className="title">
                <span className='icon'>
                    <i className="fas fa-users-class"></i>
                </span>

                <div>
                    <h2>{label}</h2>
                    <h3>{name}</h3>
                </div>
            </div>

            <div className="stats">
                <div className="stats_item">
                    <b>{total || "xx"}</b>
                    <span>Total</span>
                </div>

                <div className="stats_item">
                    <b>{boys || "xx"}</b>
                    <span>Boy{Number(boys) > 1 ? 's' : ''}</span>
                </div>

                <div className="stats_item">
                    <b>{girls || "xx"}</b>
                    <span>Girl{Number(girls) > 1 ? 's':''}</span>
                </div>

            </div>


            <div className="detail">

                <div>
                    <div className="detail_item">
                        <b>Created:</b>
                        <br />
                        <Time time={createdAt} />
                    </div>

                    <div className="detail_item">
                        <b>Last modified:</b>
                        <br/>
                        <Time time={updatedAt} />
                    </div>
                </div>


                {/* <div className="ribbi">
                    <span>
                        <i className="fa fa-graduation-cap" aria-hidden="true"></i>
                    </span>

                    <b>Class level</b>
                </div> */}

            </div>

        </div>
    )
}


const Sets = () => {

    const setStatus = useSelector(getSetStatus);
    const schoolSets = useSelector(getAllSets);
    const setError = useSelector(getSetError);

    if (setStatus === statuses.loading) {
        return <Loading />
    }


    if (Boolean(setError)) {
        return <ClassSetError 
            message={setError} 
            icon={
                <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
            } 
        />
    }


    if (!Boolean(schoolSets)) {
        return <ClassSetError/>
    }


    return (
        <>

            <div className="school_sets">
                {
                    schoolSets.map((each) => (
                        <ClassSets set={each} key={each._id} link={`${setsUrl}/${each._id}`} />
                    ))
                }

            </div>
        </>
    )





}

export default Sets;

