

// Bases
const settings = 'settings'
const account = 'account'
const schoolset = 'set'

const academic_session = 'session';


export const settings_channel = {    
    all:`${settings}:all`,
    start:`${settings}:start`,
    initialize:`${settings}:initialize`,
}


export const account_channel = {
    new: `${account}:new`,
    authenticate: `${account}:authenticate`,
    all: `${account}:all`,
    check_password: `${account}:check_password`,
}


export const schoolset_channel = {
    new: `${schoolset}:new`,
    all: `${schoolset}:all`,
    update: `${schoolset}:update`,


    save_students: `${schoolset}:save_student`,
    save_sponsor: `${schoolset}:save_sponsor`,
    load_students: `${schoolset}:load_students`,
    load_admitted_students: `${schoolset}:load_admitted_students`,
}


export const academic_session_channel = {
    new: `${academic_session}:new`,
    all: `${academic_session}:all`,
}