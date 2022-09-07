import React, { useState, useEffect } from 'react'
import Loading from '../widgets/Preloader/loading';
import { createFormDataFromSchema, isObjectEmpty, capitalize, parseFileUrl, createField } from '../constants/utils';
import { SponsorDataSchema } from '../constants/form_configs';
import { schoolset_channel } from '../constants/channels';


const SponsorForm = ({ student_id, proceed}) => {
    // Admission Form Component


    const [sponsorData, setSponsorData] = useState(() => {
        const form_ = createFormDataFromSchema(SponsorDataSchema);

        return form_
    });

    const [loading, setLoading] = useState(false);

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


        // console.log(field_name, "changed to", field_value);

        let _form = sponsorData.form;

        if (!Boolean(_form[field_name])) return;

        setSponsorData((prev)=>{
            prev.form[field_name].config.value = field_value;

            return {...prev};
        })

    }

    const gatherData = () => {
        // Gather Data from state
        let data = {};

        for (let [field, config] of Object.entries(sponsorData.form)) {

            data[field] = config.config.value;
        }

        return data
    }


    const handleSubmit = (e) => {
        e.preventDefault();

        let data = gatherData();
        
        console.log(data);

        window.api.request(schoolset_channel.save_sponsor, { student_id, data})
        .then(async(res)=>{

            // setLoading(false);
            console.log(res);

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
                <h6>Student's Sponsor Registration </h6>
            </div>
            {/* Form Body */}

            <div className="form-content">
                {
                    createField({ form: sponsorData.form, groups: sponsorData.groups }, handleInputChange)
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


export default SponsorForm;