import React, { useState } from 'react'
import { createFormDataFromSchema, createField } from '../constants/utils';
import { StudentDataSchema } from '../constants/form_configs';
import { schoolset_channel } from '../constants/channels';


const StudentForm = ({setId, proceed, predata}) => {
    // Admission Form Component

    const [studentData, setStudentData] = useState(() => {
        const form_ = createFormDataFromSchema(StudentDataSchema);
        if (!Boolean(predata)) return form_;


        for (let [field, config] of Object.entries(form_.form)) {

            if (predata[field]) {

                config.config.value = predata[field]
            }
        }

        return form_
    });

    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {

        let field_name = e.target.name;
        let field_type = e.target.type;
        let field_value = e.target.value;


        if (!['radio'].includes(field_type)) {
            e.preventDefault();
        } else {
            field_value = e.target.dataset.val;
        }


        // console.log(field_name, "changed to", field_value);

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


        if(Boolean(predata)){
            response = {...predata, ...response }
        }else{
            if (!response['admission_no']) {
                response['admission_no'] = null;
            }
            response['set_id'] = setId;
        }

        

        window.api.request(schoolset_channel.save_student, response)
        .then(async(res)=>{

            await window.api.request("students:modified");
            proceed(res);
        })
        .catch((err)=>{
            console.error(err);
            setLoading(false);
        })

        setLoading(true);

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