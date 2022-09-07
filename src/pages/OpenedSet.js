import React, { useState, useEffect } from 'react'
import Loading from '../widgets/Preloader/loading';

import { Link, useNavigate, useParams } from 'react-router-dom';

import { capitalize, isArrayEmpty, useQuery } from '../constants/utils';
import { useSelector } from 'react-redux';
import { getSetById } from '../app/setSlice';
import { avatar } from '../constants/assets';



const OpenedSetStudents = ({setId, onApprove, onConclude})=>{

    const students = [];
    const loading = false;


    const handleDelete = (_id)=>{}


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
                row_props["data-missing"] = `${tar.fullName.split(' ')[0]}'s Admission number not set`;
            }

            return row_props;
        }

        const getActionButtons = (item) => {

            const printBtn = (
                <button 
                    className="btn btn-success outline-success disabled d-block" 
                    disabled={true} key={1}
                >
                    <i className="fa fa-print mx-0" aria-hidden="true"></i>
                </button>
            )

            const approveBtn = (
                <button
                    className="btn btn-primary text-center d-block"
                    key={2}
                    onClick={() => {}}
                >
                    <i className="far fa-money-check-edit mx-0"></i>
                </button>
            )

            const reviewBtn = (
                <Link
                    to={`/admission/${setId}/new?n=false&&adNo=${item.id}`}
                    className="btn btn-warning outline-warning text-center d-block"
                    onClick={(e)=>{e.preventDefault()}}
                    target="_blank"
                    key={3}
                >
                    <i className="fa fa-pencil mx-0" aria-hidden="true"></i>
                </Link>
            )

            const deleteBtn = (
                <button
                    className="btn btn-danger outline-danger text-center d-block"
                    onClick={() => handleDelete(item._id)}
                    key={4}
                >
                    <i className="fas fa-trash mx-0"></i>
                </button>
            )

            let btn_templates = [];

            if (!item.admission_no) {
                btn_templates.push(approveBtn, reviewBtn, deleteBtn);
            }
            else {
                btn_templates.push(printBtn, reviewBtn, deleteBtn);
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
        <div className="card">

            <div className="card-header">
                <h4>Students</h4>
                <div className="card-header-action">

                    <Link
                        to={`/admission/${setId}/new`}
                        onClick={(e)=>e.preventDefault()}
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
    )

}


const AdmissionProcess = () => {
    let query = useQuery();
    const { setId } = useParams();
    const navigate = useNavigate();


    const setInfo = useSelector((state) => getSetById(state, setId));

    const [loading, setLoading] = useState(false);
    const students = [];
    const studentToApprove = null;
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


    const renderApproval = (details) => {

        // return <Approval
        //     setId={setId}
        //     details={details}
        //     callback={handleApproval}
        //     set_data={state.admission_meta}
        // />
    }




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
                    />


                </>
            </div>
        </>
    )

}


export default AdmissionProcess;