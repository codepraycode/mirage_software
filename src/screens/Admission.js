import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { NewSetFormConfig } from '../constants/form_configs';

import { createField, createFormDataFromSchema, useQuery } from '../constants/utils';
import Modal from '../widgets/Modal/modal';


const CreateSet = ({ closeModal }) => {


    const error = null

    const [loading, setLoading] = useState(false);

    const [newSet, setNewSet] = useState(()=>{
        const form_ = createFormDataFromSchema(NewSetFormConfig);

        return form_;
    });

    const gatherData = (inclusions = {}) => {
        // Gather the values in state
        // let clone_state = state;

        let data = {}
        
        for (let [field, config] of Object.entries(newSet.form)) {
            data[field] = config.config.value;
        }

        data = { ...data, ...inclusions }

        // console.log(data);
        return data;

    }

    const handleClose = () => {
        closeModal();
    }

    const handleInputChange = (e) => {
        // Determine the input element
        let field_name = e.target.name;
        let field_value = e.target.value;


        if (!Boolean(newSet.form[field_name])) return

        // Update State
        setNewSet((prev)=>{

            prev.form[field_name].config.value = field_value;
            return{
                ...prev,
            }
            
        })



    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // Gather the data;
        let new_set_data = gatherData({
            isOpened: true
        });

        console.log(new_set_data);

        setLoading(true);
    }


    const renderContent = () => {

        return (
            <>
                {createField({ form: newSet.form }, handleInputChange)}
            </>

        )
    }

    // console.log(state)
    return (
        <>

            <Modal
                title="Setup Admission"
                onClose={handleClose}
                hideActionBtn={true}
                loading={loading}
            >
                <form onSubmit={handleSubmit}>
                    <p className="err-msg text-danger text-center">
                        {error}
                    </p>
                    {
                        renderContent()
                    }


                    {
                        loading ?
                            <button
                                type="button"
                                className="btn btn-danger disabled"
                                onClick={(e) => e.preventDefault()}
                                disabled={true}
                            >
                                cancel
                            </button>
                            :
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => handleClose()}
                            >
                                cancel
                            </button>
                    }


                    {
                        loading ?
                        <button type="button" className="btn btn-primary mr-4 disabled" disabled>
                            Loading...
                        </button>
                        :
                        <button type="submit" className="btn btn-primary mr-4">
                            Confirm
                        </button>
                    }


                    
                </form>
            </Modal>
        </>
    );

}


const Admission = () => {

    let query = useQuery();

    const navigate = useNavigate();

    const openedSet = null;

    const [hosting, setHosting] = useState(()=>{
        return query.get('autohost') === 'true' ? true : false;
    });


    const checkOpenedSet = ()=>{
        if (Boolean(openedSet)){
            navigate(`/admission/${openedSet._id}`);
        }
    }


    useEffect(() => {
        checkOpenedSet();
    });

    return (
        <div className="card">

            <div className="card-body">

                {hosting ?
                    <CreateSet closeModal={() => setHosting(false)}/>
                    :
                    null
                }

                {/* Render this when there is no admission in progress */}
                <div className="no-record">
                    <p>
                        <i className="fad fa-folder-plus"></i>
                    </p>

                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setHosting(true)}
                    >

                        Create Set

                    </button>

                </div>


            </div>

        </div>
    )
}

export default Admission;
