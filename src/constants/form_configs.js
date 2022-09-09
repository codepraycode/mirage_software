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

    form_data: {
        avatar: {
            data_type: 'image',
            name: 'avatar',
            required: true,
            file_category: 'user'
        },
        first_name: {
            data_type: 'text',
            name: 'first_name',
            placeholder: "",
            required: true
        },
        last_name: {
            data_type: 'text',
            name: 'last_name',
            placeholder: "",
            required: true
        },
        contact: {
            data_type: 'text',
            name: 'contact',
            placeholder: "",
            required: true
        },
        email: {
            data_type: 'email_text',
            name: 'email',
            placeholder: "",
            required: true
        },
        username: {
            data_type: 'text',
            name: 'username',
            placeholder: "",
            required: true
        },

        password: {
            data_type: 'password',
            name: 'password',
            placeholder: "",
            required: true
        },
        confirm_password: {
            data_type: 'password',
            name: 'confirm_password',
            placeholder: "",
            required: true
        },
    },
    groups: [
        [
            ['avatar', 'first_name', 'last_name', 'contact'],
            ['email', 'username', 'password', 'confirm_password']
        ],
    ],
};
const UserUpdateFormConfig = {

    form_data: {
        avatar: {
            data_type: 'image',
            name: 'avatar',
            required: true,
            file_category: 'user'
        },
        first_name: {
            data_type: 'text',
            name: 'first_name',
            placeholder: "",
            required: true
        },
        last_name: {
            data_type: 'text',
            name: 'last_name',
            placeholder: "",
            required: true
        },
        contact: {
            data_type: 'text',
            name: 'contact',
            placeholder: "",
            required: true
        },
        email: {
            data_type: 'email_text',
            name: 'email',
            placeholder: "",
            required: true
        },
        username: {
            data_type: 'text',
            name: 'username',
            placeholder: "",
            required: true
        },

        password: {
            data_type: 'password',
            name: 'password',
            placeholder: "",
            required: true
        },
    },
    groups: [
        [
            ['avatar', 'first_name', 'last_name', 'contact'],
            ['email', 'username', 'password']
        ],
    ],
};

const StaffsDataSchema = {
    form_data: {
        passport: {
            data_type: 'image',
            name: 'passport',
            required: true,
            file_category: 'staff_passport'
        },
        title: {
            data_type: 'dropdown_selected_text',
            name: 'title',
            placeholder: "e.g Mr, Mrs, Prof, Dr",
            options: ['Mr', 'Mrs', 'Miss', 'Prof', 'Dr', 'Chief'],
            required: true
        },
        first_name: {
            data_type: 'text',
            name: 'first_name',
            placeholder: "",
            required: true
        },
        last_name: {
            data_type: 'text',
            name: 'last_name',
            placeholder: "",
            required: true
        },
        middle_name: {
            data_type: 'text',
            name: 'middle_name',
            placeholder: "",
            required: true
        },
        date_of_birth: {
            data_type: 'date',
            name: 'date_of_birth',
            placeholder: "",
            required: true
        },
        gender: {
            data_type: 'radio_selected_text',
            options: ['Male', 'Female'],
            name: 'gender',
            required: true
        },
        place_of_birth: {
            data_type: 'text',
            name: 'place_of_birth',
            placeholder: "",
            required: false
        },
        state_of_origin: {
            data_type: 'text',
            name: 'state_of_origin',
            placeholder: "",
            required: true
        },
        nationality: {
            data_type: 'text',
            name: 'nationality',
            placeholder: "",
            required: true
        },
        religion: {
            data_type: 'text',
            name: 'religion',
            placeholder: "",
            required: true
        },
        residential_address: {
            data_type: 'long_text',
            name: 'residential_address',
            placeholder: "",
            required: true
        },
        state_of_residence: {
            data_type: 'text',
            name: 'state_of_residence',
            placeholder: "",
            required: true
        },
        local_government: {
            data_type: 'text',
            name: 'local_government',
            placeholder: "",
            required: true
        },
        zip_code: {
            data_type: 'text',
            name: 'zip_code',
            placeholder: ""
        },
        highest_qualification: {
            data_type: 'text',
            name: 'highest_qualification',
            placeholder: "",
        },

        marital_status: {
            data_type: 'dropdown_selected_text',
            name: 'marital_status',
            placeholder: "",
            options: ['Single', 'Married', 'Divorced'],
            required: true
        },

        contacts: {
            data_type: 'text',
            name: 'contacts',
            placeholder: "",
        },
        email: {
            data_type: 'email_text',
            name: 'email',
            placeholder: "",
        },

    },
    groups: [
        [
            ['passport', 'title', 'first_name', 'middle_name', 'last_name'],
            ['date_of_birth', 'gender', 'marital_status', 'religion', 'highest_qualification']
        ],

        [
            ['residential_address', 'state_of_residence', 'local_government', 'zip_code'],
            ['place_of_birth', 'state_of_origin', 'nationality', 'contacts', 'email']
        ],

    ]
}

const StudentDataSchema = {
    form_data: {
        passport: {
            data_type: 'image',
            name: 'passport',
            required: true,
            file_category: 'student_passport'
        },
        admission_no: {
            data_type: 'text',
            name: 'admission_no',
            readOnly: true
        },
        first_name: {
            data_type: 'text',
            name: 'first_name',
            placeholder: "Student's First Name",
            required: true
        },
        last_name: {
            data_type: 'text',
            name: 'last_name',
            placeholder: "Student's Last Name",
            required: true
        },
        other_name: {
            data_type: 'text',
            name: 'other_name',
            placeholder: "Student's Other Name",
            required: true
        },
        date_of_birth: {
            data_type: 'date',
            name: 'date_of_birth',
            placeholder: "Student's Date Of Birth",
            required: true
        },
        gender: {
            data_type: 'radio_selected_text',
            options: ['male', 'female'],
            name: 'gender',
            required: true
        },

        place_of_birth: {
            data_type: 'text',
            name: 'place_of_birth',
            placeholder: "Student's Place Of Birth",
            required: false
        },

        state_of_origin: {
            data_type: 'text',
            name: 'state_of_origin',
            placeholder: "Student's State Of Origin",
            required: true
        },
        nationality: {
            data_type: 'text',
            name: 'nationality',
            placeholder: "Student's nationality",
            required: true
        },
        religion: {
            data_type: 'text',
            name: 'religion',
            placeholder: "Student's religion",
            required: false
        },
        residential_address: {
            data_type: 'long_text',
            name: 'residential_address',
            placeholder: "Student's residential address",
            required: false
        },
        state_of_residence: {
            data_type: 'text',
            name: 'state_of_residence',
            placeholder: "Student's state of residence",
            required: false
        },
        local_government: {
            data_type: 'text',
            name: 'local_government',
            placeholder: "Student's local government",
            required: false
        },
        zip_code: {
            data_type: 'text',
            name: 'zip_code',
            placeholder: ""
        },
        

    },
    groups: [
        [
            ['passport', 'admission_no', 'first_name', 'last_name', 'other_name', 'gender', 'date_of_birth',],
            ['place_of_birth', 'state_of_origin', 'nationality', 'religion','residential_address', 'state_of_residence', 'local_government', 'zip_code'],  
        ],
    ]
}

const SponsorDataSchema = {
    form_data: {
        passport: {
            data_type: 'image',
            name: 'passport',
            placeholder: "",
            required: true,
            file_category: 'sponsor_passport'
        },
        title: {
            data_type: 'dropdown_selected_text',
            name: 'title',
            placeholder: "e.g Mr, Mrs, Prof, Dr",
            options: ['Mr', 'Mrs', 'Miss', 'Prof', 'Dr', 'Chief'],
            required: true
        },
        surname: {
            data_type: 'text',
            name: 'surname',
            placeholder: "Surname",
            required: true
        },
        first_name: {
            data_type: 'text',
            name: 'first_name',
            placeholder: "First Name",
            required: true
        },
        relationship: {
            data_type: 'radio_selected_text',
            options: [
                'Father',
                'Mother',
                'Guardian'
            ],
            name: 'relationship'
        },
        occupation: {
            data_type: 'text',
            name: 'occupation',
            placeholder: "occupation",
        },
        residential_address: {
            data_type: 'long_text',
            name: 'residential_address',
            placeholder: "",
            required: true
        },
        state_of_residence: {
            data_type: 'text',
            name: 'state_of_residence',
            placeholder: "",
            required: true
        },
        local_government: {
            data_type: 'text',
            name: 'local_government',
            placeholder: "",
            required: true
        },
        zip_code: {
            data_type: 'text',
            name: 'zip_code',
            placeholder: ""
        },

        main_contact: {
            data_type: 'text',
            name: 'main_contact',
            placeholder: "Main Contact Number",
            required: true
        },

        other_contact: {
            data_type: 'text',
            name: 'other_contact',
            placeholder: "Alternative contact",
        },

        email: {
            data_type: 'email_text',
            name: 'email',
            placeholder: "Email Address",
            required: true
        },

    },
    groups: [
        [
            ['passport', 'title', 'surname', 'first_name'],
            ['relationship', 'occupation', 'main_contact', 'other_contact', 'email']
        ],
    ],
}
// Set


const dt = new Date()
const yr = dt.getFullYear();


const NewSetFormConfig = {
    form_data:{
        label: {
            required: true,
            data_type: "text",
            name: "label",
            label: "Set's Label",
            placeholder: `for example: Set ${yr}/${yr + 1}`,
        },
        name: {
            required: false,
            data_type: "text",
            name: "name",
            label: "Set's name",
            placeholder: "Enter a name to identify this class set",
        },
    },
};


const NewSessionFormConfig = {
    form_data: {
        title: {
            data_type: 'text',
            name: 'title',
            placeholder: `e.g ${yr}/${yr + 1}`,
            required: true,
        },

        label: {
            data_type: 'text',
            name: 'label',
            placeholder: `e.g ${yr}/${yr + 1} Academic Session`,
            required: true
        },
        date_started: {
            data_type: 'date',
            name: 'date_started',
            required: true
        },
        // auto_promote_students: {
        //     data_type: 'checked_text',
        //     name: 'auto_promote_students',
        //     label: 'Auto promote students',
        // }

    }
};




export { 
    InitializeSchoolFormConfig, LoginFormConfig, 
    UserCreationFormConfig, NewSetFormConfig, 
    NewSessionFormConfig, form_configs_options,
    StaffsDataSchema, UserUpdateFormConfig,
    StudentDataSchema, SponsorDataSchema,
}