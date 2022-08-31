// Form configurations

const InitializeAppFormConfig = {
    slot_id: {
        required: true,
        type: "text",
        name: "slot_id",
        label: "Slot ID",
        placeholder: "Enter a school's slot id",
    },
    // email: {
    //     required: true,
    //     type: "email",
    //     name: "email",
    //     label: "Onwer's email",
    //     placeholder: "Enter school's creator email address",
    // },
    password: {
        required: true,
        type: "password",
        name: "password",
        label: "Owner's password",
        placeholder: "Enter school's creator password",
    },
};



const LoginFormConfig = {
    username: {
        required: true,
        type: "text",
        name: "username_email",
        label: "Username or Email",
        placeholder: "Enter either your username or email",
    },
    password: {
        required: true,
        type: "password",
        name: "password",
        label: "Password",
        placeholder: "Enter your password",
    },
};


const UserCreationFormConfig = {

    avatar: {
        type: "image",
        name: "avatar",
    },

    prefix: {
        required: false,
        type: "text",
        name: "prefix",
        label: "Prefix",
        placeholder: "Enter your prefix e.g Mr, Mrs, Dr, Prof",
    },

    firstname: {
        required: true,
        type: "text",
        name: "firstname",
        label: "First name",
        placeholder: "Enter your first name",
    },

    lastname: {
        required: true,
        type: "text",
        name: "lastname",
        label: "Last name",
        placeholder: "Enter your last name",
    },

    contacts: {
        required: true,
        type: "text",
        name: "contacts",
        label: "Phone Number",
        placeholder: "Enter your active phone number",
    },


    email: {
        required: true,
        type: "email",
        name: "email",
        label: "Email",
        placeholder: "Enter your active email address",
    },

    username: {
        required: true,
        type: "text",
        name: "username",
        label: "Username",
        placeholder: "Enter your username",
    },
    password: {
        required: true,
        type: "password",
        name: "password",
        label: "Password",
        placeholder: "Enter your password",
    },

    confirm_password: {
        required: true,
        type: "password",
        name: "confirm_password",
        label: "Confirm password",
        placeholder: "Confirm your password",
    },
};



// Set

const dt = new Date()
const yr = dt.getFullYear();


const NewSetFormConfig = {
    label: {
        required: true,
        type: "text",
        name: "label",
        label: "Set's Label",
        placeholder: `for example: Set ${yr}/${yr+1}`,
    },
    name: {
        required: false,
        type: "text",
        name: "name",
        label: "Set's name",
        placeholder: "Enter a name to identify this class set",
    },
};


const NewSessionFormConfig = {
    title: {
        required: true,
        type: "text",
        name: "title",
        label: "Session's title",
        placeholder: `for example: Session ${yr}/${yr + 1}`,
    },
    date_started: {
        required: true,
        type: "date",
        name: "date_started",
        label: "Session started",
        placeholder: `set the date this session started`,
    },
};

function serializeFormErrorData(error_data, pattern = null) {


    let res = {}


    if (pattern) {
        res = {...pattern }
    }


    Object.entries(error_data).map(([field, value]) => {
        // check if issues field is predefined
        // in issues, otherwise, treat as formIssue
        let val = Array.isArray(value) ? value[0] : value;

        // console.log(field, value, val)

        if (field in res) {
            res[field] = val;
            // console.log(new_issue)
        } else {
            res.formIssues[field] = val;
            // console.log(new_issue)
        }


        return null;

    })

    return res;
}

export { InitializeAppFormConfig, LoginFormConfig, UserCreationFormConfig, NewSetFormConfig,NewSessionFormConfig,serializeFormErrorData }