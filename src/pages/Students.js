import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { getSetAdmittedStudents, getSetById, getSetUpdateError, getSetUpdateStatus, updateSet } from '../app/setSlice';
import { avatar } from '../constants/assets';
import { statuses } from '../constants/statuses';
import { admissionUrl } from '../constants/app_urls';
import { capitalize, isArrayEmpty, parseFileUrl } from '../constants/utils';
import Loading from '../widgets/Preloader/loading';


const StudentItem = ({ student }) => {

    
    const { 
        first_name, 
        last_name, 
        passport, 
        admission_no,
        gender,
        date_of_birth, } = student;
 
    return (
        <div className="student_card">

            <div className="passport">                

                <img
                    alt={`${first_name} ${last_name}`}

                    src={parseFileUrl(passport) || avatar}
                    onError={
                        ({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src = avatar;
                        }
                    }
                />

            </div>

            <p className='name'>
                {first_name} {last_name}
            </p>

            <p className='admission_number'>
                {admission_no}
            </p>



            <div className="detail">
                <div className="detail_item">
                    <b>Gender:</b>
                    <span>
                        {capitalize(gender)}
                    </span>
                </div>

                <div className="detail_item">
                    <b>Date of birth:</b>
                    <span>{date_of_birth}</span>
                </div>

            </div>

        </div>
    )
}


const SetStudentsError = ({ message, icon }) => {
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


const MenuBar = ({ setInfo })=>{
    const storeDispatch = useDispatch();

    const navigate = useNavigate();

    return(
        <div className="app__toolbar">
            <div className="tool_left">
                <b>

                    {capitalize(setInfo.label.trim())} -- {capitalize(setInfo.name.trim())}
                </b>
            </div>

            <div className="tool_right">

                <Link
                    to={`/`}
                    onClick={(e) => {
                        e.preventDefault();
                        storeDispatch(updateSet({
                            ...setInfo,
                            isOpened:true
                        }));
                        navigate(admissionUrl, {replace:true});
                    }}
                    className={`btn btn-primary`}
                >
                    Edit class set
                </Link>
            </div>
        </div>
    )
}


const StudentPage = () => {
    const { setId } = useParams();

    const setInfo = useSelector((state) => getSetById(state, setId));
    const students = useSelector((state) => getSetAdmittedStudents(state,setId));
    const setError = useSelector(getSetUpdateError);
    const status = useSelector(getSetUpdateStatus)

    if (Boolean(setError)) {
        return <SetStudentsError 
            message={setError}
            icon={
                <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
            } 
        />
    }

    if (status !== statuses.idle) {
        return <Loading />
    }


    if(isArrayEmpty(students)){
        return(
            <SetStudentsError
                message={"No students in class set"}
                icon={
                    <i className="fas fa-users-class"></i>
                }
            />
        )
    }


    return (

        <>
            <MenuBar setInfo={setInfo}/>

            <br/>

            <div className="set_students">
                {
                    students.map((student) => (

                        <StudentItem 
                            key={student._id} 
                            student={student} 
                        />
                        
                    ))
                }
            </div>
        </>
    )





}

export default StudentPage;