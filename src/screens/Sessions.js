import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import { getSessionError, getSessions, getSessionStatus, loadSessions } from '../app/sessionSlice';
import { NewSessionFormConfig } from '../constants/form_configs';
import { statuses } from '../constants/statuses';
import { createField, createFormDataFromSchema, isArrayEmpty } from '../constants/utils';
import Loading from '../widgets/Preloader/loading';
import Modal from '../widgets/Modal/modal';
import { getSettingsLevels, getSettingsRoles, getSettingsSessions } from '../app/settingsSlice';
import { academic_session_channel } from '../constants/channels';
import { useNavigate } from 'react-router-dom';
import { sessionUrl } from '../constants/app_urls';

const SessionError = ({message, action, onAction, icon}) =>{
    return (
      <div className="card">
        <div className="card-body">
          <div className="no-record">
            
            <p>
              { icon || <i className="fad fa-cabinet-filing"></i>}
            </p>

            <p>

              {
                message || "No Session"
              }

            </p>

            {
              action &&(
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => onAction()}
                >
                  {action || 'Click here'}
                </button>

              )
            }
            
          </div>
        </div>

      </div>
    )
}

const CreateSession = ({onClose}) =>{

  const settings = useSelector(getSettingsSessions);
  const levels = useSelector(getSettingsLevels);
  const roles = useSelector(getSettingsRoles);

  const storeDispatch = useDispatch();

  const [sessionData, setSessionData] = useState(() => {
    const form_ = createFormDataFromSchema(NewSessionFormConfig);
    return form_
  });

  const [loading, setLoading] = useState(false);
  const [canCreate, setCanCreate] = useState(false);
  const [err, setErr] = useState(null);


  const gatherData = () => {
    // Gather Data from state
    let _data = {};
    for (let [field, config] of Object.entries(sessionData.form)) {
      _data[field] = config.config.value;
    }

    return _data;
  }

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

    let _form = sessionData.form;

    if (!Boolean(_form[field_name])) return;

    setSessionData((prev) => {
      prev.form[field_name].config.value = field_value;

      return {
        ...prev,
      }

    });

  }


  const handleSubmit = () => {
    const data = gatherData();

    const { no_of_terms } = settings;

    // add session settings
    const session_settings = {
      ...settings,
      terms:{},
      levels:{},
      roles:{
        ...roles
      }
    };


    // ADD TERMS
    for (let termIndex = 1; termIndex <= Number(no_of_terms); termIndex++) {
      session_settings.terms[termIndex] = null;
    }

    Object.keys(levels).forEach((level_id)=>{
      session_settings.levels[level_id] = {
        set_id:null
      };
    });


    const new_session_data = {
      ...data,
      settings:session_settings
    }

    window.api.request(academic_session_channel.create, new_session_data)
    .then((res)=>{
      storeDispatch(loadSessions());
      onClose();
    })
    .catch(err=>{
      setErr(err.message);
      setLoading(false);
    })

    setLoading(true);


  }


  return (
    <Modal 
        title="New Session" 
        onClose={() => { onClose()}}
        onSave={() => { handleSubmit()}}
        affirmTxt={"Create"}
        loading={loading}
        hideActionBtn={canCreate}

    >
      <form>
        <p className='text-danger'>{err}</p>
        {createField({ form: sessionData.form }, handleInputChange)}
      </form>        
    </Modal>
  )

}


const SessionItem = ({session, onClick})=>{
  const onGoing = !Boolean(session.date_closed);
  return(
    <div className="col">
      <div className="record-item" onClick={() => onClick()}>
        <div className="record-icons">

          <p className="folder-icon">
            {
              onGoing ?
                <i className="fad fa-folder-open text-secondary"></i>
                :
                <i className="fad fa-folder text-secondary"></i>
            }

          </p>

        </div>
        <div className="details">
          
          <h4 className="lead lead-sm">
            {session.title}
          </h4>

          <ul>
            <li>Status:
              {
                onGoing ?
                  <b className="badge bg-secondary text-white ml-3">
                    Ongoing
                  </b>
                  :
                  <b className="badge bg-success text-white ml-3">
                    Ended
                  </b>
              }
            </li>


            <li>
              Started: {session.date_started}
                
            </li>

            {
              !onGoing && (<li>Ended: {session.date_closed}</li>)
            }
            
          </ul>
        </div>
      </div>
    </div>
  )
}

const Sessions = () => {

  const error = useSelector(getSessionError);
  const status = useSelector(getSessionStatus);
  const sessions = useSelector(getSessions);

  const navigate = useNavigate();

  const [createSession, setCreateSession] = useState(false);

  if(Boolean(error)){
    return <SessionError 
      message={error}
      icon={<i className="fa fa-exclamation-triangle" aria-hidden="true"></i>}
    />
  }

  // A session is ongoing if it has no date_closed set
  const onGoingSession = sessions.filter((ech) => !Boolean(ech.date_closed));

  const renderContent = ()=>{

    if (status === statuses.loading) {
      return <Loading />;
    }


    if (isArrayEmpty(sessions)) {
      return <SessionError
        message={"No Session"}
        action={"Create session"}
        onAction={() => setCreateSession(true)}
      />
    }



    return (

      <div className="row folder-record">

        {

          sessions.map((session) => {
            return <SessionItem
              session={session}
              key={session._id}
              onClick={() => navigate(`${sessionUrl}/${session._id}`)}
            />

          })

        }


        {
          onGoingSession.length === 0 && (
            <div className="col">

              <div
                className="new-record-item text-primary"
                onClick={() => setCreateSession(true)}
              >
                <i className="fas fa-plus"></i>
                New Session
              </div>

            </div>
          )
        }


      </div>
    )

  }



  return (
    <>
      {createSession && <CreateSession onClose={() => setCreateSession(false)}/>}

      {
        renderContent()
      }

    </>
  )
}

export default Sessions