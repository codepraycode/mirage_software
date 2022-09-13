import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom';
import { academic_session_channel } from '../constants/channels';
import { avatar, school_logo_placeholder } from '../constants/assets';
import { parseFileUrl, supify } from '../constants/utils';
import '../scss/report.scss';
import Preloader from '../widgets/Preloader';

const ReportTemplate = ({report})=>{

    if(!Boolean(report)) return;

    const { school, student, level, term, session, attendance, academic_performance, behavioural_data, remarks } = report;

    const sup = supify(term.term_index)
    return(
        <>
            <header>
                <div className='img'>
                    <img
                        src={parseFileUrl(school.logo) || school_logo_placeholder}
                        alt={"School logo"}
                        className="img-responsive"
                    />
                </div>

                <div className="title">
                    <h2>{school.name}</h2>

                    <p className='address text-muted'>
                        <i>{school.address}, {school.city}, {school.state} </i>
                    </p>

                    <ul className="contacts  text-muted">
                        <li>{school.contacts}</li>
                        <li>{school.email}</li>
                        <li>{school.website||''}</li>
                    </ul>

                    <h3>Progress Report</h3>
                </div>

                <div className='img'>
                    {
                        student.passport && <img
                            src={parseFileUrl(student.passport) || avatar}
                            alt={"Passport"}
                            className="img-responsive"
                        />
                    }
                    
                </div>
            </header>

            <main>
                <section className='student_info'>

                    <div>
                        <span className='label'>Name</span>
                        <span>{student.first_name} {student.last_name} {student.other_name?.at(0).toUpperCase()}</span>
                    </div>

                    <div>
                        <span className='label'>Admission NO</span>
                        <span>{student.admission_no}</span>
                    </div>

                    <div>
                        <span className='label'>Class</span>
                        <span>{level?.label}</span>
                    </div>

                    <div>
                        <span className='label'>Term</span>
                        <span>{term.term_index}<sup>{sup}</sup> Term</span>
                    </div>

                    <div>
                        <span className='label'>Session</span>
                        <span>{session.label}</span>
                    </div>

                    <div>
                        <span className='label'>School Opened</span>
                        <span>{attendance?.no_of_times_opened} day{attendance?.no_of_times_opened > 1 ? 's':''}</span>
                    </div>

                    <div>
                        <span className='label'>Present in school</span>
                        <span>{attendance?.no_of_times_present} day{attendance?.no_of_times_present > 1 ? 's' : ''}</span>
                    </div>


                </section>


                <section className='academy'>
                    {/* <p className="title">ACADEMIC PERFORMANCE</p> */}

                    <table>

                        <thead>
                            <tr>
                                <th>Subjects</th>
                                <th className="lh-1">C.A</th>
                                <th>EXAM</th>
                                <th>Total</th>
                                <th>Grade</th>
                                <th>Percentage</th>
                                <th>Remarks</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <th>Marks Obtainable</th>
                                <th>40</th>
                                <th>60</th>
                                <th>100</th>
                            </tr>


                            {
                                academic_performance?.data.map((ech, i)=>(
                                    <tr key={i}>
                                        <td>{ech.name}</td>
                                        <td>{ech.ca}</td>
                                        <td>{ech.exam}</td>
                                        <td>{ech.obtained}</td>
                                        <td>-</td>
                                        <td>{(Number(ech.percent)*100).toFixed(1)}%</td>
                                        <td>----</td>
                                    </tr>
                                ))
                            }

                        </tbody>

                        <tfoot>
                            <tr>
                                <td>
                                    Total obtainable:
                                    &nbsp;
                                    {academic_performance?.total_obtainable}
                                </td>
                                {/* <td>100</td> */}

                                {/* <td>Total obtained</td>
                                <td>100</td> */}

                                <td>
                                    Total obtained:
                                    &nbsp;
                                    {academic_performance?.total_obtained}
                                </td>
                                
                                <td>
                                    Percentage:
                                    &nbsp;
                                    {(Number(academic_performance?.percentage) * 100).toFixed(1)}%
                                </td>
                                

                                {/* <td>Percentage</td>
                                <td>100%</td> */}

                            </tr>
                        </tfoot>

                    </table>                
                </section>

                <section className='scalings'>

                    <table>

                        <thead>
                            <tr>
                                <th colSpan={3}>Behavioural data</th>
                            </tr>
                        </thead>

                        <tbody>

                            {
                                behavioural_data?.data.map((edt,i)=>(
                                    <tr key={i}>
                                        <th colSpan={2}>{edt.label}</th>

                                        <th>{edt.point}</th>
                                    </tr>
                                ))
                            }


                        </tbody>


                    </table> 

                    <table>

                        <thead>
                            <tr>
                                <th colSpan={3}>Grade Scale</th>
                            </tr>
                        </thead>

                        <tbody>

                            {
                                Object.entries(behavioural_data?.rating).map(([point, val],i) => (
                                    <tr key={i}>
                                        <th colSpan={2}>{point}</th>

                                        <th>{val}</th>
                                    </tr>
                                ))
                            }

                        </tbody>


                    </table> 

                    <table>

                        <thead>
                            <tr>
                                <th colSpan={4}>Ratings</th>
                            </tr>
                        </thead>

                        <tbody>

                            {
                                academic_performance?.scale.map((scl, i) => (
                                    <tr key={i}>
                                        <th colSpan={2}>{scl.key}</th>

                                        <th>{scl.value}</th>
                                        <th>{scl.remark}</th>
                                    </tr>
                                ))
                            }

                        </tbody>


                    </table> 

                </section>

                <section className='remarks'>
                    <div>
                        <span><b>{remarks?.school_head.label}</b></span>

                        <p>{remarks?.school_head.remark}</p>

                        <p className='text-muted'>Stamp</p>
                    </div>


                    <div>
                        <span><b>{remarks?.level_head.label}</b></span>

                        <p>{remarks?.level_head.remark}</p>

                        <p className='text-muted'>Stamp</p>
                    </div>
                </section>
            </main>
            

            <footer className='text-muted'>
                <span>
                    &copy; {new Date().getFullYear()}, Sample School
                </span>


                <span><small>generated by</small> Mirage Software</span>
            </footer>

        </>
    )
}


const Report = () => {
    const { termId:term_id, levelId:level_id, studentId:student_id } = useParams();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [report,setReport] = useState(null);

    const loadManifest = async()=>{

        if(!loading) return;

        setLoading(false);

        try{
            const data = await window.api.request(academic_session_channel.getTermReport, { term_id, level_id, student_id })

            setReport(() => data);
        }catch(err){
            console.error(err.message);
            setError("Could not prepare student report, make sure the inputs are complete")
        }
          
    }


    useEffect(() => {
        loadManifest()
    }, []);


    if(loading){
        return <Preloader type={"module_loader"} />
    }


    if(Boolean(error)){
        return(
            <p className='text-center text-muted'>{error}</p>
        )
    }


    console.log(report);


    return (
        <>
            <ReportTemplate  report={report}/>

            <button 
                onClick={() => window.print("sample_report")} 
                className="download_btn"
            >
                <i className="fas fa-download"></i>
            </button>
        </>
    )
}

export default Report