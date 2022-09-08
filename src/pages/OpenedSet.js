import React, { useState, useEffect } from 'react'
import Loading from '../widgets/Preloader/loading';

import { Link, useNavigate, useParams } from 'react-router-dom';

import { capitalize, getDateAge, isArrayEmpty, isObjectEmpty, parseFileUrl, useQuery } from '../constants/utils';
import { useDispatch, useSelector } from 'react-redux';
import { getOpenedSetStudents, getSetById, loadSetStudents } from '../app/setSlice';
import { avatar } from '../constants/assets';
import { admissionUrl } from '../constants/app_urls';
import Modal from '../widgets/Modal/modal';
import { schoolset_channel } from '../constants/channels';
import { CheckBox, InputField } from '../widgets/Form/formfields';



const ApproveStudent = ({student, setInfo, closeApproval}) => {
    const { sponsor } = student;

    const [admissionNo, setAdmissionNo] = useState('');
    const [loading, setLoading] = useState(false);
    const [agree, setAgreed] = useState(false);
    const [err, setErr] = useState(null)

    const handleApprove = () => {

        if(!agree) return
        if (admissionNo.length < 1) return


        let data = {
            student_id: student._id,
            admission_no: admissionNo.toLocaleUpperCase()
        }

        window.api.request(schoolset_channel.admit_student, data)
        .then(([err])=>{

            if(Boolean(err)){
                setErr(err);
                setLoading(false);
                setAgreed(false);
                return
            }


            closeApproval();
        })
        .catch((err)=>{
            setErr(err);
            setLoading(false);
            setAgreed(false);
        })

        if(Boolean(err)){
            setErr(null);
        }

        setLoading(true);

    }

    const checkApproval = () => {
        if (admissionNo.length < 1) {
            return false
        }

        if (!agree) {
            return false
        }

        return true;
    }
    
    const renderSponsorDetails = () => {
        if (isObjectEmpty(sponsor)) {
            return 'No Sponsor'
        }

        return `${sponsor.title} ${sponsor.surname} ${sponsor.first_name}`.trim();
    }

    const renderContent = () => {
        if (isObjectEmpty(sponsor)) {
            return (
                <div className="empty-state" data-height="400">
                    <div className="empty-state-icon bg-danger">
                        <i className="fas fa-times"></i>

                    </div>

                    <h2>
                        No sponsor registered for "{student.first_name.toUpperCase()}"
                    </h2>

                    <p className="lead">
                        A sponsor must be registered with a student before such student can be approved
                    </p>
                </div>
            )
        }


        const fullName = `${student.first_name} ${student.last_name}`;

        return (
            <>
                {/* <p>Approval of "{student.first_name}"</p> */}

                <div className="row align-items-center ">
                    <div className="col-4 text-center">
                        <img
                            src={parseFileUrl(student.passport) || avatar}//{profile.logo}
                            onError={
                                ({ currentTarget }) => {
                                    currentTarget.onerror = null; // prevents looping
                                    currentTarget.src = avatar;
                                }
                            }
                            width={150}
                            alt={fullName}
                            className='img-responsive img-fluid mx-auto'
                        />

                    </div>

                    <div className="col-8">
                        <ul className="list-group" style={{ maxWidth: '100%' }}>
                            <li className="list-group-item d-flex justify-content-between align-item-center">
                                <b>Full Name</b>

                                <span>{capitalize(fullName)}.</span>
                            </li>


                            <li className="list-group-item d-flex justify-content-between align-item-center">
                                <b>Gender</b>



                                <span>{student.gender}</span>
                            </li>


                            <li className="list-group-item d-flex justify-content-between align-item-center">

                                <b>Age</b>



                                <span>{getDateAge(student.date_of_birth)}</span>
                            </li>



                            <li className="list-group-item d-flex justify-content-between align-item-center">

                                <b>Sponsor</b>



                                <span>{renderSponsorDetails()}</span>
                            </li>


                            <li className="list-group-item d-flex justify-content-between align-item-center">

                                <b>className Set</b>



                                <span>{setInfo.label} ({setInfo.name})</span>
                            </li>
                        </ul>
                    </div>

                </div>

                <hr />

                <form onSubmit={(e) => { e.preventDefault(); console.log("Submitting Approval") }}>
                    <p className="err-msg text-danger">
                        {err}
                    </p>
                    <InputField
                        verbose={"Enter Admission Number"}
                        onChangeHandler={(e)=>{
                            e.preventDefault(); 
                            setAdmissionNo(()=>e.target.value)
                        }}

                        name={"admission_no"}
                        value={admissionNo.toLocaleUpperCase()}
                    />


                    <CheckBox
                        verbose={"I approve the above student into enrollment into the school"}
                        onChangeHandler={()=>setAgreed((prev)=>!prev)}
                        Id={"agree"}
                        name={"agree"}
                        checked={agree}
                    />

                </form>
            </>
        )
    }

    return (
        <Modal
            title={"Approve Student"}
            onClose={() => { closeApproval() }}
            onSave={() => { handleApprove() }}
            affirmTxt={"Approve"}
            disableAffirm={!checkApproval()}
            cancelTxt={"Cancel"}
            loading={loading}
        >
            {
                renderContent()
            }
        </Modal>
    )
}



const OpenedSetStudents = ({ setId, setInfo})=>{

    const students = useSelector(getOpenedSetStudents);
    const storeDispatch = useDispatch();

    const [loading, setLoading] = useState(true);
    const [studentToApprove, setStudentToApprove] = useState(null); // object of student and sponsor


    const handleDelete = async (_id)=>{
        await window.api.request(schoolset_channel.delete_student, _id);
        storeDispatch(loadSetStudents(setId));
    }


    const loadStudents = async ()=>{
        if(loading){
            storeDispatch(loadSetStudents(setId));

            setLoading(false);
        }
    }

    const renderApproval = () => {
        if (!Boolean(studentToApprove)) return

        return <ApproveStudent
            student={studentToApprove}
            setInfo={setInfo}
            closeApproval={() => {
                setStudentToApprove(()=>null);
                storeDispatch(loadSetStudents(setId));
            }}
        />
    }

    window.api.response("students:reload", () => {
        storeDispatch(loadSetStudents(setId));
    })

    useEffect(()=>{
        loadStudents();
    },[])

    const display_students = () => {
        // console.log(data);
        if (isArrayEmpty(students)) {
            return
        }

        // Alert info for unadmitted candidates
        const verifyInfo = (tar) => {
            // console.log(tar);
            let row_props = {}

            if (!tar.admission_no) {
                row_props.className = 'undone'
                row_props["data-missing"] = `${tar.first_name}'s Admission number not set`;
            }

            return row_props;
        }

        const getActionButtons = (item) => {

            const approveBtn = (
                <button
                    className="btn btn-primary text-center d-block"
                    key={2}
                    onClick={() => setStudentToApprove(()=>item)}
                    title="Admit student"
                >
                    <i className="far fa-money-check-edit mx-0"></i>
                </button>
            )

            const reviewBtn = (
                <Link
                    to={`${admissionUrl}/${setId}/new?student=${item._id}`}
                    className="btn btn-warning outline-warning text-center d-block"
                    // onClick={(e)=>{e.preventDefault()}}
                    target="_blank"
                    key={3}
                    title="Edit student data"
                >
                    <i className="fa fa-pencil mx-0" aria-hidden="true"></i>
                </Link>
            )

            const deleteBtn = (
                <button
                    className="btn btn-danger outline-danger text-center d-block"
                    onClick={() => handleDelete(item._id)}
                    key={4}
                    title="Delete student data"
                >
                    <i className="fas fa-trash mx-0"></i>
                </button>
            )

            let btn_templates = [];

            if (!item.admission_no) {
                btn_templates.push(approveBtn, reviewBtn, deleteBtn);
            }
            else {
                btn_templates.push(reviewBtn, deleteBtn);
            }


            return (
                <>
                    {btn_templates}
                </>
            )
        }

        return (
            <>
                {(students).map((student, i) => {
                    
                    const getProps = verifyInfo(student);

                    const fullName = `${student.first_name} ${student.last_name}`;

                    return (
                        <tr key={student._id} {...getProps}>
                            <td className="p-0 text-center">
                                {i + 1}
                            </td>

                            <td>
                                {student.admission_no || 'not given'}
                            </td>

                            <td className="align-middle">
                                <div className="d-flex align-items-center">
                                    <img
                                        alt="log"

                                        src={parseFileUrl(student.passport) || avatar}//{profile.logo}
                                        onError={
                                            ({ currentTarget }) => {
                                                currentTarget.onerror = null; // prevents looping
                                                currentTarget.src = avatar;
                                            }
                                        }
                                        className=" mr-3 rounded-circle"
                                        width="35"
                                        data-toggle="tooltip"
                                        title={`${fullName}'s passport`}
                                    />
                                    <span>{fullName}</span>
                                </div>
                            </td>

                            <td>{new Date(student.createdAt).toDateString()}</td>

                            <td className="d-flex align-items-center justify-content-center">
                                {getActionButtons(student)}
                            </td>

                        </tr>
                    )
                }
                )
                }
            </>
        )
    }


    return(
        <>
            {renderApproval()}

            <div className="card">

                <div className="card-header">
                    <h4>Students</h4>
                    <div className="card-header-action">

                        <Link
                            to={`${admissionUrl}/${setId}/new`}
                            // onClick={(e)=>e.preventDefault()}
                            target="_blank"
                            className="btn btn-primary mr-4"
                        >
                            <i className="fa fa-plus" aria-hidden="true"></i> Register
                        </Link>

                        <button
                            className="btn btn-secondary"
                            onClick={() => {}}
                        >
                            Conclude
                        </button>

                    </div>
                </div>

                <div className="card-body p-0 text-center">

                    <div className="table-responsive">
                        <table className="table table-striped v_center">
                            <thead>
                                <tr>
                                    <th>
                                        S/N
                                    </th>
                                    <th>Admission No</th>
                                    <th>Candidate</th>
                                    <th>Date</th>
                                    <th>Actions</th>

                                </tr>
                            </thead>

                            <tbody>
                                {display_students()}
                            </tbody>
                        </table>
                    </div>


                </div>

            </div>
        </>
    )

}


const AdmissionProcess = () => {
    let query = useQuery();
    const { setId } = useParams();
    const navigate = useNavigate();


    const setInfo = useSelector((state) => getSetById(state, setId));    
    
    const conclude = false;


    const renderConclusion = () => {

        // Gather Set Information
        // Gather Students Meta information



        return (
            // <Conclusion
            //     setId={setId}
            //     onClose={handleConclusion}
            //     onSave={(action_params) => { handleConclusion(action_params) }}
            //     modify={state.modify}
            // />
            <></>
        )
    }



    const handleConclusion = (action_params = null) => {}


    const handleApproval = (id = null) => {}





    const display_meta = () => {
    
        if (!Boolean(setInfo)) {
            return (
                <Loading />
            )
        }

        return (
            <div className="title text-center">
                <h4>
                    {
                        !setInfo.label.toLowerCase().includes("set") ?
                            'Set '
                            :
                            ''
                    }
                    {capitalize(setInfo.label.trim())}
                </h4>
                <p>{setInfo.name}</p>
            </div>
        );

    }




    // console.log(state);
    return (
        <>
            {/* {state.loading ? <h1>Loading...</h1>: renderPageContent()} */}
            {/* {state.showConclusion ? renderConclusion() : null}
            {state.approveWho ? renderApproval(state.approveWho) : null} */}
            <div className="admission">
                <>

                    {display_meta()}
                    <hr />
                    <OpenedSetStudents
                        setId={setId}
                        onApprove={handleApproval}
                        onConclude={handleConclusion}
                        setInfo={setInfo}
                    />


                </>
            </div>
        </>
    )

}


export default AdmissionProcess;