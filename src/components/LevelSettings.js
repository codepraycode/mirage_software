import React, { useState, useEffect } from 'react';

import Loading from '../widgets/Preloader/loading';
import Modal from '../widgets/Modal/modal';

import { isArrayEmpty, isObjectEmpty } from '../constants/utils';
import LevelCategories from './LevelCategories';

function Levels() {
    const [state, setState] = useState({
        // settings:null
        // all_subjects:null
        loaded: false,
        loading: true,
        processing: false,
        showModal: false,
        edit_focus: ''
    });

    const settings = null;
    const all_subjects = [];
    const loading = false;
    const proccessing = false;
    const showModal = false;
    const edit_focus = null;

    let level_manifest = {
        level_label: '',
        categories: [],
        have_categories: false,
        subjects: [],
    }


    const handleInputChange = (e) => {
        let field_name = e.target.name;
        let field_value = e.target.value;

        console.log(field_name, "changed to", field_value);
    }


    // const processModalSave = () => {
    //     return new Promise((resolved, rejected) => {
    //         if (isObjectEmpty(edit_focus)) {
    //             resolved({})
    //             return;
    //         }
            
    //         // let edit_focus = { ...edit_focus }

    //         if (!edit_focus.level_label) {
    //             resolved(edit_focus);
    //             return;
    //         }


    //         let { categories } = edit_focus;
    //         edit_focus.have_categories = !isArrayEmpty(categories);
    //     });
    // }


    const renderSubjects = (subjects_id) => {
        if (isArrayEmpty(subjects_id)) {
            return (
                <p className="text-muted text-center">
                    No Subject Added To This Level
                </p>
            )
        }

        return (
            <div className="badges">
                {
                    subjects_id.map((echs, i) => {
                        let name = all_subjects[echs]

                        if (!name) return null;

                        return (
                            <span className="badge badge-primary" key={i}>
                                {name}
                            </span>
                        )
                    })
                }
            </div>
        )
    }

    const renderCategories = (categories) => {
        if (isArrayEmpty(categories)) {
            return (
                <p className="text-muted text-center">
                    No Categories
                </p>
            )
        }
        let cat_temp = []

        for (let eah of categories) {
            let name = all_categories[eah]
            if (!name) {
                continue
            }

            cat_temp.push(name)
        }

        if (isArrayEmpty(cat_temp)) {
            return (
                <p className="text-muted text-center">
                    No Categories
                </p>
            )
        }

        return (
            <p className="text-balls text-primary">
                {
                    cat_temp.map((echl, i) => {


                        return (
                            <span key={i}>
                                <b>{echl}</b>
                            </span>
                        )
                    })
                }
            </p>
        )
    }


    const renderContent = () => {
        if (loading) {
            return (
                <Loading />
            )
        }

        if (isObjectEmpty(settings)) {
            return (
                <p className="text-muted text-center">
                    No Level Settings
                </p>
            )
        }

        let template = [];

        if (isArrayEmpty(settings?.levels)) {
            template.push(
                <p className="text-center text-muted" key={0}>
                    No Level Settings
                </p>
            )

        } else {
            template.push(
                <div className="row" key={1}>
                    {
                        settings.levels.map((each_level, i) => {
                            return (
                                <div className="col-12 col-md-6 col-lg-4" key={i}>
                                    <div className="card card-primary">
                                        <div className="card-header">
                                            <h4>{each_level.level_label}</h4>

                                            <div className="card-header-action">
                                                <span className='text-primary'>
                                                    <i className="fas fa-pen"
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => {}}></i>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="card-body">
                                            <div className='my-2'>
                                                <p>Level Categories</p>

                                                {renderCategories(each_level.categories)}
                                                
                                            </div>

                                            <div className='my-2'>
                                                <p>Subjects Offered</p>


                                                {renderSubjects(each_level.subjects)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            )
        }


        return <>
            {/* {renderCategories(state.settings.categories, true)} */}
            <LevelCategories />
            <hr />
            {template}
        </>;
    }


    const renderAvailableLevelCategories = (level_categories) => {
        if (isObjectEmpty(settings)) {
            return (
                <p className="text-center text-muted">
                    No Categories
                </p>
            )
        }
        let categories = settings?.categories ?? [];

        if (isArrayEmpty(categories)) {
            return (
                <p className="text-center text-muted">
                    No Available Categories
                </p>
            )
        }

        let cat_temp = []

        for (let eah of categories) {
            // let name = state.all_categories[eah]
            if (!eah.label) {
                continue
            }

            cat_temp.push(eah)
        }

        if (isArrayEmpty(cat_temp)) {
            return (
                <p className="text-center text-muted">
                    No Available Categories
                </p>
            )
        }

        // console.log(categories);

        return (
            <div className="form-group" style={{ width: '350px' }}>
                <label className="form-label">Level Categories</label>
                <div className="selectgroup selectgroup-pills">
                    {
                        cat_temp.map((each, i) => {
                            return (
                                <label
                                    className="selectgroup-item"
                                    key={i}
                                >
                                    <input
                                        type="checkbox"
                                        name={"categories"}
                                        value={each._id}
                                        className="selectgroup-input"
                                        checked={level_categories.includes(each._id)}
                                        onChange={handleInputChange}
                                    />

                                    <span
                                        className="selectgroup-button"
                                    >
                                        {each.label}
                                    </span>
                                </label>
                            )
                        })
                    }

                </div>
            </div>
        )
    }


    const renderAvailableSubjects = (level_subjects) => {
        let subjects = all_subjects ?? {};

        if (isObjectEmpty(subjects)) {
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
                        Object.entries(subjects).map(([id, name], i) => {
                            return (
                                <label
                                    className="selectgroup-item"
                                    key={i}
                                >
                                    <input
                                        type="checkbox"
                                        name="subjects"
                                        value={id}
                                        className="selectgroup-input"
                                        checked={level_subjects.includes(id)}
                                        onChange={handleInputChange}
                                    />

                                    <span
                                        className="selectgroup-button"
                                    >
                                        {name}
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
        if (loading) return;

        if (!showModal) return;

        if (isObjectEmpty(edit_focus)) return;
        
        let { level_label, categories, subjects } = edit_focus
        
        return (
            <Modal
                title={`Level Settings`}
                onClose={() => { }}
                onSave={() => { }}
                affirmTxt={"Save"}
                loading={proccessing}
            >
                <div className="form-group">
                    <label>Level Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="level_label"
                        value={level_label}
                        onChange={handleInputChange}
                    />
                </div>

                <hr />
                {renderAvailableLevelCategories(categories)}
                <hr />
                {renderAvailableSubjects(subjects)}
            </Modal>
        )
    }

    // console.log(state);

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
                                onClick={() => { }}

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
