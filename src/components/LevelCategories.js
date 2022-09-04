import React from 'react';

import { isArrayEmpty } from '../constants/utils';
import Modal from '../widgets/Modal/modal';
import Loading from '../widgets/Preloader/loading';

const LevelCategories = () => {

    const categories = {};
    const loading = false;
    const showModal = false;
    const processing = false;
    const error = '';
    const edit_focus_index = null
    const edit_focus = null;
    const isdeleting = false;

    
    const handleInputChange = (e) => {
        e.preventDefault();
    }



    const renderContent = () => {
        if (loading) return <Loading />;

        if (isArrayEmpty(categories)) {
            return (
                <p className="text-muted text-center">
                    No Available Categories
                </p>
            )
        }


        return (
            <div className='d-flex'>
                <p className="text-muted mr-4">
                    Available Categories:
                </p>


                <div className="badges">
                    {
                        categories.map((echc, i) => {

                            return (
                                <span
                                    className="badge badge-primary" key={i}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {}}
                                >
                                    {echc.label}
                                </span>
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

        let { label } = edit_focus;

        const checkDisable = () => {
            let res = false;

            if (!edit_focus_index) {//Creating
                if (!label) {
                    res = true;
                }
            }

            if (isdeleting) {
                res = false
            }

            return res;
        }

        return (
            <Modal
                title={`Category Settings`}
                onClose={() => { }}
                onSave={() => { }}
                affirmTxt={!isdeleting ? 'Save' : "Delete"}
                loading={processing}
                disableAffirm={checkDisable()}

            >
                <label>Category Label</label>
                <input
                    type="text"
                    className="form-control"
                    name="label"
                    value={label ?? ''}
                    onChange={handleInputChange}

                />
            </Modal>
        )
    }

    return (
        <>
            {
                error ?
                    <p className="text-center text-muted">
                        {error}
                    </p>
                    :
                    <>
                        {renderModal()}
                        <div className="d-flex align-items-center justify-content-between">
                            {renderContent()}


                            <span className='text-primary mt-0' style={{ position: 'relative', top: '-8px' }}>
                                <i className="fas fa-pen"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => { }}></i>
                            </span>
                        </div>
                    </>
            }

        </>

    );
};

export default LevelCategories;