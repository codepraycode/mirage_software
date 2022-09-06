import React,{useState,useEffect} from 'react';
import Loading from '../widgets/Preloader/loading';
import {isArrayEmpty, isObjectEmpty, parseFileUrl} from '../constants/utils';

import Modal from '../widgets/Modal/modal';
import { avatar } from '../constants/assets';
import { useSelector } from 'react-redux';
import { getSettingsStaffs, getSettingsSubjects } from '../app/settingsSlice';

function SubjectsSettings() {


    const subjects = useSelector(getSettingsSubjects);
    const staffs = useSelector(getSettingsStaffs);
    
    const [loading, setLoading] = useState(false);
    const [editingLevelFocus, setEditingLevelFocus] = useState(null);
    const [editSubjectStaffs, setEditSubjectStaffs] = useState(false);

    const handleModalSave = ()=>{

        console.log(editingLevelFocus);
        setEditingLevelFocus(null)
        if (editSubjectStaffs) {
            setEditSubjectStaffs(false)
        }
        setLoading(true);
    }

    const handleInputChange = (e)=>{

        let field_name = e.target.name;
        let field_value = e.target.value;
        let field_type = e.target.type;


        if (!Object.keys(edit_focus).includes(field_name)) return;

        if (['checkbox', 'radio'].includes(field_type)) {

            field_value = e.target.checked;
        }

        console.log(field_name, "changed to", field_value);
    }    


    const renderContent = ()=>{

        if (isObjectEmpty(subjects)){
            return(
                <p className="text-center text-muted">
                    No Subjects
                </p>
            )
        }


        return(
            <div className="list-group">

                {
                    Object.entries(subjects).map(([_id, subject])=>{
                        return (
                            <div key={_id}>
                                <span 
                                    className="list-group-item list-group-item-action flex-column align-items-start" 
                                >
                        
                                    <div className="d-flex w-100 justify-content-between">
                                        <h5 className="mb-1">{subject.name}</h5>

                                        <p>
                                            <small className="text-muted">
                                                {
                                                    subject.required ?
                                                        'Required'
                                                    :
                                                    null
                                                }
                                                
                                            </small>


                                            <span className="text-primary">
                                                <i className="fas fa-pen ml-3" 
                                                    style={{cursor:"pointer"}}
                                                    onClick={()=>{
                                                        setEditingLevelFocus(() => {
                                                            return { _id: id, subject}
                                                        });
                                                    }}
                                                ></i>
                                            </span>
                                        </p>
                                    </div>

                                    <div className='my-2 d-flex align-items-center'>
                                        <h4 className='lead lead-sm mr-4'>Short:</h4>
                                        <span className="text-primary mb-2">
                                            {subject.short}
                                        </span>
                                    </div>


                                    <div className='my-2 d-flex align-items-center'>
                                        <h4 className='lead lead-sm mr-4'>Description:</h4>
                                        <span className="text-primary mb-2">
                                            {subject.description || 'Not Provided'}
                                        </span>
                                    </div>

                                    <hr/>

                                    <div className='my-2 d-flex align-items-center justify-content-between'>
                                        <div>
                                            <h4 className='lead lead-sm mr-4'>Subject Teachers:</h4>
                                            {renderTeachers(subject.staffs)}
                                        </div>

                                        <p>
                                            <span className='text-primary'>
                                                <i className="fas fa-pen"
                                                    style={{cursor:'pointer'}}
                                                    onClick={()=>{}}
                                                ></i>
                                            </span>
                                        </p>
                                    </div>
                                    
                                    
                                </span>
                            <br/>
                            </div>
                        )
                    })
                }            

            </div>
        )
    }

    const renderTeachers = (teachers_id)=>{
        if(isArrayEmpty(teachers_id)){
            return (<span className="text-center text-muted mb-2">
                No Teacher Assigned To This Subject
            </span>)
        }

        if (isArrayEmpty(staffs)){
            return (<span className="text-center text-muted mb-2">
                No Staff Available
            </span>)
        }

        return(
            <div className="badges">
                                        
                {
                    teachers_id.map((teacher_id)=>{
                        let details = staffs.find((staff)=>staff._id === teacher_id);

                        const isLast = i === teachers_id.length -1
                        

                        if (!Boolean(details)) return null

                        const {title, first_name, last_name} = details;

                        return <span className="badge" key={i}>
                            {`${title} ${first_name} ${last_name}`.trim()}{!isLast ? ',':''}
                        </span>
                    })
                    
                }
                                        
            </div>
        )
    }

    const renderStaffSelectModal = ()=>{
        
        let selected_teachers = editingLevelFocus.staffs || [];
        return(
            <div className="table-responsive">
                <table className="table table-striped v_center">
                    <thead>
                        <tr>
                            <th></th>

                            <th>Staff Name</th>
                            <th>Qualification</th>
                        </tr>
                    </thead>

                    <tbody className='text-center'>
                        {
                            staffs.map((staff)=>{
                                return (<tr key={i}>
                                    <td className="p-0 text-center">
                                        <div className="custom-checkbox custom-control">
                                            <input 
                                                type="checkbox" 
                                                data-checkboxes="mygroup" 
                                                className="custom-control-input" 
                                                id={staff._id}
                                                onChange={handleInputChange}
                                                checked={selected_teachers.includes(staff._id)}
                                            />
                                            <label htmlFor={staff._id} className="custom-control-label">&nbsp;</label>
                                        </div>
                                    </td>

                                    <td className='d-flex align-items-center'>
                                        <img 
                                            alt={`${staff.title} ${staff.first_name} Passport`}
                                            // src="assets/img/avatar/avatar-5.png" 
                                            src={parseFileUrl(staff.passport)}//{profile.logo}
                                            onError={
                                                ({ currentTarget }) => {
                                                    currentTarget.onerror = null; // prevents looping
                                                    currentTarget.src=avatar;
                                                }
                                            }
                                            className="rounded-circle" 
                                            width="35" 
                                            data-toggle="tooltip" 
                                            title={`${staff.title} ${staff.first_name}`}
                                        />
                                        <span className="ml-2">
                                            {staff.title} {staff.first_name} {staff.last_name}
                                        </span>
                                    </td>

                                    <td>
                                        {staff.highest_qualification ?? '---'}
                                    </td>

                                </tr>)
                            })
                        }
                        
                    </tbody>
                    
                </table>
                </div>
        )
    }


    const renderModalContent = ()=>{
        
        if (editSubjectStaffs){
            // For Teacher
            return renderStaffSelectModal()
        }

        let { name, short, description, total_obtainable, required } = editingLevelFocus;
        return (
            <>
                <div className="form-group">
                    <label>Subject Name</label>
                    <input 
                        type="text" 
                        className="form-control"
                        name='name'
                        value={name ?? ''}
                        onChange={handleInputChange}
                        required={true}
                    />
                </div>


                <div className="form-group">
                    <label>Subject Short</label>
                    <input 
                        type="text" 
                        className="form-control"
                        name='short'
                        value={short ?? ''}
                        onChange={handleInputChange}
                        required={true}
                    />
                </div>

                <div className="form-group">
                    <label>Subject Description</label>
                    <textarea 
                        type="text" 
                        className="form-control"
                        name='description'
                        value={description ?? ''}
                        onChange={handleInputChange}
                    />
                </div>


                <div className="form-group">
                    <label>Total Score Obtainable</label>
                    <input 
                        type="number" 
                        className="form-control"
                        min={1}
                        name='total_obtainable'
                        value={total_obtainable ?? 0}
                        onChange={handleInputChange}
                        required={true}
                    />
                </div>

                <div className="form-group">
                    <label className="custom-switch mt-2">
                        <input 
                            type="checkbox" 
                            className="custom-switch-input"
                            name='required'
                            onChange={handleInputChange}
                            checked={required ?? false}
                        />
                        <span className="custom-switch-indicator"></span>
                        <span className="custom-switch-description">
                            Required
                        </span>
                    </label>
                </div>

            </>
        )
    }

    const renderModal = ()=>{

        if (!Boolean(editingLevelFocus)) return;


        const checkCanSave = ()=>{
            let { name, short, total_obtainable } = editingLevelFocus;

            let res = true;

            if(!name){
                res = false;
            }

            if(!short){
                res = false;
            }

            if(!total_obtainable || parseInt(total_obtainable) < 1){
                res = false;
            }
            

            return res;

        }

        return(
            <Modal
                title={`Level Settings`}
                onClose={()=>{
                    setEditingLevelFocus(null)
                    if (editSubjectStaffs){
                        setEditSubjectStaffs(false)
                    }
                }}
                onSave={()=>{
                    handleModalSave();
                }}
                affirmTxt={"Save"}
                loading={loading}
                disableAffirm={!checkCanSave()}
            >
                {

                    renderModalContent()
                }
            </Modal>
        )
    }

    
    return (
        <>
            {renderModal()}
            <div className="card">
                <div className="card-header">
                    <h4>Subjects</h4>


                    <div className="card-header-action">
                        <span className="text-primary">
                            <i className="fa fa-plus" aria-hidden="true"
                                style={{cursor:"pointer"}}
                                onClick={()=>{
                                    setEditingLevelFocus(() => {
                                        return { _id: null, subject: {} }
                                    });
                                }}

                            ></i>
                        </span>
                    </div>
                    
                </div>

                <div className="card-body">
                    {
                        renderContent()
                    }
                </div>
            </div>
        </>
    )
}

export default SubjectsSettings;
