import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addUser } from '../app/userSlice';

// Constants
import { UserCreationFormConfig } from '../constants/form_configs';
import { createField, createFormDataFromSchema } from '../constants/utils';

import AuthLayout from '../layout/AuthLayout';


const CreateUser = ({instant}) => {

    const storeDispatch = useDispatch();

    const [userProfile, setUserProfile] = useState(() => {
        const form_ = createFormDataFromSchema(UserCreationFormConfig);
        return form_
    });

    const [loading, setLoading] = useState(false);



    const handleInputChange = (e) => {
        // e.preventDefault();
        let target = e.target.name;
        let value = e.target.value;
        // console.log(target,value);
        let form = userProfile.form;

        if (form[target]) {
            form[target].config.value = value;
        }
        setUserProfile({
            ...userProfile,
            form
        })
    }


    const gatherData = () => {
        let data = {}

        for (let [field, config] of Object.entries(userProfile.form)) {

            data[field] = config.config.value

        }


        return data;
    }
    

    const validatePasswords = () => {
        //  Run Validations
        // let elem_config = elem.config;
        let form_data = userProfile.form;
        let canProceed = true;
        let password = form_data.password;
        let confirm_password = form_data.confirm_password;

        if (password.config.value !== '' && confirm_password.config.value !== '') {
            if (!(password.config.value === confirm_password.config.value)) {
                form_data.confirm_password['validation']['msg'] = 'Password does not match';
                canProceed = false

            } else {
                form_data.confirm_password['validation']['msg'] = '';
            }
        }


        return {
            canProceed,
            form: {
                ...form_data
            }
        };

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        let validated_state = validatePasswords();


        if (validated_state.canProceed) {
            let form_data = gatherData();

            storeDispatch(addUser(form_data));
            setLoading(true);
        }

        
        return;
    }


    const renderButton = () => {
        if (loading) {
            return (
                <button
                    className="btn btn-primary disabled btnRegister login loading"
                    disabled={true}
                >
                    <span className="spinner load_spinner">
                        <i className="fas fa-spinner mr-2"></i>
                    </span>
                    Loading...
                </button>
            )
        }

        return (
            <button type="submit" className="btn btn-primary btnRegister login">
                Continue
            </button>
        )
    }

    const template = (
        <>
            <form onSubmit={handleSubmit}>
                <div className="text-center">
                    {
                        createField({ form: userProfile.form, groups: userProfile.groups }, handleInputChange)
                    }
                </div>
                {
                    !instant ?
                        <div className="form_footer my-3">
                            <p>
                                <label className="text-muted" >
                                    Mirage Software
                                </label>
                            </p>

                            {
                                renderButton()
                            }
                        </div>
                        :

                        renderButton()

                }

            </form>
        </>
    )

    const InstantCreateUser = ()=>{
        // Create user not from the initialization screen
        let footer_template = (
            <div className="footer">
                <span>
                    Mirage Software
                </span>
                <span onClick={() => { }}>
                    Log in
                </span>
            </div>
        );


        return (
            <AuthLayout loading={loading} title={'Create User'} footer={footer_template}>
                {template}
            </AuthLayout>
        )



    }








    return instant ? InstantCreateUser() : template;
}

export default CreateUser;