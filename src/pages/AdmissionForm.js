import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';

import { useQuery, parseFileUrl, isArrayEmpty, isObjectEmpty } from '../constants/utils';


import { school_logo_placeholder } from '../constants/assets';

import { settings_channel } from '../constants/channels';
import Loading from '../widgets/Preloader/loading';
import StudentForm from '../components/StudentForm';

const AdmissionForm = () => {
    // Admission Form Component

    let { setId } = useParams();
    console.log(setId);

    const default_phase = [
        {
            title: "Student's Profile",
            icon: 'far fa-user',
        },

        {
            title: "Sponsor's Profile",
            icon: 'fas fa-box-open',
            phase_key: null // Phase essense => student_id or sponsor_ids
            },

        {
            title: "Summary",
            icon: 'fas fa-server',

        }
    ]

    const [school, setSchool] = useState(null);
    // const [schoolSet, setSchoolSet] = useState(null);

    const [loading, setLoading] = useState(true);

    const [phase, setPahse] = useState(1);
    
    const [studentId, setStudentId] = useState(null);
    const [sponsorId, setSponsorId] = useState(null);
    

    const loadUp = async () => {
        if(!loading) return;

        // if (!Boolean(schoolSet)){
        //     const {stats,...rest} = await window.api.request(schoolset_channel.get, setId);

        //     console.log(rest);
        //     setSchoolSet(() => rest);
        // }

        if (!Boolean(school)){
            const data = await window.api.request(settings_channel.get, "school");
            setSchool(() => data);
        }
        

        setLoading(false);
    }


    const handlePhase = (skip = null) => {
        // Phase SWicther

        setPahse((prev)=>{
            if (prev > default_phase.length){
                return default_phase.length
            }

            if (prev < 1){
                return 1
            }

            return prev+1;

        });

    }


    const renderPhaseHeaders = () => {
        // console.log(state.current_phase);
        let template = default_phase.map((each_phase, e) => {
            let i = e + 1
            let className = ['wizard-step', 'wizard-step-active']

            

            return (
                <div
                    key={i}
                    className={className.join(' ')}
                    onClick={() => { handlePhase(i) }}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="wizard-step-icon">
                        <i className={each_phase.icon}></i>
                    </div>

                    <div className="wizard-step-label">
                        {each_phase.title}
                    </div>
                </div>
            )
        });



        return template;

    }

    const renderPhaseForm = () => {
        let template = null;
        /* 
            {student_id,phase_id, proceed, summarize,button_templates}
        */
        if (phase === default_phase.length) {
            template = (<>
                {/* <StudentForm
                    student_id={state.student_id}
                    phase_id={"Student"}
                    // proceed={handlePhase}
                    summarize={true}
                    set_id={admissionId}
                /> */}
                <hr />
                {/* <SponsorForm
                    student_id={state.student_id}
                    sponsor_id={state.sponsor_id}
                    // sponsor_data={state.sponsor_data}
                    phase_id={"Sponsor"}
                    // proceed={handlePhase}
                    summarize={true}
                    set_id={admissionId}
                /> */}
            </>);
        }

        else {
            if (!Boolean(studentId)) {
                template = (
                    <StudentForm
                        setId={setId}
                        proceed={(id) => setStudentId(()=>id)}
                    />
                )
            }
            else if (!Boolean(sponsorId)) {
                template = (<>
                    <p>Sponsor Form</p>
                    {/* <SponsorForm
                        student_id={state.student_id}
                        sponsor_id={state.sponsor_id}
                        // sponsor_data={state.sponsor_data}
                        phase_id={"Sponsor"}
                        proceed={(d_id = null, proceed = true) => updateIdAndProceed(d_id, 'sponsor_id', proceed)}
                        summarize={false}
                        set_id={admissionId}
                        updating={state.modifying}
                    /> */}
                </>)
            }
        }


        return (

            <>
                {/* Form Content */}

                <div className="form-content">

                    {template}
                </div>
            </>

        )
    }


    useEffect(()=>{
        loadUp();
    }, [school, loading, studentId, sponsorId])
    
    return (
        <div className="container">
            {/* Form Header */}

            {
                loading ?
                    <Loading/>
                :
                <>
                    <div className="form-header text-primary">
                        <div className="header-logo mr-4">
                            <img
                                src={parseFileUrl(school?.logo) || school_logo_placeholder}//{profile.logo}
                                onError={
                                    ({ currentTarget }) => {
                                        currentTarget.onerror = null; // prevents looping
                                        currentTarget.src = school_logo_placeholder;
                                    }
                                }
                                alt="school logo"
                                className="rounded-circle mr-1"
                            />
                        </div>

                        <div className="header-descrip">
                            <h1>{school?.name}</h1>
                            <p>{school?.address} {school?.city} {school?.state}.</p>

                            <span>
                                <i className="fas fa-phone rotate-360"></i>
                                {school?.contacts}
                            </span>

                            <span>
                                <i className="fa fa-envelope" aria-hidden="true"></i>
                                {school?.email}
                            </span>


                            <span>
                                <i className="fa fa-globe" aria-hidden="true"></i>
                                {school?.website}
                            </span>

                        </div>
                    </div>
                </>
            }
            


            {/* Form Body */}
            <div className="row mt-4">
                <div className="col-12 col-lg-8 offset-lg-2">
                    <div className="wizard-steps">
                        {renderPhaseHeaders()}
                    </div>
                </div>
            </div>

            {/* Form Body */}

            {renderPhaseForm()}
        </div>
    )

}


export default AdmissionForm;