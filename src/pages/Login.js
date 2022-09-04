import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authenticate, getUserUpdateError } from '../app/userSlice';
import AuthLayout from '../layout/AuthLayout';
import { newUserUrl } from '../constants/app_urls';



const Login = () => {

    const userError = useSelector(getUserUpdateError);
    const storeDispatch = useDispatch();

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [loading, setLoading] = useState(Boolean(userError));
    const [showPassword, setShowPassword] = useState(false);
    const [formError, setFormError] = useState(null);


    const handleChange = (e, target) => {
        let val = e.target.value;
        formData[target] = val;

        setFormData((prev)=>{
            return {...prev, ...formData}
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.username !== '' && formData.password !== '') {
            // this.props.loginHandler(formData.username,formData.password);
            let data = {
                username: formData.username.trim(),
                password: formData.password.trim()
            }

            storeDispatch(authenticate(data));

            setLoading(true);
            
            return;
        }else{
            setFormError(()=>{
                if (formData.username !== '') { 
                    return "username is required"
                }

                if (formData.password !== '') {
                    return "password is required"
                }
            })
        }


    }


    const updateLoading = ()=>{
        if(Boolean(userError)){
            setLoading(false);
        }
    }


    useEffect(()=>{
        updateLoading();
    })


    
    let footer_template = (
        <div className="footer">
            <span 
                onClick={() => { navigate(newUserUrl, {replace:true})}
            }>

                or create new user
                {/* <b>Create a user</b> */}
            </span>


            <span onClick={() => { }}>
                {/* Forgot credentials? */}
            </span>
        </div>
    )

    return (
        <AuthLayout
            loading={loading} 
            title={'Login'} 
            footer={footer_template}
        >

            <form onSubmit={handleSubmit}>

                <span className="err_msg text-danger">
                    <b>{formError || userError}</b>
                </span>

                <div className="form_item">
                    <label htmlFor="username">
                        Username or Email
                    </label>
                    <div className="sec-2">
                        <i className="fa fa-user-circle" aria-hidden="true"></i>
                        <input type="text" name="username"
                            value={formData.username}
                            onChange={(e) => { handleChange(e, 'username') }}
                            placeholder="Enter username"
                        />
                    </div>
                </div>

                <div className="form_item">
                    <label htmlFor="password">Password</label>
                    <div className="sec-2">
                        <i className="fas fa-lock"></i>
                        <input
                            type={showPassword ? "text" : "password"}
                            className="pas"
                            name="password"
                            placeholder='..............'
                            value={formData.password}
                            onChange={(e) => { handleChange(e, 'password') }}
                        />
                        <span 
                            className="show-hide" 
                            onClick={() => setShowPassword((prev)=>!prev)}>
                            {
                                showPassword ?
                                    <i className="fa fa-eye-slash" aria-hidden="true"></i>
                                    :
                                    <i className="fas fa-eye"></i>
                            }


                        </span>
                    </div>
                </div>


                {
                    !loading ?
                        <button className="login" type="submit">
                            Login
                        </button>
                        :
                        <button className="login loading" type="submit">
                            <span className="spinner load_spinner">
                                <i className="fas fa-spinner"></i>
                            </span>
                            Loging in.....
                        </button>
                }
            </form>
        </AuthLayout>
    )
}

export default Login;