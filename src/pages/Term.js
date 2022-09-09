import React, { useState } from 'react'
import {useParams} from 'react-router-dom';
import Loading from '../widgets/Preloader/loading';
import {createField, createFormDataFromSchema, isObjectEmpty} from '../constants/utils';
import { useEffect } from 'react';
import { academic_session_channel } from '../constants/channels';
import { useSelector } from 'react-redux';
import { getSessionById } from '../app/sessionSlice';
import { NewTermFormConfig } from '../constants/form_configs';


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


const TermLobby = ({ session, termIndex, })=>{
  return(
    <p>

      Term Lobby of session ({session.label}) and term ({termIndex})

    </p>
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
      termIndex={termIndex} 
    />
  );
};

export default Term