// Utils
import React from 'react';
import { useLocation } from 'react-router-dom';
import {InputField,ImageField,TextAreaField,RadioButton,SelectInput,CheckBox} from '../widgets/Form/formfields';
import moment from 'moment';
import { form_configs_options} from './form_configs';
import { image_placeholder } from './assets';


export const supify = (n) => {

    const num = Number(n);
    if (num === 1) return 'st'
    if (num === 2) return 'nd'
    if (num === 3) return 'rd'

    return 'th'
}

export const getDate = (date_stamp, withTime=false) => {
    // console.log(date_stamp);
    if(date_stamp === null){
        return '...'
    }
    let date = new Date(date_stamp)

    // console.log(date)
    if(date.toLocaleString() === "Invalid Date"){
        return '---'
    }
    // console.log(moment(date).calendar());
    
    return moment(date).calendar();
    // if(withTime){
    //     return date.toUTCString()
    // }
    // return date.toLocaleDateString()
}

export const getDateAge = (date_stamp) =>{
    let date = new Date(date_stamp)

    // console.log(date)
    if(date.toLocaleString() === "Invalid Date"){
        return '---'
    }

    return moment(date).calendar();
}

export const isDate = (date_stamp) => {
    // console.log(date_stamp);
    if(typeof date_stamp !== 'object'){
        return false
    }

    let date = new Date(date_stamp)

    // console.log(date)
    if(date.toLocaleString() === "Invalid Date"){
        return false
    }
    
    return true;
}

export function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export function getFirstify(num) {
    let res = ''
    if(isNaN(parseInt(num))){
        return res;
    }
    
    switch (num) {
        case 0:
            res = '';
            break;
        case 1:
            res = 'st'
            break;
        case 2:
            res = 'nd'
            break;
        case 3:
            res = 'rd'
            break;
        default:
            res = 'th';
    }


    return res;
}

export const capitalize = (raw_text) => {
    // Parse Seperator
    if(typeof(raw_text) !== 'string') return '';

    let text = raw_text.trim();

    if(text.length <1) return text;

    let parsed_text;
    if (text.includes(' ')) {
        parsed_text = text.split(' ');
    }
    else if (text.includes('_')) {
        parsed_text = text.split('_');
    }

    if (isArrayEmpty(parsed_text)) {
        return text.at(0).toUpperCase() + text.slice(1,);
    }

    let _ = parsed_text.map((each) => {
        // console.log(each);
        return each.at(0).toLocaleUpperCase() + each.slice(1,)
    })

    return _.join(' ')


}
export const slugify = (text) => {
    // Parse Seperator
    let parsed_text;
    if (text.includes(' ')) {
        parsed_text = text.split(' ');
    }
    if (text.includes('/')) {
        parsed_text = text.split('/');
    }

    if (!parsed_text) {
        return text.toLowerCase()
    }

    return parsed_text.join('_')


}
export function isObjectEmpty(obj) {
    if(obj === undefined || obj === null){
        return true
    }

    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function isArrayEmpty(arr) {
    // try{
    //     console.log(arr.constructor === Array);
    // }
    // catch{}
    if(!Array.isArray(arr)){//arr === undefined || arr === null){
        return true
    }

    
    return arr.length === 0;
}

export const getField = (config, ChangeHandler, key=0) =>{
    let field_template = null;
    
    let {verbose, ...attr} = config;

    // console.log(verbose,attr)

    switch (attr['type']){
        case 'text':
            field_template =(
                <div key={key} className="form-group">
                    {<InputField
                    verbose={verbose}
                    {...attr}
                    onChangeHandler={(e,verbose)=>{ChangeHandler(e,verbose)}}

                    />}
                </div>
                )
                
            break;
         case 'number':
            field_template =(
                <div key={key} className="form-group">
                    {<InputField
                    verbose={verbose}
                    {...attr}
                    min={1}
                    onChangeHandler={(e,verbose)=>{ChangeHandler(e,verbose)}}

                    />}
                </div>
                )
                
            break;
        
        case 'date':
            field_template =(
                <div key={key} className="form-group">
                    {<InputField
                    verbose={verbose}
                    {...attr}
                    onChangeHandler={(e,verbose)=>{ChangeHandler(e,verbose)}}

                    />}
                </div>
            )
                
            break;
        
        case 'checkbox':
            field_template =(
                <div key={key} className="form-group">
                    {
                        <CheckBox
                            verbose={verbose}
                            {...attr}
                            onChangeHandler={(e,verbose)=>{ChangeHandler(e,verbose)}}
                        />
                    }
                </div>
            )
                
            break;
        
        default:
            field_template = null;
            break;
    }
    return field_template;
}

export function parseFileUrl(filePath){
    // console.log(filePath);
    // let path_url = url.format({
    //             pathname: filePath,
    //             protocol: "mirage",
    //             slashes: true,
    // })
    if(!filePath){
        // filePath = ''
        return image_placeholder;
    }

    
    let path_url = `mirage://${filePath.replaceAll('\\','--')}`;
    // console.log("Proposed URL",path_url )
    return path_url;
}

export function EllipsizeText(txt,len=8){
    if(txt.length > len){
        return txt.slice(0,len) + '...'
    }

    return txt;
}


export const convertToDataUrl = (src)=>{
    return new Promise((resolved,rejected)=>{
        var img = new Image();
        img.onload = function() {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            var dataURL;
            canvas.height = this.naturalHeight;
            canvas.width = this.naturalWidth;
            ctx.drawImage(this, 0, 0);
            dataURL = canvas.toDataURL('image/jpeg');
            // callback(dataURL);
            resolved(dataURL)
        };
        img.src = src;
        if (img.complete || img.complete === undefined) {
            img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
            img.src = src;
        }
    })
}


export const createFormDataFromSchema = (form_config)=>{
    let { form_data, groups, scopes } = form_config;

    let form = {}
    
    for(let [field,meta] of Object.entries(form_data)){
        let config_option = {}
        let {data_type,options,required, ...rest_config} = meta;
        
        switch (data_type){
            case 'image':
                config_option = {...form_configs_options.image}
                break;
            case 'text':
                config_option = {...form_configs_options.text}
                break;
            
            case 'password':
                config_option = {...form_configs_options.password}
                break;
            case 'long_text':
                config_option = {...form_configs_options.long_text}
                break;
            
            case 'date':
                config_option = {...form_configs_options.date}
                break;
            
            case 'email_text':
                config_option = {...form_configs_options.email_text}
                break;
            
            case 'radio_selected_text':
                config_option = {...form_configs_options.radio_selected_text}
                break;
            case 'dropdown_selected_text':
                config_option = {...form_configs_options.dropdown_selected_text}
                break;

            case 'checked_text':
                config_option = {...form_configs_options.checked_text}
                break;

            default:
                console.log("Found No Config Option for", data_type)
                break
                        
        }
        if(isObjectEmpty(config_option)){
            continue
        }



        config_option.config = {
            ...config_option.config,
            required:required ? true:false,
            ...rest_config
        }
        if(options){
            config_option.options = options   
        }
        if(required){
            config_option.validation = {
                msg:''
            }
        }


        form[field] = config_option

    }

    // console.log(form_data);
    let response = {form}
    if(groups){
        response.groups = groups
    }
    
    if(scopes){
        response.scopes = scopes;
        response.scopes_data = [];
        response.scope_focus = 1;
    }
    
    return response;
}

const getElem = (form_config,onChangeHadler)=>{
        // console.log(form_config);
        let {verbose,key,elem,config,validation,options} = form_config;
        let template = null;
        // console.log(verbose,key,elem,config)
            if(elem === 'input'){
                template = (
                   
                        <InputField 
                            verbose={verbose}
                            {...config}
                            validation={validation}
                            onChangeHandler={(e)=>{onChangeHadler(e)}}
                        />
                    
                );
            }

            if(elem === 'image'){
                template =  (
                    
                        <ImageField
                            verbose={verbose}
                            {...config}
                            onChangeHandler={(e)=>{onChangeHadler(e)}}
                        />
                    
                )
            }

            if(elem==='textarea'){
                template =  (
                    
                        <TextAreaField
                             verbose={verbose}
                            {...config}
                            onChangeHandler={(e)=>{onChangeHadler(e)}}
                        />

                    
                )
            }


            if(elem==='radio'){
                template =  (
                    
                        <RadioButton
                             verbose={verbose}
                            {...config}
                            options={options}
                            onChangeHandler={(e)=>{onChangeHadler(e)}}
                        />

                    
                )
            }

            if(elem==='select'){
                template =  (
                    
                        <SelectInput
                             verbose={verbose}
                            {...config}
                            options={options}
                            onChangeHandler={(e)=>{onChangeHadler(e)}}
                        />

                    
                )
            }

            if(elem==='checkbox'){
                template =  (
                    
                        <CheckBox
                             verbose={verbose}
                            {...config}
                            options={options}
                            onChangeHandler={(e)=>{onChangeHadler(e)}}
                        />

                    
                )
            }
        
        return (
            <div className="form-group" key={key}>
                {template}
            </div>
        )
}

export const createField = (form_config, onChangeHadler,attachment='', multiple=false)=>{
        let template = null;
        let validation = null;
        if(!isObjectEmpty(form_config.validation)){
            validation = {...form_config.validation}
        }
        
        if(!isArrayEmpty(form_config.groups)){
            // console.log(current_phase.groups);

            // Grouping each array as a column
            template = form_config.groups.map((grouplv1,index)=>{
                // 
                
                let cols=grouplv1.map((grouplv2,id)=>{

                        // Group is an Array
                        // console.log(grouplv2);
                        let elems = grouplv2.map((verbose,key)=>{
                            let form_temp = form_config.form[verbose];
                            
                            // console.log(form_temp);
                            return getElem(
                                {
                                    verbose:`${attachment} ${verbose}`,
                                    key,
                                    validation,
                                    ...form_temp
                                },
                                onChangeHadler
                            );
                        })
                        

                        
                        return (
                            <div className="col" key={id}>
                                {elems}
                            </div>
                        )
                });

                return (
                    <div key={index}>
                        <div className="row">
                            {
                                cols
                            }
                        </div>
                        {/* <div className="card">
                            <div className="card-body">
                                
                            </div>
                        </div> */}
                        {/* <hr/> */}
                        {
                            multiple ? 

                        
                            <div className="d-flex">
                                <button type="button" className="ml-auto btn btn-lg btn-primary">
                                    <i className="fas fa-plus mr-2"></i>
                                    Add
                                </button>
                            </div>
                        :
                            null
                        }
                    </div>
                    
                )
            });

            // console.log(rows);

            // return rows;
        }

        else{ // Display flat
            template = Object.keys(form_config.form).map((item,i)=>{
                let options = form_config.form[item];
                return (
                    <div className="form-group" key={i}>
                        {
                            getElem(
                                {
                                    verbose:`${attachment} ${item}`,
                                    key:i,
                                    validation,
                                    ...options
                                },
                                onChangeHadler
                            )
                        }
                    </div>
                )
            });

        }


        return template;
}

