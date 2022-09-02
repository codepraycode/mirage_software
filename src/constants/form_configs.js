// Form configurations

const form_configs_options = {
    image: {
        elem: 'image',
        config: {
            type: 'text',
            value: null,
            readOnly: true,
            placeholder: 'No Image Uploaded (.jpg, .png, .jpeg images are supported)',
        }
    },

    text: {
        elem: 'input',
        config: {
            type: 'text',
            value: '',
        }
    },
    long_text: {
        elem: 'textarea',
        config: {
            value: '',
        }
    },
    email_text: {
        elem: 'input',
        config: {
            type: 'email',
            value: '',
        }
    },
    password: {
        elem: 'input',
        config: {
            type: 'password',
            value: '',
        }
    },

    date: {
        elem: 'input',
        config: {
            type: 'date',
            value: ''
        }
    },

    radio_selected_text: {
        elem: 'radio',
        options: [],
        config: {
            type: 'radio',
            value: '',
        }
    },
    dropdown_selected_text: {
        elem: 'select',
        options: [],
        config: {
            value: '',
        }
    },

    checked_text: {
        elem: 'checkbox',
        label: '',
        config: {
            value: '',
            // checked:false
        }
    },

}

const InitializeSchoolFormConfig = {
    form_data: {
        logo: {
            data_type: 'image',
            name: 'logo',
            required: true,
            file_category: 'profile'
        },
        name: {
            data_type: 'text',
            name: 'name',
            placeholder: "",
            required: true
        },
        description: {
            data_type: 'long_text',
            name: 'description',
            placeholder: "",
            required: false
        },
        motto: {
            data_type: 'text',
            name: 'motto',
            placeholder: "",
            required: false
        },
        address: {
            data_type: 'long_text',
            name: 'address',
            placeholder: "",
            required: true
        },
        state: {
            data_type: 'text',
            name: 'state',
            placeholder: "",
            required: true
        },
        city: {
            data_type: 'text',
            name: 'city',
            placeholder: "",
            required: true
        },

        zipcode: {
            data_type: 'text',
            name: 'zipcode',
            placeholder: "",
            required: false
        },
        country: {
            data_type: 'text',
            name: 'country',
            placeholder: "",
            required: true
        },
        contacts: {
            data_type: 'text',
            name: 'contacts',
            placeholder: "",
            required: true
        },
        email: {
            data_type: 'email_text',
            name: 'email',
            placeholder: "Email Address",
            required: true
        },
        website: {
            data_type: 'text',
            name: 'website',
            placeholder: "Official website (optional)",
            required: false
        },
    },
    groups: [
        [
            ['logo', 'name', 'website', 'motto', 'description'],
            ['contacts', 'email', 'address', 'city', 'state', 'zipcode', 'country']
        ],
    ],
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


export { InitializeSchoolFormConfig, LoginFormConfig, UserCreationFormConfig, NewSetFormConfig, NewSessionFormConfig, form_configs_options }