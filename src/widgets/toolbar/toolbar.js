import React,{useState,useEffect}from 'react';
import {Link} from 'react-router-dom';
import { capitalize, isObjectEmpty } from '../../backend/utils';
import {getSetInfo} from '../../backend/Views/student_sponsor_view';
import Preloader from '../../widgets/Preloader';

const Toolbar = (props)=>{

    let {setId, disableCTA, all_students, filterStudents,modifyClick} = props;
    
    const [state,setState] = useState({
        setInfo:null,
        search_found:null,

        loading:true,
        loaded:false
    })


    const querySetInfo = ()=>{
        // console.log(props.setId);
        getSetInfo(setId,(operation)=>{
            let setInfo = {}
            if(operation.success){
                if(isObjectEmpty(operation.data)){
                    return;
                }

                setInfo = {...operation.data} //['set_label']
                setState({
                    ...state,
                    setInfo,//:label
                    loaded:true,
                    loading:false
                })
            }
        })
    }

    const handleSearch = (e)=>{
        let value = e.target.value;
        // console.log(value);
        if(value.length < 1) {
            filterStudents(); // Filter with empty array
            setState({...state,search_found:null})
            return;
        };
        // console.log(all_students[0])

        let filtered_students = all_students.filter((each)=>{
            let {first_name, last_name,other_name, admission_no} = each;

            return [
                first_name.toLowerCase(),
                last_name.toLowerCase(),
                other_name.toLowerCase(),
                admission_no.toLowerCase()
            ].includes(value.toLowerCase());
        })

        filterStudents(filtered_students);
        setState({...state,search_found:filtered_students.length})
        return

    }

    useEffect(()=>{
        if(!state.loaded){
            querySetInfo();
        }
    })

    // console.log(state);
    
    return(
        <div className="app__toolbar">
            <div className="tool_left">
                {
                    !state.loaded ?
                    <Preloader/>
                    :
                    <b>
                        {/* Set {state.setInfo} */}

                        {
                            !state.setInfo.set_label.toLowerCase().includes("set") ?
                            'Set '
                            :
                            ''
                        }

                        {capitalize(state.setInfo.set_label.trim())} -- {capitalize(state.setInfo.set_name.trim())}
                    </b>
                }
                
            </div>

            <div className="tool_right">
                {
                    state.search_found !== null ?
                    <span className='text-muted'>Found {`${state.search_found} student${state.search_found > 1 ? 's':''}`}</span>
                    :
                    null
                }
                
                <div className="tool">
                    <div className="action">
                        <span className="form-group">
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Search student by name or admission number"
                                onChange={handleSearch}
                            />
                        </span>
                    </div>
                    <i className="fas fa-search"></i>
                    
                </div>

                {/* <span className="tool">
                    <div className="action">
                        <span className="form-group">
                            <select className="form-control">
                                <option defaultValue="all" disabled>sort</option>
                                <option value="js1">A</option>
                                <option value="js1">B</option>
                            </select>
                        </span>
                    </div>
                    
                </span> */}

                <span className="tool text-muted">
                    
                    <i className="fas fa-th"></i>
                </span>
                
                
                
                <Link 
                    to={`/admission/${setId}?modify=true`}
                    onClick={(e)=>{e.preventDefault();modifyClick()}}
                    className={`btn btn-primary ${disableCTA ? 'disabled':''}`}
                >
                    Modify
                </Link>
            </div>
        </div>)
}


export default Toolbar;