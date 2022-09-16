import React, { useState, useEffect } from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Loading from '../widgets/Preloader/loading';
import Preloader from '../widgets/Preloader';
import Modal from '../widgets/Modal/modal';

import { createField, createFormDataFromSchema, isObjectEmpty, parseFileUrl, useQuery, getDateAge } from '../constants/utils';
import { academic_session_channel } from '../constants/channels';
import { NewTermFormConfig, SessionSettingFormConfig, SessionTermSettingFormConfig } from '../constants/form_configs';
import { avatar } from '../constants/assets';

import { getSessionById, loadSessions, updateSession } from '../app/sessionSlice';
import { getSettingsLevels } from '../app/settingsSlice';
import { getAllSets, getSetAdmittedStudents } from '../app/setSlice';
import { sessionUrl } from '../constants/app_urls';


const CreateTerm = ({ session, termIndex, onCreate })=>{

  const storeDispatch = useDispatch();

  const [termData, setTermData] = useState(() => {
    const form_ = createFormDataFromSchema(NewTermFormConfig);

    return form_
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  

  const gatherData = () => {
    // Gather Data
    let _data = {};

    for (let [field, config] of Object.entries(termData.form)) {
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

    let _form = termData.form;

    if (!Boolean(_form[field_name])) return;

    setTermData((prev) => {
      prev.form[field_name].config.value = field_value;

      return {
        ...prev,
      }
    });

  }


  const handleSubmit = (e) => {
    e.preventDefault();

    const _data = gatherData();

    const data = {
      ..._data,
      date_concluded:null,
      session_id:session._id,
      term_index: Number(termIndex),
      no_of_times_opened:0,
      next_term_begins:null
    }


    // console.log(data);

    window.api.request(academic_session_channel.createTerm, data)
    .then(async(res)=>{

      const {settings} = session;

      const {terms} = settings;

      const ses = {
        ...session,
        settings:{
          ...settings,
          terms:{
            ...terms,
            [termIndex]:{
              ...terms[termIndex],
              term_id:res._id
            }
          }
        }
      }

      // ses.settings.terms[termIndex].term_id = res._id;

      await window.api.request(academic_session_channel.update, ses);
      storeDispatch(updateSession(ses));

      onCreate(res);
    })
    .catch(err=>{
      setErr(()=>String(err.message));
      setLoading(false);
    })


    setLoading(true);


  }

  return (
    <form onSubmit={handleSubmit}>

      <div className="card mx-5">
        <div className="card-header">
          <h5>Create New Term</h5>
        </div>

        <div className="card-body">

          <p className="err-msg text-danger text-center">
            {err}
          </p>

          <div className="sessionInfo">
            {createField({ form: termData.form, groups: termData.groups }, handleInputChange)}
          </div>

        </div>

        <div className="card-footer text-center">

          {
            loading ?
              <button type="button" className="btn btn-primary mr-4 disabled" disabled>
                Loading...
              </button>
              :
              <button type="submit" className="btn btn-primary mr-4">
                Continue
              </button>
          }

        </div>
      </div>




    </form>
  )
}


const LevelSwitch = React.memo(({ title, handler, sessionId, termIndex, level_setting, levels, class_sets })=>{

  // const levels = useSelector(getSettingsLevels);
  // const class_sets = useSelector(getAllSets);

  const navigate = useNavigate();

  return(
    <Modal
      title={title}
      onClose={() => { handler()}}
      onSave={() => { handler() }}
      hideActionBtn={true}
    >
      <div className="table-responsive">
        <table className="table table-hover table-bordered table-md v_center">
          <thead>
            <tr>
              <th>S\N</th>
              <th>Level</th>
              <th>Class Set</th>

              {/* <th>Action</th> */}
            </tr>
          </thead>
          
          <tbody>
            {
              Object.entries(levels).map(([level_id, level_data], i) => {

                let class_set = {
                  level: {_id:level_id, ...level_data},
                  set:{},
                };


                const d_level_session_setting = level_setting[level_id];

                if (!isObjectEmpty(d_level_session_setting)){
                  let { set_id } = d_level_session_setting;
                  const set_data = class_sets.find((ech)=>ech._id === set_id);

                  class_set.set = set_data
                }

                const notNull = !isObjectEmpty(class_set.set);

                return (
                  <tr
                    key={i}
                    onClick={() => { 
                      if (!notNull) return
                      // handler(class_set)
                      navigate(`${sessionUrl}/${sessionId}/${termIndex}?levelId=${level_id}`,{replace:true})
                    }}
                    style={{ cursor: notNull ? 'pointer' : 'default' }}
                    className={!notNull ? 'text-muted' : ''}
                  >
                    <td>{i + 1}</td>
                    
                    <td>
                        {class_set.level.label}
                    </td>

                    <td>
                        {class_set.set?.name || '----'}
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

const SessionSettings = ({ sessionData, handleInputChange })=>{
  

  return (
    <>
      {createField({ form: sessionData.form, groups: sessionData.groups }, handleInputChange)}
    </>
  )

}

const TermSettings = ({ termData, handleInputChange }) => {

  return (
    <>
      {createField({ form: termData.form, groups: termData.groups }, handleInputChange)}
    </>
  )
}


const SessionTermSettings = ({ session, termInfo, onClose })=>{

  const [sessionData, setSessionData] = useState(() => {
    const form_ = createFormDataFromSchema(SessionSettingFormConfig);
    if (!Boolean(session)) return form_;


    for (let [field, config] of Object.entries(form_.form)) {

      if (session[field]) {

        config.config.value = session[field]
      }
    }

    return form_
  });

  const [termData, setTermData] = useState(() => {
    const form_ = createFormDataFromSchema(SessionTermSettingFormConfig);
    if (!Boolean(termInfo)) return form_;


    for (let [field, config] of Object.entries(form_.form)) {

      if (termInfo[field]) {

        config.config.value = termInfo[field]
      }
    }

    return form_
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e, side) => {

    let field_name = e.target.name;
    let field_type = e.target.type;
    let field_value = e.target.value;


    if (!['radio'].includes(field_type)) {
      e.preventDefault();
    } else {
      field_value = e.target.dataset.val;
    }


    // console.log(field_name, "changed to", field_value);
    if(side === 'term'){
      let _form = termData.form;

      if (!Boolean(_form[field_name])) return;

      setTermData((prev) => {
        if (field_type === 'number'){
          field_value = parseInt(field_value) || 0;
        }
        
        prev.form[field_name].config.value = field_value;
        return {
          ...prev,
        }
      });
    }

    else{
      let _form = sessionData.form;

      if (!Boolean(_form[field_name])) return;

      setSessionData((prev) => {
        if (field_type === 'number') {
          field_value = parseInt(field_value) || 0;
        }
        prev.form[field_name].config.value = field_value;
        return {
          ...prev,
        }
      });
    }

  }


  const gatherData = () => {
    // Gather Data from state
    let term_data = {};
    for (let [field, config] of Object.entries(termData.form)) {
      term_data[field] = config.config.value;
    }

    let session_data = {};
    for (let [field, config] of Object.entries(sessionData.form)) {
      session_data[field] = config.config.value;
    }

    return {
      term_data,
      session_data
    };
  }
  
  const handleSubmit = async() => {

    const data = gatherData();

    const {session_data, term_data} = data;

    const updated_term_data = {
      ...termInfo,
      ...term_data
    }

    let updated_session_data = {
      ...session,
      ...session_data
    }
    // console.log(updated_term_data);

    const { term_index, date_concluded } = updated_term_data
    if (Boolean(date_concluded)){
      // set the date concluded in session settings
      try{
        // updated_session_data.settings.terms[term_index].date_concluded = date_concluded;

        const { settings, ...rest_up_dt } = updated_session_data;
        const {terms,...rst_st} = settings;

        const prev_trm = terms[term_index];

        updated_session_data = {
          ...rest_up_dt,
          settings:{
            ...rst_st,
            terms:{
              ...terms,
              [term_index]:{
                ...prev_trm,
                date_concluded
              }
            }
          }
        }
      }catch(err){
        console.error(err);
      }
      
    }

    await window.api.request(academic_session_channel.update, updated_session_data);

    await window.api.request(academic_session_channel.updateTerm, updated_term_data);


    onClose({ term: updated_term_data, session: updated_session_data });
  }

  return (
    <Modal
      title={"Term Settings"}
      onClose={() => { onClose() }}
      onSave={() => { handleSubmit() }}
      loading={loading}
    >
      <form onSubmit={(e)=>e.preventDefault()}>
        <h4 className='text-muted'>Session setting</h4>
        <SessionSettings sessionData={sessionData} handleInputChange={(e) => handleInputChange(e, 'session')}/>
        <hr/>
        <br/>
        <h4 className='text-muted'>Term setting</h4>
        <TermSettings termData={termData} handleInputChange={(e) => handleInputChange(e, 'term')} />
      </form>

    </Modal>
  );
}

const ClassStats = React.memo(({stats}) =>{
  
  return(
    <div className="row text-center">
      <div className="col-lg-4 col-md-4 col-sm-6 col-12">
        <div className="card card-statistic-1">
          <div className="card-icon bg-primary">
            <i className="fas fa-users-class    "></i>
          </div>
          <div className="card-wrap">
            <div className="card-header">
              <h4>Total Students</h4>
            </div>
            <div className="card-body">
              {stats?.admitted_total}
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-4 col-md-4 col-sm-6 col-12">
        <div className="card card-statistic-1">
          <div className="card-icon bg-danger">
            <i className="fas fa-male    "></i>
          </div>
          <div className="card-wrap">
            <div className="card-header">
              <h4>Male</h4>
            </div>
            <div className="card-body">
              {stats?.admitted_male}
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-4 col-md-4 col-sm-6 col-12">
        <div className="card card-statistic-1">
          <div className="card-icon bg-warning">
            <i className="fas fa-female" aria-hidden="true"></i>
          </div>
          <div className="card-wrap">
            <div className="card-header">
              <h4>Female</h4>
            </div>
            <div className="card-body">
              {stats?.admitted_female}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})


const ClassStudentItem = React.memo(({index, student, level_data, term_data, link}) =>{
  const [termRecord, setTermRecord] = useState(null);

  const [loading, setLoading] = useState(true);

  const getLastUpdated = ()=>{
    // console.log(termRecord);
    if(isObjectEmpty(termRecord)) return '----'

    return getDateAge(termRecord.updatedAt);
  }

  const loadStudentTermReport = async ()=>{

    const query = {
      term_id: term_data._id,
      student_id: student._id,
      level_id: level_data._id
    }

    // console.log(query);

    const doc = await window.api.request(academic_session_channel.getTermRecord, query)

    setTermRecord(()=>doc);
    setLoading(false);
  }



  useEffect(()=>{
    loadStudentTermReport();
  },[])

  return (
    <tr>
      <td className="p-0 text-center">
        {index}
      </td>

      <td className="align-middle">
        <img

          alt="passport"
          src={parseFileUrl(student.passport) || avatar}//{profile.logo}
          
          onError={
            ({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = avatar;
            }
          }
          className="rounded-circle mr-3"
          width="35"

        />
        {student.first_name} {student.last_name}
      </td>

      <td>
        {level_data.label}
      </td>

      <td>
        {getLastUpdated()}
      </td>

      <td >
        <Link
          to={`${sessionUrl}/${term_data.session_id}/${term_data.term_index}/${student._id}`}
          onClick={()=>{}}
          className="btn btn-warning outline-warning text-center"
        >
          <i className="fa fa-pencil" aria-hidden="true"></i>
        </Link>

        <Link
          className={`btn ${!Boolean(termRecord) ? 'btn-outline-light disabled' : 'btn-outline-success'}`}
          target="_blank"
          to={`${sessionUrl}/${term_data._id}/${level_data._id}/${student._id}/report`}
          onClick={(e)=>{
            
            if (!Boolean(termRecord)) {
              e.preventDefault();
            }
            
          }}
        >
          {
            loading ?
              <Preloader type="spinner" />
              :
              <i className="fa fa-print" aria-hidden="true"></i>
          }

        </Link>

      </td>

    </tr>
  );
});

const ClassStudents = ({level,set, term})=>{
  const students = useSelector((state) => getSetAdmittedStudents(state, set._id));

  const { stats } = set;

  return (
    <>
      <ClassStats stats={stats} />

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              
              <h4>{level.label} Students</h4>
              
            </div>

            <div className="card-body p-0 text-center">
              <div className="table-responsive">
                <table className="table table-striped v_center">
                  <thead>
                    <tr>
                      <th>
                        S/N
                      </th>
                      {/* <th>Admission No</th> */}
                      <th>Student</th>
                      <th>Class</th>

                      <th>Last updated</th>
                      <th>Actions</th>

                    </tr>
                  </thead>

                  <tbody>

                    {
                      students.map((student,i)=>{
                        return (
                          <ClassStudentItem 
                            student={student}
                            key={student._id}
                            index={i+1}
                            level_data={level}
                            term_data={term}
                          />
                        )
                      })
                    }

                  </tbody>
                </table>
              </div>


            </div>

          </div>
        </div>
      </div>

    </>
  )

}

const TermLobby = ({ session, termData, termIndex, reload })=>{

  const query = useQuery();
  let focus = query.get('levelId'); // set focus from url
  let slt = query.get('slt'); // set focus from url


  const navigate = useNavigate();

  const levels = useSelector(getSettingsLevels);
  const class_sets = useSelector(getAllSets);

  const [loading, setLoading] = useState(true);
  const [levelFocused, setLevelFocused] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  // const [showLevelSwitcher, setShowLevelSwitcher] = useState(false);


  const {levels:session_levels} = session.settings;

  
  const loadUp = ()=>{

    // 
    // console.log(focus);
    if (!loading) return
    if (!Boolean(focus)) return;
    

    const level_data = levels[focus];

    let class_set = {
      level: {_id:focus, ...level_data},
      set: {},
    };


    const d_level_session_setting = session_levels[focus];

    if (!isObjectEmpty(d_level_session_setting)) {
      let { set_id } = d_level_session_setting;
      const set_data = class_sets.find((ech) => ech._id === set_id);

      class_set.set = set_data

      setLevelFocused(() => class_set);
    }

    setLoading(false);
    

  }

  useEffect(()=>{
    loadUp();
  },)
  
  return(
    <>

      {
        ((Boolean(slt) && !Boolean(levelFocused))) && <LevelSwitch
          title="Select class level"
          sessionId={session._id}
          termIndex={termIndex}
          handler={(set_data=null) => {
            // setLevelFocused(() => set_data);
            navigate(`${sessionUrl}/${session._id}/${termIndex}`, { replace: true })
          }}
          level_setting={session_levels}
          levels ={levels}
          class_sets={class_sets}
      />}


      {
        showSettings && (<SessionTermSettings 
          session={session} 
          termInfo={termData}
          onClose={() => {
            setShowSettings(false)
            reload()
          }}
        />)
      }


      <div 
        style={
          { display: "flex", 
            alignItem: 'center', 
            justifyContent: 'space-between' }
        }
      >

        <h6>
          {session.label}
        </h6>

        <h6 style={{ cursor: "pointer" }} onClick={() => setShowSettings(true)}>
          <b>{termData.label}</b>
        </h6>

        <div className="cta">

          <button
            className="btn btn-primary"
            onClick={() => {
              
              setLevelFocused(null)
              setLoading(true);
              navigate(`${sessionUrl}/${session._id}/${termIndex}?slt=${true}`, { replace: true })
              
             }}
          >
            <i className="fa fa-cog mr-2" aria-hidden="true"></i>
            {!Boolean(levelFocused) ? 'Select' : 'Switch'}  Class Level
          </button>

        </div>
      </div>


      <br /><br />

      <>
        {
          !Boolean(levelFocused) ?
            <p className="text-center text-muted">
              Select a class level
            </p>
            :
            <ClassStudents {...levelFocused} term={termData}/>
        }
      </>
    </>
  )
};


const Term = () => {

  const { sessionId, termIndex } = useParams();

  const session = useSelector((state) => getSessionById(state, sessionId));


  const [loading, setLoading] = useState(true);
  const [termData, setTermData] = useState(null);

  const storeDispatch = useDispatch();


  const loadUp = async ()=>{

    if(!loading) return;

    if (isObjectEmpty(termData) && loading) {
      // Load term data
      const data = await window.api.request(academic_session_channel.queryTerm, {term_index: Number(termIndex), session_id:sessionId})
      setTermData(()=>data);
    }

    setLoading(false)
  }


  const reload = async() =>{
    const data = await window.api.request(academic_session_channel.queryTerm, { term_index: Number(termIndex), session_id: sessionId })
    setTermData(() => data);
    storeDispatch(loadSessions())
  }


  useEffect(()=>{
    loadUp()
  }, [loading, termData])

  if(loading){
    return <Loading/>
  }


  if (isObjectEmpty(termData)){
    return <CreateTerm 
      session={session} 
      termIndex={termIndex} 
      onCreate={(term_data)=> setTermData(()=>term_data)}
    />
  }



  return (
    <TermLobby
      session={session}
      termData={termData}
      termIndex={termIndex}
      reload={() => reload()}
    />
  );
};

export default Term