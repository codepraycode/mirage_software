import React, { useState, useEffect } from 'react'
import Loading from '../widgets/Preloader/loading';
import { createFormDataFromSchema, isObjectEmpty, capitalize, parseFileUrl, createField } from '../constants/utils';
import { StudentDataSchema } from '../constants/form_configs';


const StudentForm = ({setId, proceed}) => {
    // Admission Form Component


    const [studentData, setStudentData] = useState(() => {
        const form_ = createFormDataFromSchema(StudentDataSchema);

        return form_
    });

    const [loading, setLoading] = useState(true);

    const loadState = () => {}

    const runStateFill = () => {}

    const handleInputChange = (e) => {

        let field_name = e.target.name;
        let field_type = e.target.type;
        let field_value = e.target.value;


        if (!['radio'].includes(field_type)) {
            e.preventDefault();
        } else {
            field_value = e.target.dataset.val;
        }


        console.log(field_name, "changed to", field_value);

        let _form = studentData.form;

        if (!Boolean(_form[field_name])) return;

        setStudentData((prev)=>{
            prev.form[field_name].config.value = field_value;

            return {...prev};
        })

    }

    const gatherData = () => {
        // Gather Data from state
        let data = {};

        for (let [field, config] of Object.entries(studentData.form)) {

            data[field] = config.config.value;
        }

        return data
    }


    const handleSubmit = (e) => {
        e.preventDefault();

        let response = gatherData();

        if (!response['admission_no']) {
            response['admission_no'] = null;
        }
        
        console.log(response);

        setLoading(true);

    }


    // useEffect(() => {
    //     if (!state.loaded) {
    //         loadState();
    //     }
    //     if (!state.loadedExistingData) {
    //         runStateFill()
    //     }

    // })


    const createSummary = () => {
        let template = Object.entries(studentData.form).map((ecf, i) => {
            let [field, config] = ecf;

            if (config.elem === 'image') {
                return (
                    <li
                        className="list-group-item d-flex justify-content-between align-items-center"
                        key={i}
                    >
                        <b>{capitalize(field)}</b>


                        <p style={{ height: "80px" }}>
                            <img
                                src={parseFileUrl(config.config.value)}//{profile.logo}
                                onError={
                                    ({ currentTarget }) => {
                                        currentTarget.onerror = null; // prevents looping
                                        currentTarget.src = './assets/images/fake_passport.png';
                                    }
                                }
                                alt="Student's Passport" className="img-fluid"
                                style={{ height: "100%" }}
                            />
                        </p>

                    </li>
                )
            }

            return (
                <li
                    className="list-group-item d-flex justify-content-between align-items-center"
                    key={i}
                >
                    <b>{capitalize(field)}</b>


                    <b>
                        {
                            config.config.value ?
                                config.config.value
                                :
                                'Not Provided'
                        }
                    </b>

                </li>
            )
        });

        return (
            <ul className="list-group">
                {template}
            </ul>
        );
    }


    const renderPhaseContent = () => {

        if (summarize === true) {
            return <>
                {createSummary(studentData.form)}
            </>;
        }
    }


    const renderButton = () => {

        if (loading) {
            return (
                <button
                    className="btn btn-primary disabled"
                    type="button"
                >
                    <span className="spinner load_spinner">
                        <i className="fas fa-spinner mr-3"></i>
                    </span>
                    Processing...
                </button>
            )
        }

        return (
            <button
                className="btn btn-primary"
                type="submit"
            // onClick={()=>proceed()}
            >
                Next
            </button>
        )



    }


    return (
        <form className="form-body" onSubmit={handleSubmit}>
            <div className="form-lead d-flex justify-content-between align-items-center">
                <h6>Student's Registration </h6>
            </div>
            {/* Form Body */}

            <div className="form-content">
                {
                    createField({ form: studentData.form, groups: studentData.groups }, handleInputChange)
                }
            </div>


            <hr />
            {/* Form Footer */}
            <div className="form-footer">

                <div className="mb-4 d-flex justify-content-between">
                    <div>
                        <b></b>
                    </div>
                    {
                        renderButton()
                    }

                </div>

            </div>

        </form>

    )

}


export default StudentForm;