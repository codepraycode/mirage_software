import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getSessionById, updateSession } from '../app/sessionSlice';
import { getAllSets } from '../app/setSlice';
import { getSettingsLevels } from '../app/settingsSlice';
import { sessionUrl } from '../constants/app_urls';
import { academic_session_channel } from '../constants/channels';
import { isArrayEmpty, isObjectEmpty, supify } from '../constants/utils';
import Modal from '../widgets/Modal/modal';



const LevelSetting = React.memo(({ onClose, all_sets, session, level }) => {

  const {levels} = session.settings;

  const storeDispatch = useDispatch();

  let pairedSet = null;

  let paired_sets = []; // ids of sets that is already assigned

  Object.entries(levels).forEach(([level_id, config])=>{

    if (!Boolean(config.set_id)) return


    if(level_id === level._id){
      pairedSet = all_sets.find((ech)=>ech._id === config.set_id);
      return
    }

    paired_sets.push(config.set_id);
  })


  const handleEngageSet = async(each_set)=>{


    const { settings, ...rest } = session;

    const {levels, ...rest_settings} = settings;

    const updated_session_data = {
      ...rest,
      settings:{
        ...rest_settings,
        levels:{
          ...levels,
          [level._id]:{
            ...levels[level._id],
            set_id:each_set._id
          }
        }
      }
    }
    
    // console.log(level._id, each_set._id)
    // console.log(updated_session_data);
    await window.api.request(academic_session_channel.update, updated_session_data);

    storeDispatch(updateSession(updated_session_data))
    onClose()
  }


  const handleDisEngageSet = async()=>{


    const { settings, ...rest } = session;

    const {levels, ...rest_settings} = settings;

    const updated_session_data = {
      ...rest,
      settings:{
        ...rest_settings,
        levels:{
          ...levels,
          [level._id]:{
            ...levels[level._id],
            set_id:null
          }
        }
      }
    }
    
    
    await window.api.request(academic_session_channel.update, updated_session_data);

    storeDispatch(updateSession(updated_session_data))
    onClose()
  }


  return (
    <Modal
      title={`${level.label} setting`}
      onClose={() => { onClose() }}
      onSave={() => { onClose() }}
      hideActionBtn={true}
    >
      <div className="table-responsive">
        <table className="table table-hover table-bordered table-md v_center">
          <thead>
            <tr>
              <th>S\N</th>
              <th>Class set</th>
              <th></th>

            </tr>
          </thead>

          <tbody>
            {
              all_sets.map((each_set, i) => {

                const shouldDisable = paired_sets.includes(each_set._id);
                const canDelete = pairedSet?._id === each_set._id;
                return (
                  <tr
                    key={i}
                    onClick={() => { 
                      if (shouldDisable) return

                      handleEngageSet(each_set)
                    }}
                    style={{ cursor: !shouldDisable ? 'pointer' : 'default' }}
                    className={shouldDisable ? 'text-muted' : ''}
                  >
                    <td>{i + 1}</td>

                    <td>
                      {each_set.label}
                    </td>

                    <td>
                      <button
                        onClick={() => {
                          // if (!canDelete) return
                          handleDisEngageSet()
                         }}
                        disabled={shouldDisable || !canDelete}
                        className={`btn btn-danger outline-danger text-center ${shouldDisable || !canDelete ? 'disabled':''}`}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                )
              })
            }


          </tbody>

        </table>
      </div>

    </Modal>
  )
});


const LevelsDisplay = React.memo(({session}) => {

  const {levels} = session.settings;
  const onGoing = !Boolean(session.date_closed);
  const all_levels = useSelector(getSettingsLevels);
  const all_sets = useSelector(getAllSets);

  const [levelInSettings, setLevelInSettings] = useState(null);

  const renderSetDetails = (set_id) => {

    // Empty Template Display
    if (!Boolean(set_id)) return(
      <>
        <p className="text-center text-muted">
          No Class Set in level
        </p>
      </>
    )

    const set_info = all_sets.find((ech)=>ech._id === set_id);

    if (!Boolean(set_info)) return (
      <>
        <p className="text-center text-muted">
          Could not load set in level
        </p>
      </>
    )


    const {stats} = set_info;


    return (
      <div>
        <div className='text-center'>
          <h3 className="lead m-0">
            {set_info.label}
          </h3>

          <p>
            {set_info.name}
          </p>

        </div>

        <div className="" style={{ width: "80%",display:'flex', alignItems:'center', justifyContent:'space-around', textAlign:'center'}}>

          <p>{stats?.admitted_male} Male{stats?.admitted_male > 1 && 's'}</p>
          

          <p>{stats?.admitted_female} Female{stats?.admitted_female > 1 && 's'}</p>
        </div>
      </div>
    )
  }


  const renderClasses = () => {
    // console.log(props.all_levels)
    let template = Object.entries(all_levels).map(([level_id, level_data]) => {

      const assignedSetId = levels[level_id]?.set_id;
      return (
        <div className="col-4" key={level_id}>
          
          <div className="card card-primary">
            
            <div className="card-header">
              
              <h4>{level_data.label}</h4>

              <div className="card-header-action">

                {
                  onGoing &&
                    (<Link
                      to={`/session/${session._id}/settings?levelId=${level_id}`}
                      onClick={(e)=>{
                        e.preventDefault();
                        setLevelInSettings(()=>{
                          return {
                            _id:level_id,
                            ...level_data,
                          }
                        })
                      }}

                      target="_blank"
                      className="btn text-primary"
                    >
                      <i className="fas fa-cog"></i>
                    </Link>)
                }

              </div>

            </div>

            <div className="card-body ">

              <div className="details">
                {renderSetDetails(assignedSetId)}
              </div>

            </div>
          </div>
        </div>
      )
    }
    );


    return template


  }

  // console.log(state);

  if (isArrayEmpty(Object.keys(levels))) return (
    <p className="text-center text-muted" style={{ width: '100%' }}>
      No School Levels<br />
      <small className='d-block'>
        You should add them in app settings
      </small>
    </p>
  )

  return (
    <>
      {
        Boolean(levelInSettings) && <LevelSetting 
          session={session} 
          level={levelInSettings} 
          all_sets={all_sets}
          onClose={()=>setLevelInSettings(null)}
        />
      }

      <div className="row" style={{ width: '100%' }}>

        {renderClasses()}


      </div>
    </>
   
  );
});


const Session = () => {
  const {sessionId} = useParams();
  const navigate = useNavigate();

  const session = useSelector((state) => getSessionById(state,sessionId));


  const session_settings = session?.settings;

  

  const renderTabs = ()=>{

    const { terms, verbose } = session_settings;

    let nextActive = true;

    return(
      <div className="row mt-4">
        <div className="col-12 col-lg-8 offset-lg-2">
          <div className="wizard-steps">

            {
              Object.entries(terms).map(([termIndex, termConfig], i)=>{
                const sup = supify(termIndex);

                const template = (
                  <>
                    <div className="wizard-step-icon">
                      <i className="fas">{termIndex}<sup>{sup}</sup></i>
                    </div>

                    <div className="wizard-step-label">
                      <b>{verbose}</b>
                    </div>
                  </>

                );

                let templateDiv;

                if(nextActive){
                  templateDiv = (
                    <div
                      className="wizard-step wizard-step-active"
                      onClick={() => navigate(`${sessionUrl}/${session._id}/${termIndex}`)}
                      style={{ cursor: 'pointer' }}
                      key={i}
                    >
                      {template}
                    </div>
                  )
                }else{
                  templateDiv = (
                    <div
                      className="wizard-step wizard-step-info"
                      key={i}
                    >
                      {template}
                    </div>
                  )
                }


                nextActive = Boolean(termConfig?.date_concluded);


                return templateDiv;



              })
            }
          </div>
        </div>
      </div>
    )
  }


  if (isObjectEmpty(session)) {
    return (
      <p className="text-muted text-center">
        Session's Meta Not Found
      </p>
    )
  }

  return (
    <>
      {renderTabs()}

      <div>

        <div className="d-flex justify-content-between align-items-center">
          <b>Levels</b>
        </div>

        <hr />

        <div className="row">
          <LevelsDisplay
            session={session}
          />
        </div>
      </div>
    </>
  )
}

export default Session