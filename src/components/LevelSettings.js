import React, { useState, useEffect } from 'react';
import { nanoid } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

import Modal from '../widgets/Modal/modal';

import { isArrayEmpty, isObjectEmpty } from '../constants/utils';

import { getSettingsLevels, getSettingsSubjects, getSettingsUpdateStatus, updateLevel } from '../app/settingsSlice';
import { statuses } from '../constants/statuses';


function Levels() {

    const levels = useSelector(getSettingsLevels);
    const all_subjects = useSelector(getSettingsSubjects);
    
    const [loading, setLoading] = useState(false);
    const [editingLevelFocus, setEditingLevelFocus] = useState(null);


    const status = useSelector(getSettingsUpdateStatus);
    const storeDispatch = useDispatch();

    const handleInputChange = (e) => {
        e.preventDefault();
        let field_name = e.target.name;
        let field_value = e.target.value;

        // console.log(field_name, "changed to", field_value);

        if(!Boolean(editingLevelFocus)) return;

        setEditingLevelFocus((prev) => {
            if (['subjects'].includes(field_name)){
                let subjects = [];

                let prev_subjects = prev.level['subjects'] || [];

                if (prev_subjects.includes(field_value)){
                    subjects = prev_subjects.filter((subj)=> subj !== field_value);
                }else{
                    subjects = [...prev_subjects, field_value];
                }

                return {
                    ...prev,
                    level: {
                        ...prev.level,
                        subjects,
                    }
                }
            }

            return {
                ...prev,
                level:{
                    ...prev.level,
                    [field_name]: field_value,
                }
            }
        });

    }


    const processModalSave = () => {
        if (isObjectEmpty(editingLevelFocus)) {
            return;
        }


        const {_id, level} = editingLevelFocus;

        const data = {
            [_id || nanoid()]:level
        }

        storeDispatch(updateLevel(data));

        setLoading(true);
    }

    const renderLevelSubjects = (subjects_id) => {
        if (isArrayEmpty(subjects_id)) {
            return (
                <p className="text-muted text-center">
                    No subject added to this level
                </p>
            )
        }

        return (
            <div className="badges">
                {
                    subjects_id.map((id) => {
                        const {name} = all_subjects[id]

                        if (!name) return null;

                        return (
                            <span className="badge badge-primary" key={id}>
                                {name}
                            </span>
                        )
                    })
                }
            </div>
        )
    }

    const renderContent = () => {

        if (isObjectEmpty(levels)) {
            return (
                <p className="text-muted text-center">
                    No Levels
                </p>
            )
        }

        let template =  Object.entries(levels).map(([id, each_level], ) => {
            return (
                <div className="col-12 col-md-6 col-lg-4" key={id}>
                    <div className="card card-primary">
                        <div className="card-header">
                            <h4>{each_level.label}</h4>

                            <div className="card-header-action">
                                <span 
                                    className='text-primary'
                                    style={{ cursor: "pointer" }}
                                >
                                    <i 
                                        className="fas fa-pen"
                                        onClick={() => {
                                            setEditingLevelFocus(() => {
                                                return { _id: id, level: each_level }
                                            });

                                        }}
                                    ></i>
                                </span>
                            </div>
                        </div>

                        <div className="card-body">

                            <div className='my-2'>
                                <p>Subjects Offered</p>


                                {renderLevelSubjects(each_level.subjects)}
                            </div>
                        </div>
                    </div>
                </div>
            )
        });

        


        return <>

            <div className="row">
                {template}
            </div>
        </>;
    }

    const renderAvailableSubjects = (level_subjects) => {

        if (isObjectEmpty(all_subjects)) {
            return (
                <p className="text-center text-muted">
                    No Available Subjects
                </p>
            )
        }

        // console.log(subjects);
        return (
            <div className="form-group" style={{ width: '350px' }}>
                <label className="form-label">Level Subjects</label>

                <div className="selectgroup selectgroup-pills">
                    {
                        Object.entries(all_subjects).map(([_id, subject]) => {
                            return (
                                <label
                                    className="selectgroup-item"
                                    key={_id}
                                >
                                    <input
                                        type="checkbox"
                                        name="subjects"
                                        value={_id ?? ''}
                                        className="selectgroup-input"
                                        checked={level_subjects?.includes(_id)}
                                        onChange={handleInputChange}
                                    />

                                    <span
                                        className="selectgroup-button"
                                    >
                                        {subject.name}
                                    </span>
                                </label>
                            )
                        })
                    }

                </div>
            </div>
        )
    }

    const renderModal = () => {

        if (isObjectEmpty(editingLevelFocus)) return;
        
        let { level } = editingLevelFocus;

        // let { label, subjects } = level;
        
        return (
            <Modal
                title={`Level Settings`}
                onClose={() => setEditingLevelFocus(null)}
                onSave={() => processModalSave()}
                affirmTxt={"Save"}
                loading={loading}
            >
                <div className="form-group">
                    <label>Level Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="label"
                        value={level?.label || ''}
                        onChange={handleInputChange}
                    />
                </div>

                <hr />
                {renderAvailableSubjects(level?.subjects)}
            </Modal>
        )
    }

    const checkLoadStatus = () => {
        if (status === statuses.idle && loading) {
            setLoading(false);
            setEditingLevelFocus(null);
            
        }
    }

    useEffect(() => {
        checkLoadStatus();
    })


    return (
        <>
            {renderModal()}
            <div className='card'>
                <div className="card-header">
                    <h4>Levels</h4>

                    <div className="card-header-action">
                        <span className="text-primary">
                            <i className="fa fa-plus" aria-hidden="true"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    setEditingLevelFocus(() => {
                                        return { _id:null, level:{}}
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

export default Levels;
