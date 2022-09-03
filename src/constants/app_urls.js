// Screens
const setupUrl = "/"
const authUrl = "/auth"

const dashboardUrl = "/dashboard";

const homeUrl = `${dashboardUrl}/home`;
const admissionUrl = `${dashboardUrl}/admission`;
const setsUrl = `${dashboardUrl}/sets`;//"/sets";
const sessionUrl = `${dashboardUrl}/session`; // "/session";


const initializeUrl = "/initialize"

// actions
const loginUrl = "/auth/login"
const newUserUrl = "/auth/new"


const getPhaseName = (pathname)=>{

    if (pathname.includes(sessionUrl)){
        return "Sessions"
    }
    if (pathname.includes(setsUrl)){
        return "Sets"
    }

    if (pathname.includes(admissionUrl)){
        return "Admission"
    }

    if (pathname.includes(homeUrl)){
        return "Overview"
    }


    // if (pathname.contains(homeUrl)) {
    //     return "Overview"
    // }

}

export {
    authUrl, loginUrl, dashboardUrl,
    newUserUrl, initializeUrl, 
    setupUrl, getPhaseName,
    homeUrl, admissionUrl,
    setsUrl, sessionUrl

}