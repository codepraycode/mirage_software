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
                        Boolean(student.passport) && <img
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
                        <span className='label'>Admission Number</span>
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
                    <p className="title">ACADEMIC PERFORMANCE</p>

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
                                <th><i>Marks Obtainable</i></th>
                                <th><i>40</i></th>
                                <th><i>60</i></th>
                                <th><i>100</i></th>
                            </tr>


                            {
                                academic_performance?.data.map((ech, i)=>(
                                    <tr key={i}>
                                        <th>{ech.name}</th>
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
                                    <b>Total obtainable:</b>
                                    &nbsp;
                                    {academic_performance?.total_obtainable}
                                </td>
                                {/* <td>100</td> */}

                                {/* <td>Total obtained</td>
                                <td>100</td> */}

                                <td>
                                    <b>Total obtained:</b>
                                    &nbsp;
                                    {academic_performance?.total_obtained}
                                </td>
                                
                                <td>
                                    <b>Percentage:</b>
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
                            <tr >
                                <th colSpan={3} >
                                    <span className="title"> Behavioural data</span>
                                </th>
                            </tr>
                        </thead>

                        <tbody>

                            {
                                behavioural_data?.data.map((edt,i)=>(
                                    <tr key={i}>
                                        <td colSpan={2}>{edt.label}</td>

                                        <th>
                                            <span className='ball'>{edt.point}</span>
                                        </th>
                                    </tr>
                                ))
                            }


                        </tbody>


                    </table> 

                    <table>

                        <thead>
                            <tr>
                                <th colSpan={3}>
                                    
                                    <span className="title">Grade Scale</span>
                                </th>
                            </tr>
                        </thead>

                        <tbody>

                            {
                                Object.entries(behavioural_data?.rating).map(([point, val],i) => (
                                    <tr key={i}>
                                        <th>
                                            
                                            <span className='ball'>{point}</span>
                                        </th>

                                        <td>{val}</td>
                                    </tr>
                                ))
                            }

                        </tbody>


                    </table> 

                    <table>


                        <thead>
                            <tr>
                                <th colSpan={4}>

                                    <span className="title">Ratings</span>
                                </th>
                            </tr>
                        </thead>

                        <tbody>

                            {
                                academic_performance?.scale.map((scl, i) => (
                                    <tr key={i}>
                                        <th colSpan={2}>{scl.key}</th>

                                        <td>{scl.value}</td>
                                        <td>{scl.remark}</td>
                                    </tr>
                                ))
                            }

                        </tbody>


                    </table> 

                </section>

                <section className='remarks'>
                    
                    <div className='remark__item'>

                        <p>
                            {remarks.school_head.remark}
                        </p>

                        <div className='details'>

                            <div>
                                <h4>
                                    {remarks.school_head.staff.title} {" "}
                                    {remarks.school_head.staff.first_name} {" "}
                                    {remarks.school_head.staff.last_name}
                                </h4>
                                <span className='text-muted'>
                                    <i>{remarks.school_head.label}</i>
                                </span>
                            </div>

                            

                            {Boolean(remarks.school_head.staff.passport) && (<div className="img" style={{ backgroundImage: `url(${parseFileUrl(remarks.school_head.staff.passport) || avatar})` }}>
                            </div>)}
                        </div>
                        
                    </div>

                    
                    <div className='remark__item'>

                        <p>
                            {remarks.level_head.remark}
                        </p>

                        <div className='details'>

                            <div>
                                <h4>
                                    {remarks.level_head.staff.title} {" "}
                                    {remarks.level_head.staff.first_name} {" "}
                                    {remarks.level_head.staff.last_name}
                                </h4>
                                <span className='text-muted'>
                                    <i>{remarks.level_head.label}</i>
                                </span>
                            </div>



                            {Boolean(remarks.level_head.staff.passport) && (<div className="img" style={{ backgroundImage: `url(${parseFileUrl(remarks.level_head.staff.passport) || avatar})` }}>
                            </div>)}
                        </div>

                    </div>

                </section>
            </main>
            

            <footer>
                <span>
                    &copy; {new Date().getFullYear()} {school.name}{", "}
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


    const [downloading, setDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState(null);
    const [downloadPath, setDownloadPath] = useState(null);

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

    const printPdf = async ()=>{

        if(!Boolean(report)) return
        if(downloading) return

        const {session, student, term} = report;

        const filename = `${student.first_name}_${student.last_name}_${session.label}_${term.label}_report.pdf`

        let parsed_use_filename = filename.toLowerCase().replaceAll('/','_').replaceAll(' ','_')

        window.api.request("print:pdf", parsed_use_filename)
        .then(([error, pdfPath])=>{

            if(error){
                setDownloadError(()=>error);
            }else if(pdfPath){
                setDownloadPath(()=>pdfPath);
            }

            setDownloading(false);
        })
        .catch((err)=>{
            console.log(err)
            setDownloadError(() => err);
            setDownloading(false);
        })

        setDownloading(true);

        if (Boolean(downloadError)){
            setDownloadError(null);
        }


        if (Boolean(downloadPath)){
            setDownloadPath(null);
        }

    }


    useEffect(() => {
        loadManifest()
    });


    if(loading){
        return <Preloader type={"module_loader"} />
    }


    if(Boolean(error)){
        return(
            <p className='text-center text-muted'>{error}</p>
        )
    }

    let template = (
        <button
            onClick={() => printPdf()} 
            className={"download_btn"}
        >
            <i className="fas fa-download"></i>
        </button>
    )


    if(downloading){
       template = ( <button
            // onClick={() => printPdf()} 
            className={`download_btn ${Boolean(downloadError) ? 'error' : ''} ${Boolean(downloadPath) ? 'checked' : ''}`}
        >
            <span className={`spinner`}>
                <i className="fas fa-spinner"></i>
            </span>
        </button>)
    }
    else if(Boolean(downloadError)){
       template = ( <button
            // onClick={() => printPdf()} 
            className={`download_btn error`}
        >
            <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
        </button>)
    }

    else if(Boolean(downloadPath)){
       template = ( <button
            // onClick={() => printPdf()} 
            className={`download_btn checked`}
        >
           <i className="fa fa-check-circle" aria-hidden="true"></i>
        </button>)
    }

    return (
        <>
            <ReportTemplate  report={report}/>

            {template}

        </>
    )
}

export default Report