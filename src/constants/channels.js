

// Bases
const settings = 'settings'
const account = 'account'
const schoolset = 'set'
const activity_log = 'activity';
const academic_session = 'session';


export const settings_channel = {    
    all:`${settings}:all`,
    school:`${settings}:school`,
    instance: `${settings}:instance`,
    initialize:`${settings}:initialize`,
}


export const account_channel = {
    new: `${account}:new`,
    login: `${account}:login`,
    logout: `${account}:logout`,
    running: `${account}:running`,
    exists: `${account}:exists`,
    upsert: `${account}:upsert`,
    remove: `${account}:remove`,
    check_password: `${account}:check_password`,
}

export const schoolset_channel = {
    new: `${schoolset}:new`,
    opened: `${schoolset}:opened`,
    save_students: `${schoolset}:save_students`,
    all: `${schoolset}:all`,
    load_students: `${schoolset}:load_students`
}

export const activity_log_channel = {
    log: `${activity_log}:log`,
}

export const academic_session_channel = {
    new: `${academic_session}:new`,
    all: `${academic_session}:all`,
}