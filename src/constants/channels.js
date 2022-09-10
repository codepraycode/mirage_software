

// Bases
const settings = 'settings'
const account = 'account'
const schoolset = 'set'

const academic_session = 'session';


export const settings_channel = {    
    all:`${settings}:all`,
    start:`${settings}:start`,
    update:`${settings}:update`,
    get:`${settings}:get`,
    delete: `${settings}:delete`,
}


export const account_channel = {
    new: `${account}:new`,
    authenticate: `${account}:authenticate`,
    all: `${account}:all`,
    check_password: `${account}:check_password`,
    update: `${account}:update`,
}


export const schoolset_channel = {
    new: `${schoolset}:new`,
    all: `${schoolset}:all`,
    get: `${schoolset}:get`,
    update: `${schoolset}:update`,


    save_student: `${schoolset}:save_student`,
    admit_student: `${schoolset}:admit_student`,
    delete_student: `${schoolset}:delete_student`,
    save_sponsor: `${schoolset}:save_sponsor`,
    load_students: `${schoolset}:load_students`,
    load_student: `${schoolset}:load_student`,
    load_admitted_students: `${schoolset}:load_admitted_students`,
}


export const academic_session_channel = {
    create: `${academic_session}:create`,
    update: `${academic_session}:update`,
    all: `${academic_session}:all`,
    get: `${academic_session}:get`,

    createTerm: `${academic_session}:createTerm`,
    getTerms: `${academic_session}:getTerms`,
    getTerm: `${academic_session}:getTerm`,
    queryTerm: `${academic_session}:queryTerm`,
}