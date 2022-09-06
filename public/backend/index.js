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

})

ipcMain.handle("account:all", async () => {    

    // verify username or email exists
    const users = await account.query();

    return users;

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

ipcMain.handle("set:update", async (_e, {set_id, set_data}) => {

    return await schoolset.update(set_id, set_data);
})

// ================= Student =======================
ipcMain.handle("set:save_student", async (_e,{set_id, data}) => {
    // fetch school tha is_opened

    const doc = await schoolset.save_student(set_id,data);
    
    return doc
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

ipcMain.handle("set:load_admitted_students", async (_e, set_id) => {

    const docs = await schoolset.load_admitted_students(set_id)

    return docs;
});

// ============================================



// ================= Session =======================
ipcMain.handle("session:new", async (_e, session_data) => {

    /* 
        Add new session


        data sample {
            - title: String|null,    
            - date_started: Date,
            - date_ended: Date | null,
            - last_sync: Date | null,
        }
    */


    const doc = await academicSession.new(session_data);

    return doc;
});

ipcMain.handle("session:all", async () => {
    // fetch sessions    

    const docs = await academicSession.all();

    return docs;
});


// ============================================

module.exports = { app_files_dir };