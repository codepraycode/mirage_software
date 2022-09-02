import React from 'react';
import {capitalize,slugify,isArrayEmpty,parseFileUrl} from '../../constants/utils';
import { image_placeholder } from '../../constants/assets';


export const FormField = (props) => {
    // console.log(props)

   
    
    const renderField = ()=>{
        let template = null;

        switch(props.elem){
            case 'input':
                template = (
                    <>
                        
                        
                        <label>{capitalize(props.verbose)}</label>
                        <input 
                            className="form-control"
                            {...props.config}
                            onChange={(e)=>props.onChangeHandler(e,props.verbose)}
                        />

                        
                    </>
                );
                break
            

            case 'file':
                template = (
                    <>
                        
                        
                        <label>{capitalize(props.verbose)}</label>
                        <input 
                            className="form-control"
                            {...props.config}
                            onChange={(e)=>props.onChangeHandler(e,props.verbose)}
                        />
                        

                        
                    </>
                );
                break
            
            case 'textarea':
                template = (
                    <>
                            
                            
                            <label>{capitalize(props.verbose)}</label>
                            <textarea 
                                className="form-control" 
                                {...props.config}
                                onChange={(e)=>props.onChangeHandler(e,props.verbose)}
                            />

                            
                    </>
                );
                break
            

            case 'radio':
                template = (
                    <>
                        <label>{capitalize(props.verbose)}</label>
                        <div className="selectgroup w-100">
                            {props.options.map((item,i)=>{
                                return (
                                    <label className="selectgroup-item" key={i}>
                                        <input 
                                            className="selectgroup-input"
                                            {...props.config}
                                            onChange={(e)=>props.onChangeHandler(e,props.verbose)}
                                        />

                                        <span className="selectgroup-button">{item}</span>
                                    </label>
                                )
                            })}
                            
                        
                        </div>
                    </>
                );

                break
            

           
            default:
                template = null
        }

        return WrappUp(template);
    }

    const WrappUp = (field)=>{
        let wrapper = null;
        // console.log(props.wrapper);
        let {elem,...rest} = props.wrapper;
        switch(elem){
            case 'div':
                wrapper = (
                    <div {...rest}>
                        {field}
                    </div>
                )
                break;
            default:
                wrapper = field;
                break;
        }

        return wrapper;

    }

    return (
        <>
            {renderField()}
        </>
    );
};

export const InputField = ({verbose,onChangeHandler,validation,...rest})=>{
    // console.log(props);
    // console.log(verbose,onChangeHandler,rest)
    return(
        <>                     
            <label>{capitalize(verbose)}</label>
            
            <input 
                className="form-control"
                type="text"
                {...rest}
                onChange={(e)=>onChangeHandler(e)}
            /> 
            {
                validation ?
            
                <span className="err_msg text-danger">
                    <b>
                        {validation.msg}
                    </b>
                </span>
                :
                null
            }
        </>
    )
}

const handleImageUpload = (rst,onChangeHandler)=>{
    // console.log(rst);
    window.api.request('file:image_upload',{
        type:'image',
        category:rst.file_category,
        // file_name:
        configs:{
            title: 'Select the image to Upload',
            buttonLabel: 'Upload',
            filters: [
                {
                    name: 'Image Files',
                    extensions: ['png', 'jpg', 'jpeg']
                }, 
            ],
        }
    });

    window.api.response('file:image_uploaded', (res)=>{
        
        if(isArrayEmpty(res)) return;

        let {filepath} = res[0];
        console.log(filepath)

        let e = {
            preventDefault:()=>{},
            target:{
                name:rst.name,
                type:'file',
                value:filepath
            }
        }

        // e.target.value = filepath;

        onChangeHandler(e)


    })
}

export const ImageField = ({verbose,onChangeHandler,...rest})=>{
    // console.log(props);
    // console.log(verbose,onChangeHandler,rest)
    // console.log(verbose,rest);
    return(
        <>  
            {/* <label>{capitalize(verbose)}</label> */}
            <div 
                className="preview-container text-center" 
                style={{height:"100px", margin:'0 0 20px 0'}}
            >
                <img 
                    src={parseFileUrl(rest.value)} 
                    // src={rest.value || image_placeholder}
                    // onError={
                    //     ({ currentTarget }) => {
                    //         currentTarget.onerror = null; // prevents looping
                    //         currentTarget.src = { image_placeholder }
                            
                    //     }
                    // }
                    alt="Preview" className="img-fluid" 
                    style={{height:"100%"}}
                />
            </div>
            {/* <label>{capitalize(verbose)}</label> */}
            <div className="form-group">
                <div className="input-group mb-3">
                <input 
                    // type="text" 
                    className="form-control" 
                    // placeholder="" 
                    // aria-label=""
                    {...rest}
                    value = {rest.value === null ? '':rest.value }
                    // onChange={(e)=>onChangeHandler(e)}
                    
                />
                <div className="input-group-append">
                    <button 
                        className="btn btn-primary" 
                        type="button"
                        onClick={()=>{handleImageUpload({...rest},onChangeHandler)}}
                    >
                        Upload
                    </button>

                </div>
                </div>
            </div>
            
            {/* <input 
                className="form-control"
                {...rest}
                onChange={(e)=>onChangeHandler(e)}
                onClick={(e)=>{e.preventDefault(); handleImageUpload()}}
            />        */}
        </>
    )
}

export const TextAreaField = ({verbose,onChangeHandler,...rest})=>{
    // console.log(props);
    // console.log(verbose,onChangeHandler,rest)
    return(
       <>
                            
                            
            <label>{capitalize(verbose)}</label>
            <textarea 
                className="form-control" 
                {...rest}
                onChange={(e)=>onChangeHandler(e)}
            />

                            
        </>
    )
}

export const RadioButton = ({verbose,onChangeHandler,options,...rest})=>{
    // console.log(props);
    // console.log(verbose,onChangeHandler,rest)
    // console.log(verbose,rest)
    return(
        <>
            <label>{capitalize(verbose)}</label>
            <div className="selectgroup w-100">
                {options.map((item,i)=>{
                    return (
                        <label className="selectgroup-item" key={i}>
                            <input 
                                className="selectgroup-input"
                                {...rest}
                                data-val={item}
                                onChange={(e)=>onChangeHandler(e)}
                                checked={rest.value.toLocaleLowerCase() === item.toLocaleLowerCase()}
                            />

                            <span className="selectgroup-button" style={{color:'white'}}>
                                {item}
                            </span>
                        </label>
                    )
                })}
                

            </div>
        </>
    )
}

export const CheckBox = ({verbose,onChangeHandler,Id,...rest})=>{
    // console.log(props);
    // console.log(verbose,onChangeHandler,rest)
    // console.log(Id)
    // console.log(Id)
    return(
        <>
            <div className="custom-control custom-checkbox">
                <input 
                    type="checkbox" 
                    className="custom-control-input" 
                    id={slugify(verbose)}
                    {...rest}
                    onChange={(e)=>onChangeHandler(e)}
                />
                <label className="custom-control-label" htmlFor={slugify(verbose)}>
                    {
                        rest.label ? 
                            rest.label
                        :
                            verbose
                    }
                </label>
            </div>
        </>
    )
}

export const SelectInput = ({verbose,onChangeHandler,options,...rest})=>{
    // console.log(props);
    // console.log(verbose,onChangeHandler,rest)
    return(
        <>
            <div className="form-group">
                
                <label>{capitalize(verbose)}</label>

                <select 
                    className="form-control"
                    onChange={(e)=>onChangeHandler(e)}
                    {...rest}
                >
                    <option value="">-----</option>

                    {options.map((item,i)=>{
                        return (
                            <option value={item} key={i}>{item}</option>
                        )
                    })}
                </select>

            </div>
        </>
    )
}

// export default FormField;