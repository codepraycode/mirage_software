import React, { useState, useEffect } from 'react'
import {Link, useParams} from 'react-router-dom';
import { useSelector } from 'react-redux';

import Loading from '../widgets/Preloader/loading';
import Modal from '../widgets/Modal/modal';

import {createField, createFormDataFromSchema, isObjectEmpty, parseFileUrl, useQuery} from '../constants/utils';
import { academic_session_channel } from '../constants/channels';
import { NewTermFormConfig } from '../constants/form_configs';
import { avatar } from '../constants/assets';

import { getSessionById } from '../app/sessionSlice';
import { getSettingsLevels } from '../app/settingsSlice';
import { getAllSets, getSetAdmittedStudents } from '../app/setSlice';


const CreateTerm = ({ session, termIndex, onCreate })=>{


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
    .then((res)=>{
        onCreate(res);
    })
    .catch(err=>{
      setErr(()=>err);
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


const LevelSwitch = React.memo(({title, handler, level_setting})=>{

  const levels = useSelector(getSettingsLevels);
  const class_sets = useSelector(getAllSets);

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
                  level: level_data,
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
                      handler(class_set)
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


const ClassStudentItem = ({index, student, level_data, term_data}) =>{
  const termRecord = null;

  const [loading, setLoading] = useState(false);

  const getLastUpdated = ()=>{
    return '----'
  }

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
          to={`/session/${term_data.session_id}/${term_data.term_index}/${student._id}`}
          onClick={()=>{}}
          className="btn btn-warning outline-warning text-center"
        >
          <i className="fa fa-pencil" aria-hidden="true"></i>
        </Link>

        <Link
          className={`btn ${!Boolean(termRecord) ? 'btn-outline-light disabled' : 'btn-outline-success'}`}
          target="_blank"
          to={() => { }}
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
}

const ClassStudents = ({level,set, term})=>{
  const students = useSelector((state) => getSetAdmittedStudents(state, set._id));

  const [processing, setProcessing] = useState(false);


  const processReports = ()=>{};

  const { stats } = set;

  return (
    <>
      <ClassStats stats={stats} />

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              
              <h4>{level.label} Students</h4>

              <div className="card-header-form">

                {/* <button
                  className={`btn btn-primary disabled`}
                  disabled={term_info === null}
                  onClick={() => { }} //downloadBroadsheet()}}
                >
                  Get Broadsheet
                </button> */}

                <form className="form-inline">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="search by name, or admission number"
                    onChange={()=>{}}
                  />
                  <button type="button" className="btn btn-primary">
                    {/* <i className="fa fa-search" aria-hidden="true"></i> */}
                    <i className="fas fa-filter"></i>
                  </button>
                </form>

                <button
                  className={`btn btn-primary ${processing ? "disabled" : ''}`}
                  disabled={processing}
                  onClick={() => processReports()}
                >
                  {
                    processing ?
                      <>
                        Processing
                        <Preloader type="spinner" className='ml-3' />
                      </>

                      :
                      "Process reports"
                  }
                </button>

              </div>

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

const TermLobby = ({ session, termData, })=>{

  const query = useQuery();
  let focus = query.get('level'); // set focus from url

  

  const [loading, setLoading] = useState(false);
  const [levelFocused, setLevelFocused] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showLevelSwitcher, setShowLevelSwitcher] = useState(false);


  const {levels} = session.settings;

  
  return(
    <>

      {
        (showLevelSwitcher && !Boolean(levelFocused)) && <LevelSwitch
          title="Select class level"
          handler={(set_data=null) => {
            setLevelFocused(() => set_data);
            setShowLevelSwitcher(false);
          }}
          level_setting={levels}
      />}


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

        <h6 style={{ cursor: "pointer" }} onClick={() => { }}>
          <b>{termData.label}</b>
        </h6>

        <div className="cta">

          <button
            className="btn btn-primary"
            onClick={() => {
              setLevelFocused(null)
              setShowLevelSwitcher(true)
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


  const loadUp = async ()=>{

    if(!loading) return;

    if (isObjectEmpty(termData) && loading) {
      // Load term data
      const data = await window.api.request(academic_session_channel.queryTerm, {term_index: Number(termIndex)})
      setTermData(()=>data);
    }

    setLoading(false)
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
    />
  );
};

export default Term