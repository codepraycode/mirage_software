const { ipcMain} = require('electron');

// Views
const { Settings, Account, SchoolSet, AcademicSessions } = require('./views');
const { Activity } = require('./activity_log');


const settings = new Settings()
const account = new Account()
const schoolset = new SchoolSet()
const academicSession = new AcademicSessions();

const activity_log = new Activity()


ipcMain.handle("activity:log", async (_e, log) => {

    const { auth_id, info, ref } = log
    await activity_log.write(auth_id, info, ref);

    return null
});


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


ipcMain.handle("settings:initialize",async(_event,initializing_data)=>{

    console.log(initializing_data)
    
   
    // Extract school data and slot
    const {school,software} = initializing_data;

    // add school data to settings

    await settings.update('school', school)

    // add slot to settings

    await settings.update('software', software)

    return true



})


ipcMain.handle("settings:all",async()=>{
    // Get all settings collections

    const data = await settings.all()

    return data
})

ipcMain.handle("settings:instance",async()=>{

    // Get settings school collection

    const school_data = await settings.get('school')

    const software_data = await settings.get('software')



    return [school_data, software_data]
})



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

    await account.new(user_data)
    // console.log(user_data)

    return 
})


ipcMain.handle("account:upsert", async (_e, user_data) => {

    /* 
        Add new user after registered with core, or update a user


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

    const {username} = user_data;

    await account.upsert({username},user_data)

    return
});

ipcMain.handle("account:remove", async (_e, {username}) => {

    await account.delete({ username })

    return
});


ipcMain.handle("account:login", async (_e, login_data) => {

    /* 
        Logs in user, first check if username/email exists
        then create an authentication log

        returns an array [error_string||null, authentication_log]
    */

    const {username_email, username,email,password} = login_data;

    let user = null;

    if(username){
        user = await account.query({ username: username })
    }else if(email){
        user = await account.query({ email: email })
    }else{
        // check for both

        // verify username or email exists
        const username_exists = await account.__exists({ username: username_email })
        // run validations
        if (!username_exists) {

            const email_exists = await account.__exists({ email: username_email })

            if (email_exists){

                user = await account.query({ email: username_email })

            }
            
        } else {

            user = await account.query({ username: username_email })

        }    
    }
 


    if(user===null){
        return ["Invalid username or email", null]
    }
    
    

    // compare password
    const password_match = user.password === password;

    if (!password_match) return ["Password does not match",null];
    
    // create auth log
    const user_id = user._id;

    const auth_log = await account.newAuthlog(user_id)


    const { _id, logged_in, } = auth_log;

    const auth_data = {
        auth_id:_id,
        logged_in,
        
        user_id,
        user_pk: user.id,
        avatar:user.avatar,
        username:user.username,
        email:user.email,
        //avatar
    }

    return [null, auth_data]

})


ipcMain.handle("account:check_password", async (_e, { auth_log,password}) => {

    /* 
        Receive active auth_log, get the user from the auth log
        get the user password, compare password
        and return comparison result
    */

    if (!Boolean(auth_log) || !Boolean(password)) return false;

    const isSame = await account.check_password({ auth_log,password});

    return isSame;

})

ipcMain.handle("account:exists", async () => {

    /* 
        Logs in user, first check if username/email exists
        then create an authentication log

        returns an array [error_string||null, authentication_log]
    */

    // verify username or email exists
    const _exists = await account.__exists();

    return _exists

})

ipcMain.handle("account:running", async () => {

    // Get the Session that is still alive
    // a auth session is still alive when there is no logged_out date

    const last_seen_log = await account.getLastActiveAuthlog()

    if (!last_seen_log) return null


    const { _id, logged_in, user:user_id } = last_seen_log;

    const user = await account.get(user_id);

    if (!user){

        await account.closeAuthlog(_id)
        return null
    }


    const auth_data = {
        auth_id: _id,
        logged_in,

        user_id,
        user_pk:user.id,
        avatar: user.avatar,
        username: user.username,
        email: user.email,
        //avatar
    }

    return auth_data;

    
})


ipcMain.handle("account:logout", async (_e,auth_id) => {
    // Close an authtication log
    await account.closeAuthlog(auth_id)

    return null
});


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


    await schoolset.new(set_data)

    return
})


ipcMain.handle("set:save_students", async (_e,admission_instances_raw) => {
    // fetch school tha is_opened

    const admission_instances = JSON.parse(admission_instances_raw)

    const doc = await schoolset.save_students(admission_instances)
    
    return doc
});


ipcMain.handle("set:all", async () => {
    // fetch school tha is_opened

    // const admission_instances = JSON.parse(admission_instances_raw)

    const docs = await schoolset.all();

    return docs;
});


ipcMain.handle("set:load_students", async (_e, set_id) => {
    // fetch school tha is_opened

    // const admission_instances = JSON.parse(admission_instances_raw)

    const doc = await schoolset.load_students(set_id)

    return doc
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


// ipcMain.handle("set:load_students", async (_e, set_id) => {
//     // fetch school tha is_opened

//     // const admission_instances = JSON.parse(admission_instances_raw)

//     const doc = await schoolset.load_students(set_id)

//     return doc
// });

// ============================================


// Methods to be used within app native events
const cleanUp = async () => {
    // Hooked in the close event of the app window
    // auto logs out authenticated user
    
    const last_seen_log = await account.getLastActiveAuthlog()
    
    if (!last_seen_log) return null

    await account.closeAuthlog(last_seen_log._id)

    return
}

module.exports = {
    cleanUp
}