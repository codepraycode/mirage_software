import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getSessionById } from '../app/sessionSlice';
import { getAllSets } from '../app/setSlice';
import { getSettingsLevels } from '../app/settingsSlice';
import { isArrayEmpty, isObjectEmpty } from '../constants/utils';


const LevelsDisplay = ({session}) => {

  const {levels} = session.settings;
  const onGoing = !Boolean(session.date_closed);
  const all_levels = useSelector(getSettingsLevels);
  const all_sets = useSelector(getAllSets);
  

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
          <h4 className="lead m-0">
            {set_info.label}
          </h4>

          <p>
            {set_info.name}
          </p>

        </div>

        <div className="pr-5" style={{ width: "70%", margin: "2px auto" }}>
          <ul >
            <li className="d-flex align-items-center justify-content-between">
              <span>Male(s):</span>
              <span>{stats?.admitted_male}</span>
            </li>

            <li className="d-flex align-items-center justify-content-between">
              <span>Female(s):</span>
              <span>{stats?.admitted_female}</span>
            </li>


            <li className="d-flex align-items-center justify-content-between">
              <span>Total:</span>
              <span>{stats?.admitted_total}</span>
            </li>
          </ul>
        </div>
      </div>
    )
  }


  const renderClasses = () => {
    // console.log(props.all_levels)
    let template = Object.entries(all_levels).map(([level_id, level_data]) => {

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
                      onClick={(e)=>e.preventDefault()}
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
                {renderSetDetails(level_data.set_id)}
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
    <div className="row" style={{ width: '100%' }}>

      {renderClasses()}


    </div>
  );
};


const Session = () => {
  const {sessionId} = useParams();

  const session = useSelector((state) => getSessionById(state,sessionId));


  const session_settings = session?.settings;

  const supify = (n) => {

    const num = Number(n);
    if (num === 1) return 'st'
    if (num === 2) return 'nd'
    if (num === 3) return 'rd'

    return 'th'
  }

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
                      onClick={() => {}}
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