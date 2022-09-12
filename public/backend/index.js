const { ipcMain} = require('electron');

// Views
const { Settings, Account, SchoolSet, Sessions, app_files_dir } = require('./views');


const settings = new Settings()
const account = new Account()
const schoolset = new SchoolSet()
const academicSession = new Sessions();


// Portal

/* 
    When app is launched, settings module creates all the settings templates
    if they don't exists, and returns true otherwise error.
*/

ipcMain.handle("settings:start", async () => {
    

    /*
        Incase of fresh run, setup settings, otherwise no need

        this is what the launcher awaits
    */

    await settings.initialize() // initialize app data

    return true
})


ipcMain.handle("settings:update",async(_event,{section, data})=>{
    

    // add school data to settings

    return await settings.update(section, data);

})

ipcMain.handle("settings:delete",async(_event,{section, _id})=>{
    

    // add school data to settings

    const res = await settings.delete(section, _id);

    return res;

})


ipcMain.handle("settings:all",async()=>{
    // Get all settings collections

    const data = await settings.all()

    return data
})


ipcMain.handle("settings:get", async (_e, section) => {
    // Get all settings collections

    const data = await settings.get(section)

    return data;
})


// ================= Account =======================
ipcMain.handle("account:new", async (_e, user_data) => {

    /* 
        Add new user after registered with core


        data sample {
            "prefix":"Mr.",
            "firstname":"Paul",
            "lastname":"Harris",
            "email":"greeneana@ford.info",
            "contacts":"001-050-793-9951",
            "username":"tara71",
            "password":"*******"
        }
    */
    

    // delete user_data.school_key

    try{
        const dt = await account.addUpdate(user_data);

        return [null, dt];
    }catch(err){
        return [err.message, null];
    }
    
})

ipcMain.handle("account:authenticate", async (_e, auth_data) => {

    try{
        const dt = await account.authenticate(auth_data);

        return [null, dt];
    }
    catch(err){
        return [err.message, null];
    }
});

ipcMain.handle("account:check_password", async (_e, { user_id,password}) => {

    if (!Boolean(user_id) || !Boolean(password)) return false;

    const user_query = await account.query({ _id:user_id});

    if (!Boolean(user_query) || user_query?.length < 1) return false;
    
    const user = user_query[0];

    return user.password === password;

});

ipcMain.handle("account:all", async () => {    

    // verify username or email exists
    const users = await account.query();

    return users;

}); 

ipcMain.handle("account:update", async (_event, data) => {

    return await account.update(data);

})


// ================= Set =======================
ipcMain.handle("set:new", async (_e, set_data) => {

    /* 
        Add new user after registered with core


        data sample {
            date_closed: null
            date_created: "2022-08-01T06:30:00.854026Z"
            id: 1
            is_alumni: false
            is_opened: true
            label: "Set 2022/2023"
            last_updated: "2022-08-01T06:30:00.854026Z"
            name: "Set'27"
        }
    */ 

    try{
        const data = await schoolset.create(set_data)
        
        return [null, data];
    }
    catch (err){
        return [err.message, null];
    }
})

ipcMain.handle("set:all", async () => {

    return await schoolset.all();
})

ipcMain.handle("set:get", async (_e, set_id) => {

    return await schoolset.get(set_id);
})

ipcMain.handle("set:update", async (_e, set_data) => {
    return await schoolset.update(set_data);
})


// ================= Student =======================

ipcMain.handle("set:save_student", async (_e,data) => {
    // fetch school tha is_opened

    const doc = await schoolset.save_student(data);
    
    return doc
});

ipcMain.handle("set:admit_student", async (_e, { student_id, admission_no }) => {

    try{
        const doc = await schoolset.admit_student({ student_id, admission_no });
        return [null, doc];

    }catch(err){
        return [err.message, null];
    }
    

    
});

ipcMain.handle("set:delete_student", async (_e,_id) => {
    
    await schoolset.delete_student(_id);

    return null;
});


ipcMain.handle("set:save_sponsor", async (_e, { student_id, data }) => {
    // fetch school tha is_opened

    const doc = await schoolset.save_sponsor(student_id, data);
    return doc
});

ipcMain.handle("set:load_students", async (_e, set_id) => {

    const docs = await schoolset.load_students(set_id)

    return docs;

});

ipcMain.handle("set:load_student", async (_e, student_id) => {

    const docs = await schoolset.load_student(student_id)

    return docs;
});

ipcMain.handle("set:load_admitted_students", async (_e, set_id) => {

    const docs = await schoolset.load_admitted_students(set_id)

    return docs;
});

// ============================================



// ================= Session =======================
ipcMain.handle("session:create", async (_e, session_data) => {

    const doc = await academicSession.create(session_data);

    return doc;
});


ipcMain.handle("session:update", async (_e, session_data) => {

    const doc = await academicSession.update(session_data);

    return doc;
});

ipcMain.handle("session:all", async () => {
    // fetch sessions    

    const docs = await academicSession.all();

    return docs;
});

ipcMain.handle("session:get", async (_e, session_id) => {
    // fetch sessions    

    const docs = await academicSession.get(session_id);

    return docs;
});


// ================= Session Terms =======================
ipcMain.handle("session:createTerm", async (_e, term_data) => {

    const doc = await academicSession.createTerm(term_data);

    return doc;
});

ipcMain.handle("session:getTerms", async (_e, session_id) => {
    // fetch sessions    

    const docs = await academicSession.getTerms(session_id);

    return docs;
});

ipcMain.handle("session:updateTerm", async (_e, term_data) => {
    // fetch sessions    

    const docs = await academicSession.updateTerm(term_data);

    return docs;
});

ipcMain.handle("session:getTerm", async (_e, term_id) => {
    // fetch sessions    

    const docs = await academicSession.getTerm(term_id);

    return docs;
});

ipcMain.handle("session:queryTerm", async (_e, query) => {
    // fetch sessions    

    const docs = await academicSession.queryTerm(query);

    return docs;
});


// ================= Session Term Record=======================
ipcMain.handle("session:createTermRecord", async (_e, record_data) => {

    const doc = await academicSession.createTermRecord(record_data);

    return doc;
});

ipcMain.handle("session:updateTermRecord", async (_e, record_data) => {

    const doc = await academicSession.updateTermRecord(record_data);

    return doc;
});

ipcMain.handle("session:getTermRecord", async (_e, query) => {
    // fetch sessions    

    const docs = await academicSession.getTermRecord(query);

    return docs;
});

ipcMain.handle("session:getTermReport", async (_e, { term_id, student_id, level_id }) => {    

    const report = await proccessReport({ term_id, student_id, level_id });

    return report;
});

// =================================================


const getSchoolInfo = (school) =>{
    const {
        logo,
        name,
        motto,
        address,
        state,
        city,
        contacts,
        email,
        website
    } = school;


    return {
        logo,
        name,
        motto,
        address,
        state,
        city,
        contacts,
        email,
        website
    }
}

const getStudentInfo = (student) => {
    const {
        first_name,
        last_name,
        admission_no,
        gender,
        date_of_birth,
        
        sponsor,
    } = student;

    const {
        title,
        first_name:sponsor_firstname,
        last_name:sponsor_lastname,
        email,
        passport:sponsor_passport,
        relationship,
    } = sponsor;


    return {
        first_name,
        last_name,
        admission_no,
        gender,
        date_of_birth,

        sponsor:{
            title,
            first_name: sponsor_firstname,
            last_name: sponsor_lastname,
            email,
            passport: sponsor_passport,
            relationship,
        }
    }
}

const getSessionDetails = (session)=>{
    const {
        label,
        title,
        date_started,
        date_closed
    } = session;

    return {
        label,
        title,
        date_started,
        date_closed
    }
}

const getTermDetails = (term) => {
    const {
        label,
        date_started,
        date_concluded,
        term_index,
        no_of_times_opened,
        next_term_begins
    } = term;

    return {
        label,
        date_started,
        date_concluded,
        term_index,
        no_of_times_opened,
        next_term_begins
    }
}

const getStudentAttendance = (termRecord, no_of_times_opened) => {
    
    const {
        no_of_times_present,
        no_of_times_absent,
    } = termRecord.attendance ||{};

    let percent = (Number(no_of_times_present || 0) - Number(no_of_times_absent || 0)) / no_of_times_opened

    percent = percent.toFixed(2);



    return {
        no_of_times_opened,
        no_of_times_present,
        no_of_times_absent,
        percentage: Number(percent) || 0
    }
}

const getStudentAttr = (termRecord, attr_settings) =>{

    const { attr } = termRecord

    const {keys, mappings} = attr_settings;

    const data = Object.entries(attr).map(([key, point])=>{
        let key_data = keys.find((eky)=>eky._id === key);

        return{
            label:key_data.value,
            point,
        }
    });


    const rating = {}
    
    mappings.forEach((emp)=>{
        rating[emp.point] = emp.value
    })

    return {
        rating,
        data
    }


}

const getStudentRemarks = (termRecord) =>{

    const { remarks } = termRecord
    return remarks;

}


const getStudentAcademicPerformance = (grade_scale, termRecord, other_students_subjects_data)=>{
    // proccess according to students subjects
    // that means only proccess subject data of students that offered same subjects
    // as the current student

    // student_subjects_data -> object
    // other_students_subjects_data -> [objects]

    const { subjects: student_subjects_data } = termRecord;

    let student_total_obtainable = 0;
    let student_total_obtained = 0;


    const data = Object.entries(student_subjects_data || []).map(([subject_id, subject_data])=>{

        const { name, short, ca, exam, total_obtainable} = subject_data;


        const obtained = Number(ca) + Number(exam);

        let percent = (Number(obtained)) / total_obtainable

        percent = percent.toFixed(2);


        student_total_obtainable += Number(total_obtainable);
        student_total_obtained += obtained;

        return {
            name,short,
            ca,exam,
            obtained, percent
        }

        //  filter other students data
        // other_student_data = other_students_subjects_data.filter((otrs) => Boolean(otrs[subject_id])); 
    });

    let percentage = (Number(student_total_obtained)) / student_total_obtainable

    percentage = Number(percentage.toFixed(2)) || 0;

    const scale = grade_scale.map((scl)=>{
        const {key, value, remark} = scl;

        return { key, value, remark }
    })

    return {
        scale,
        data,
        total_obtainable: student_total_obtainable,
        total_obtained: student_total_obtained,
        percentage,
        no_of_pupils: other_students_subjects_data.length
    }
}

const proccessReport = async({term_id, student_id, level_id})=>{

    const app_settings = await settings.all();


    // Get school data
    const { school:schoolInfo, grades, attrs:attrs_settings } = app_settings;

    // get student data
    const studentInfo = await schoolset.get_student(student_id);

    // get students in student's levels term record
    const other_students_term_record = await academicSession.queryTermRecord({ term_id, level_id, student_id: { $ne: String(student_id) } });
    const term_record = await academicSession.getTermRecord({ term_id, student_id });


    // get term data
    const termInfo = await academicSession.getTerm(term_id);

    // get session data
    const sesssionInfo = await academicSession.get(termInfo.session_id);


    // gather data

    const school = getSchoolInfo(schoolInfo);
    const student = getStudentInfo(studentInfo);
    const session = getSessionDetails(sesssionInfo);
    const term = getTermDetails(termInfo);
    const { no_of_times_opened } = term;
    const attendance = getStudentAttendance(term_record, no_of_times_opened);
    const behavioural_data = getStudentAttr(term_record, attrs_settings);
    const academic_performance = getStudentAcademicPerformance(grades, term_record, other_students_term_record)
    const remarks = getStudentRemarks(term_record)



    return {
        school,
        student,
        session,
        term,
        attendance,
        behavioural_data,
        academic_performance,
        remarks,
    }




}

module.exports = { app_files_dir };