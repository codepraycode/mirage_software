import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { getSessionById } from '../app/sessionSlice';
import { getSetAdmittedStudent } from '../app/setSlice';
import { getSettingsAttrs, getSettingsLevelById, getSettingsLevels, getSettingsStaffs, getSettingsSubjects } from '../app/settingsSlice';
import { avatar } from '../constants/assets';
import { academic_session_channel } from '../constants/channels';
import { capitalize, isArrayEmpty, isObjectEmpty, parseFileUrl, supify } from '../constants/utils';
import Modal from '../widgets/Modal/modal';
import Loading from '../widgets/Preloader/loading';
import Spinner from '../widgets/Preloader/spinner';


const StudentPreview = ({ student, level_id })=>{

  const levelInfo = useSelector((state)=>getSettingsLevelById(state, level_id));

  if (isObjectEmpty(student)){
    return (
      <div className="profile-detail">
        <div className=" " style={{ height: '150px' }}>
          <img
            alt={`-- no student --`}

            className="img-responsive"
            src={avatar}//{profile.logo}
            onError={
              ({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = avatar;
              }
            }

            style={{ height: '100%', width: 'auto', borderRadius: '12px' }}
          />
        </div>


        <p className="full-name">
          <b>
            Student data not found
          </b>
        </p>

        <p className="level">
          ---------
        </p>
      </div>
    )
  }


  return(
    <div className="info">
      
      <div className="card profile text-center">
        <p className="lead">Profile</p>


        <div className="profile-detail">
          <div className=" " style={{ height: '150px' }}> {/* avatar avatar-profile */}
            <img
              alt={`${student?.first_name}'s Passport`}

              className="img-responsive img-fluid"
              src={parseFileUrl(student?.passport) || avatar}//{profile.logo}
              onError={
                ({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = avatar;
                }
              }

              style={{ height: '100%', width: 'auto', borderRadius: '12px' }}
            />
          </div>

          <p className="full-name">
            <b>
              {student?.first_name} {student?.last_name} {student?.other_name.at(0).toUpperCase()}.
            </b>
          </p>

          <div className="level">
            {
              levelInfo.label
            }
          </div>
        </div>
      </div>

    </div>
 
  )

}


const MetaRecords = ({ requestData, updateData, termInfo})=>{
  // Attendance

  const {no_of_times_opened} = termInfo;

  const [data, setData] = useState(()=>{

    const preData = requestData('attendance') || {};

    return {
      no_of_times_present: preData['no_of_times_present'] || 0,
      no_of_times_absent: preData['no_of_times_absent'] || 0,
      no_of_times_opened:no_of_times_opened || 0,
    }
    
  });

  const [loading, setLoading] = useState(false);

  const [noOfChanges, setNoOfChanges] = useState(0);

  const anyChanges = noOfChanges > 0;


  const handleSave = async ()=>{

    // Update term data setting for number of times opened

    const { no_of_times_present, no_of_times_absent } = data;

    const updating_data = {
      attendance:{
        no_of_times_present,
        no_of_times_absent,
      }
    }

    await updateData(updating_data);
    setNoOfChanges(0);
  }

  const handleInputChange = (e) => {
    
    // Modifying state's term data;
    let field_name = e.target.name;
    let field_value = parseInt(e.target.value);

    
    // console.log(data[field_name], field_name, field_value);
    if(!Object.keys(data).includes(field_name)) return
    
    // Data entered is expected to be number of times present

    setData((prev)=>{

      if (Object.is(field_name, 'no_of_times_opened')){
        prev.no_of_times_opened =  field_value > 0 ? field_value : 0;
      }
      else{
        if (parseInt(field_value) > prev.no_of_times_opened) {
          prev.no_of_times_present = prev.no_of_times_opened;
        } else {
          prev.no_of_times_present = field_value
        }

        prev.no_of_times_absent = parseInt(prev.no_of_times_opened) - parseInt(prev.no_of_times_present);

        if (prev.no_of_times_absent < 0) {
          prev.no_of_times_absent = 0;
        }
      }

      return{
        ...prev
      }
    });


    setNoOfChanges((pp) => {

      if (Object.is(data.no_of_times_present[field_name], field_value)) {
        if (pp === 0) return 0;
        return pp - 1;
      }

      return pp + 1;
    })

  }


  const renderContent = ()=>{
    return (
      <>
        <div className="form-row">

          <div className="form-group col">
            <small><b>Term began</b></small>
            {
              termInfo.date_started ?

                <input
                  type="date"
                  className="form-control"
                  value={termInfo.date_started}
                  readOnly
                />
                :
                <input
                  type="text"
                  className="form-control"
                  value="---Not yet set----"
                  readOnly
                />
            }
          </div>

          <div className="form-group col">
            <small><b>Term Ended</b></small>
            {
              termInfo.date_concluded ?

                <input
                  type="date"
                  className="form-control"
                  value={termInfo.date_concluded}
                  readOnly
                />
                :
                <input
                  type="text"
                  className="form-control"
                  value="---Not yet set----"
                  readOnly
                />
            }
          </div>

          <div className="form-group col">
            <small><b>Next Term Begins</b></small>

            {
              termInfo.next_term_begins ?

                <input
                  type="date"
                  className="form-control"
                  value={termInfo.next_term_begins}
                  readOnly
                />
                :
                <input
                  type="text"
                  className="form-control"
                  value="---Not yet set----"
                  readOnly
                />
            }
          </div>

        </div>

        <div className="form-row">

          <div className="form-group col">
            <small><b>School Opens</b></small>
            <input
              type="number"
              className="form-control"
              min={0}
              value={
                data.no_of_times_opened || 0
              }
              name='no_of_times_opened'
              onChange={(e)=>handleInputChange(e)}
            />
          </div>

          <div className="form-group col">
            <small><b>Number of time Present</b></small>
            <input
              type="number"
              className="form-control"
              min={0}
              value={
                data.no_of_times_present || 0
              }
              name='no_of_times_present'
              onChange={handleInputChange}
              disabled={!Boolean(data.no_of_times_opened) || data.no_of_times_opened < 1}

            />
          </div>

          <div className="form-group col">
            <small><b>Number of time Absent</b></small>
            <input
              type="number"
              className="form-control"
              name='no_of_times_absent'
              min={0}
              value={
                data.no_of_times_absent || 0
              }
              onChange={handleInputChange}
              disabled={true}
            />
          </div>

        </div>
      </>
    )
  }

  const renderCTA = () => {

    if (loading) {
      return (
        <button
          className="btn btn-primary btn-icon"
          // onClick={() => handleSubmit()}
          disabled={true}
        >
          <Spinner />
          <span className='mr-3'>Saving...</span>
          
        </button>
      )
    }

    if (anyChanges) {
      return (
        <button
          className="btn btn-primary"
          onClick={() => handleSave()}
        >
          <span className=''>Save</span>
        </button>
      )
    }
    
  }

  return (
    <div className="card">
      <div className="card-header">
        <h4 className='mr-auto'>Meta Records</h4>


        <div className="card-header-action">
          {
            renderCTA()
          }
        </div>

      </div>


      <div className="card-body">

        {renderContent()}

      </div>
    </div>
  );

}

const SelectStaffModal = ({staffs, onSelected, onClose})=>{
  
  const renderModalContent = () => {


    if (isArrayEmpty(staffs)) {
      return <p className="text-center text-muted">
        No Staffs Available
      </p>
    }



    // teachers
    let template = (
      <div className="table-responsive">
        <table className="table table-hover table-bordered table-md v_center">
          <thead>
            <tr>
              <th></th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {
              staffs.map((staff, i) => {

                return (
                  <tr
                    key={staff._id}
                    onClick={() => { onSelected(staff)}}
                    style={{ cursor: 'pointer' }}
                  // className={!class_set.can_include ? 'text-muted':''}
                  >
                    <td>
                      <img
                        alt="log"

                        src={parseFileUrl(staff.passport) || avatar}//{profile.logo}
                        onError={
                          ({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src = avatar;
                          }
                        }
                        className="rounded-circle"
                        width="35"
                        data-toggle="tooltip"
                        title={`${staff.first_name}'s passport`}
                      />
                    </td>
                    <td>{staff.title} {staff.first_name} {staff.last_name}</td>

                    {/* <td><a href="#" className="btn btn-secondary">Detail</a></td> */}
                  </tr>
                )
              })
            }


          </tbody>
        </table>
      </div>
    )

    return template;

  }

  return (
    <Modal
      title={`Select Teacher`}
      onClose={() => { onClose()}}
      // onSave={()=>{handleModal()}}
      hideActionBtn={true}
    >
      {renderModalContent()}
    </Modal>
  )
}

const AcademicRecord = (props)=>{
  const { requestData, updateData, all_staffs, level_id } = props;
  
  const all_levels = useSelector(getSettingsLevels);
  const all_subjects = useSelector(getSettingsSubjects);

  const student_level = all_levels[level_id];
  const {subjects} = student_level;
  

  const [loading, setLoading] = useState(false);
  const [noOfChanges, setNoOfChanges] = useState(0);
  const [subjectData, setSubjectData] = useState(()=>{
    
    const preData = requestData('subjects') || {};

    const sbdt = {};
    

    subjects.forEach((subj_id)=>{
      const preSub = preData[subj_id] || {};

      const subj_data = all_subjects[subj_id];
      // const {name, total_obtainable, required} = subj_data;

      sbdt[subj_id] = { ca: null, exam: null, teacher: null, ...subj_data, ...preSub, }
    });


    return sbdt;
  });
  const [subjectTeacherSelectId, setSubjectTeacherSelectId] = useState(null);


  const anyChanges = noOfChanges > 0;


  const handleSave = async () => {
    // console.log(subjectData);

    const updating_data = {
      subjects:{
        // ...subjectData
      }
    }

    Object.entries(subjectData).forEach(([id, dat])=>{
      const isCa = Boolean(dat.ca);
      const isExam = Boolean(dat.exam);


      if (!isCa && !isExam) return

      else if(isCa && !isExam){
        dat.exam = 0;
      }

      else if (!isCa && isExam) {
        dat.ca = 0;
      }

      updating_data.subjects[id] = {
        ...dat,
      }

    })

    await updateData(updating_data);
    setNoOfChanges(0);
  }


  const handleInputChange = (e)=>{
    let val = e.target.value;
    const subject_id = e.target.id;
    const which = e.target.dataset.which;

    let max_score = e.target.dataset.max || 100;
    let min_score = e.target.dataset.min || 0;


    if (!Boolean(subjectData[subject_id])) return;

    if(isNaN(val))  return

    
    if(val === ''){
      val = null;
    }else{
      val = parseInt(val);
      if (val > max_score) {
        val = max_score
      } else if (val < min_score) {
        val = min_score
      }
    }


    // console.log(which, subject_id, val);
    setSubjectData((prev)=>{


      switch (which) {
        case 'ca':
          prev[subject_id]['ca'] = val;
          break
        case 'exam':
          prev[subject_id]['exam'] = val;
          break

        default:
          break
      }


      


      return {...prev};
    })

    setNoOfChanges((pp) => {

      // if (Object.is(subjectData[subject_id][which], val)) {
      //   if (pp === 0) return 0;
      //   return pp - 1;
      // }

      return pp + 1;
    })

    
  }

  const renderSubjectTeacher = (subject_id ) => {

    const {teacher} = subjectData[subject_id];

    let subject_teacher = all_staffs.find((est) => est._id === teacher?._id);


    return (
      <>

        {
          isObjectEmpty(subject_teacher)?
          <p>
              No Subject Teacher
          </p>
         :
          <div className="d-flex align-items-center">
            <img
              src={parseFileUrl(subject_teacher.passport) || avatar}
              onError={
                ({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = avatar;
                }
              }
              alt={`${subject_teacher.first_name}'s passport`}
              className=" mr-3 rounded-circle"
              width="50"
            />

            <div className="media-body">
              <div className="media-title">
                {subject_teacher.title} {subject_teacher.first_name} {subject_teacher.last_name}
              </div>
              <div className="text-job text-muted">{subject_teacher.highest_qualification}</div>
            </div>
          </div>
        }

        <p className='d-flex align-items-center'>
          <small className="text-muted">
            {"Subject teacher"}
          </small>

          <span className="text-job ml-3 text-primary">
            <i
              className="fas fa-cog"
              style={{ cursor: "pointer" }}
              onClick={() => setSubjectTeacherSelectId(subject_id)}
            ></i>
          </span>

        </p>
      </>
    )
  }

  const renderSubjects = () => {

    if (isObjectEmpty(subjectData)) {
      return (
        <div className="text-center text-muted">
          <p>No Subjects Available</p>
          {/* <span>Consider Adding Subjects in Settings</span> */}
        </div>
      )
    }


    let template = Object.entries(subjectData).map(([subject_id, subject_data]) => {
      // console.log(item);
      return (

        <div key={subject_id}>
          <span className="list-group-item list-group-item-action flex-column align-items-start">

            <div className="d-flex w-100 justify-content-between">
              <h6 className="mb-1">{subject_data.name}</h6>
            </div>

            <div className='my-2 d-flex align-items-center justify-content-around'>
              <div className="form-group">
                <label>CA</label>

                <input
                  type="text"
                  data-min={0}
                  data-max={40}
                  id={subject_id}
                  data-which={'ca'}
                  className="form-control"
                  placeholder="40%"
                  value={subjectData[subject_id].ca || ''}
                  onChange={handleInputChange}
                />

              </div>

              <div className="form-group">
                <label>Exam</label>
                <input
                  type="text"
                  data-min={0}
                  data-max={60}
                  id={subject_id}
                  data-which={'exam'}
                  className="form-control"
                  placeholder="60%"
                  value={subjectData[subject_id].exam || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <hr />

            <div className="media d-flex align-items-center justify-content-between">
              {renderSubjectTeacher(subject_id)}

            </div>



          </span>

          
          <br />
        </div>
      )
    });

    return template;
  }

  const renderCTA = () => {

    if (loading) {
      return (
        <button
          className="btn btn-primary btn-icon"
          // onClick={() => handleSubmit()}
          disabled={true}
        >
          <Spinner />
          <span className='mr-3'>Saving...</span>

        </button>
      )
    }

    if (anyChanges) {
      return (
        <button
          className="btn btn-primary"
          onClick={() => handleSave()}
        >
          <span className=''>Save</span>
        </button>
      )
    }

  }


  const renderSelectTeacherModal = ()=>{
    if (!Boolean(subjectTeacherSelectId)) return

    // get the subject staffs
    const {staffs} = subjectData[subjectTeacherSelectId];

    
    const staffs_data = all_staffs.filter((est) => staffs.includes(est._id));
    
    

    return <SelectStaffModal 
      staffs={staffs_data} 
      onClose={() => setSubjectTeacherSelectId(null)}
      onSelected={(staff_data=null) => {

        // Saving staff data, since the staff can be deleted in settings

        const {_id, first_name, last_name, title, passport, contacts, email} = staff_data;

        setSubjectData((prev)=>{
          prev[subjectTeacherSelectId].teacher = { 
            _id, 
            first_name, 
            last_name, 
            title, 
            passport, 
            contacts, 
            email 
          }

          return {...prev};
        })

        setSubjectTeacherSelectId(null);
        setNoOfChanges((pp)=>pp+1);
      }}
    />
  }
  


  return(
    <>
      {renderSelectTeacherModal()}

      <div className="card">
        <div className="card-header">
          <h4 className='mr-auto'>Academic Records</h4>

          {
            renderCTA()
          }
        </div>

        <div className="card-body">
          {renderSubjects()}
        </div>
      </div>
    </>
  )

}


const AttrRecord = ({ requestData, updateData })=>{
  const attrs_settings = useSelector(getSettingsAttrs);

  const { keys, mappings } = attrs_settings;

  const [attrData, setAttrData] = useState(()=>{
    let _data = {};
    
    const preData = requestData('attr') || {};

    keys.forEach((eky)=>{
      _data[eky._id] = preData[eky._id] || null;
    })

    return _data;
  });

  const [loading, setLoading] = useState(false);
  const [noOfChanges, setNoOfChanges] = useState(0);

  const anyChanges = noOfChanges > 0;

  const handleSelection = (key_id, point) => {

    
    if (!Object.keys(attrData).includes(key_id)) return

    setAttrData((prev)=>{

      prev[key_id] = point;
      return {...prev}
    });
    setNoOfChanges((pp) => {
      return pp + 1;
    })
  }

  const handleSave = async ()=>{

    const updating_data = {
      attr:{}
    }


    Object.entries(attrData).forEach(([id, dat]) => {


      if (!dat) return

      updating_data.attr[id] = dat;

    })

    await updateData(updating_data);
    setNoOfChanges(0);
  }

  const checkIsSelected = (key_id, point) => {

    let res = false;

    for (let id in attrData) {
      let val = attrData[id]
      if (id === key_id && parseInt(point) === parseInt(val)) {
        res = true
        break;
      }
    }


    return res
  }

  const renderCTA = () => {

    if (loading) {
      return (
        <button
          className="btn btn-primary btn-icon"
          // onClick={() => handleSubmit()}
          disabled={true}
        >
          <Spinner />
          <span className='mr-3'>Saving...</span>

        </button>
      )
    }

    if (anyChanges) {
      return (
        <button
          className="btn btn-primary"
          onClick={() => handleSave()}
        >
          <span className=''>Save</span>
        </button>
      )
    }

  }


  const renderContent = ()=>{
    
    if(isArrayEmpty(keys) || isArrayEmpty(mappings)){
      return (
        <div className="text-center text-muted">

          <p> No Skill/Behaviour scalings</p>

          <br />

          <span>Consider adding Scalings in <b>App Session Settings </b></span>

        </div>
      )
    }



    return keys.map((key_item)=>{
      return (
        <div key={key_item._id} className="record-flex">
          
          <p className="mt-0 mr-5">{key_item.value}</p>

          <div className="form-group">

            <div className="text-balls">
              {
                mappings.map((mapping_item) => {
                  return (
                    <span
                      key={mapping_item._id}
                      onClick={() => { handleSelection(key_item._id, mapping_item.point) }}
                      style={{ cursor: "pointer" }}
                      className={checkIsSelected(key_item._id, mapping_item.point) ? 'checked' : ''}
                    >


                      <b>{mapping_item.point}</b>


                    </span>
                  )
                })
              }

            </div>
          </div>
        </div>
      )
    })

  }



  return (
    <div className="card">
      <div className="card-header">
        <h4 className='mr-auto'>Skill and Behavioural Attributes</h4>

        {
          renderCTA()
        }
      </div>

      <div className="card-body">
        {renderContent()}
      </div>
    </div>


  );


}

const StaffRemarks = ({ session_setting, level_id, all_staffs, requestData, updateData })=>{

  const {roles} = session_setting;

  const {school_head, level_roles} = roles;

  

  const [remarkData, setRemarkData] = useState(()=>{

    const level_role = level_roles?.find(elv => elv.level_id === level_id);
    const preData = requestData('remarks') || {};

    let _data = {
      school_head:{
        ...school_head,
        staff:null,
      },
      level_head: {
        ...level_role,
        staff:null
      },

      ...preData,
    }

    if (Boolean(school_head.staff_id) && !Boolean(_data.school_head.staff)) {
      const head_staff_data = all_staffs.find((esf) => esf._id === school_head.staff_id);

      if (!isObjectEmpty(head_staff_data)) {

        let { _id, first_name, last_name, title, passport, contacts, email } = head_staff_data;

        _data.school_head['staff'] = {
          _id,
          first_name,
          last_name,
          title,
          passport,
          contacts,
          email
        }

      }
    }


    if (Boolean(_data.level_head?.staff_id) && !Boolean(_data.level_head.staff)){
      const staff_data = all_staffs.find((esf) => esf._id === _data.level_head.staff_id);

      if (!isObjectEmpty(staff_data)) {

        let { _id, first_name, last_name, title, passport, contacts, email } = staff_data;

        _data.level_head['staff'] = {
          _id,
          first_name,
          last_name,
          title,
          passport,
          contacts,
          email
        }

      }
    }

    return _data;

  })

  const [loading, setLoading] = useState(false);
  const [noOfChanges, setNoOfChanges] = useState(0);

  const anyChanges = noOfChanges > 0;


  const handleInputChange = (e) => {

    e.preventDefault();

    const side = e.target.id
    if (!Boolean(remarkData[side])) return

    // console.log(remarks);

    setRemarkData((prev)=>{
      prev[side].remark = e.target.value;

      return {...prev}
    });

    setNoOfChanges((pp)=>pp+1);
  }

  const renderCTA = () => {

    if (loading) {
      return (
        <button
          className="btn btn-primary btn-icon"
          // onClick={() => handleSubmit()}
          disabled={true}
        >
          <Spinner />
          <span className='mr-3'>Saving...</span>

        </button>
      )
    }

    if (anyChanges) {
      return (
        <button
          className="btn btn-primary"
          onClick={() => handleSave()}
        >
          <span className=''>Save</span>
        </button>
      )
    }

  }

  const renderStaffRemark = (side)=>{
    const {staff, label, remark} = remarkData[side];

    if (isObjectEmpty(staff)) {
      return (
        <div className="text-center text-muted">
          <p>No staff assigned to level</p>
        </div>
      )
    }

    return (
      <div>

        <div className="row">

          <div className="col-9">
            <div className="d-flex align-items-center justify-content-between">

              <small>
                <b className="mt-0 mb-2">{capitalize(label)}</b>
              </small>
            </div>

            <textarea
              cols="20"
              rows="10"
              className="form-control"
              id={side}
              value={remark || ''}
              onChange={handleInputChange}
            />

            <i className="mt-0">
              {capitalize(staff.title)} {capitalize(staff.last_name)} {capitalize(staff.first_name)}
            </i>

          </div>

          <div className="col-3"></div>
        </div>
      </div>
    )
  }

  const handleSave = async () => {
    // console.log(remarkData);

    const updating_data = {
      remarks: {
        ...remarkData
      }
    }

    await updateData(updating_data);
    setNoOfChanges(0);
  }


  return (
    <div className="card">
      <div className="card-header">
        <h4 className='mr-auto'>Remarks</h4>


        {
          renderCTA()
        }
      </div>

      <div className="card-body">
        {
          isObjectEmpty(remarkData.school_head)?
            <div className="text-center text-muted">
              <p>School administrator role available</p>
            </div>
            :
            renderStaffRemark('school_head')
        }

        {
          isObjectEmpty(remarkData.level_head) ?
            <div className="text-center text-muted">
              <p>Level staff role available</p>
            </div>
            :
            renderStaffRemark('level_head')
        }
      </div>
    </div>
  );

}


const StudentRecord = () => {
  const { studentId, termIndex, sessionId } = useParams();

  const all_staffs = useSelector(getSettingsStaffs);
  
  const session = useSelector((state)=>getSessionById(state, sessionId));
  const student = useSelector((state) => getSetAdmittedStudent(state, studentId));


  const {settings} = session;

  let student_level_id = '';


  for (let el in settings.levels){
    
    const lvl = settings.levels[el];

    if (lvl.set_id === student?.set_id){
      student_level_id = el;
      break;
    }
  }

  const [termInfo, setTermInfo] = useState(null); // load term
  const [termRecord, setTermRecord] = useState(null); // load term
  
  const [loading, setLoading] = useState(true);


  const handleComponentSumbit = async(section_data)=>{
    let updating_data = {
      ...termRecord,
      ...section_data,
      term_id: termInfo._id,
      student_id: studentId,
      level_id: student_level_id,
    }

    

    if(!Boolean(termRecord._id)){
      // create
      const res = await window.api.request(academic_session_channel.createTermRecord, updating_data);

      updating_data = {
        ...updating_data,
        ...res,
        
      }
    }else{
      // update
      await window.api.request(academic_session_channel.updateTermRecord, updating_data);
    }

    
    setTermRecord(()=>{
      return updating_data
    })
  }

  const requestComponentData = (section)=>{
    return termRecord[section] || {}
  }

  const renderComponents = ()=>{
    const sup = supify(termIndex);
    const verbose = settings?.verbose;
    return (
      <>
          <div className="row align-items-center mb-3">
            <div className="col col-md-6 col-sm-12 text-center">
              <b className="lead lead-sm">
                {session?.label}
              </b>
            </div>

            <div className="col col-md-6 col-sm-6 text-center">
              <b>
              {termIndex}
                <sup>{sup}</sup> {capitalize(verbose)} Student Academic Record
              </b>
            </div>
          </div>

          <MetaRecords 
            termInfo={termInfo} 
            updateData={handleComponentSumbit} 
            requestData={requestComponentData} 
          />
          <AcademicRecord 
            all_staffs={all_staffs} 
            level_id= {student_level_id}
            termInfo={termInfo} 
            updateData={handleComponentSumbit}
            requestData={requestComponentData}  
          />

          <AttrRecord
          updateData={handleComponentSumbit} 
          requestData={requestComponentData} 
          />

          <StaffRemarks 
            session_setting={settings}
            level_id={student_level_id}
            all_staffs={all_staffs}
          updateData={handleComponentSumbit} 
          requestData={requestComponentData} 
          />


      </>
    )
  }


  const loadUp = async ()=>{

    // get term data
    const {terms} = session.settings;

    const {term_id} = terms[termIndex];

    const termData = await window.api.request(academic_session_channel.getTerm, term_id);

    const studentTermRecord = await window.api.request(academic_session_channel.getTermRecord, {term_id, student_id:studentId});
    
    // console.log(termData);
    setTermInfo(()=>termData);
    setTermRecord(()=>{
      if(!Boolean(studentTermRecord)){
        return {}
      }

      return studentTermRecord;
    })
    setLoading(false);

    // load student record    
  }


  useEffect(()=>{
    if(loading){
      loadUp();
    }
  }, [loading, termInfo])

  if (loading){
    return <Loading/>;
  }


  return (
    <div className="content">
      <div className="row">
        
        <div className="col-4">
          <StudentPreview
            student={student}
            level_id={student_level_id}
          />
        </div>

        <div className="col-8">
          {renderComponents()}
        </div>

      </div>


    </div>
  )
}

export default StudentRecord