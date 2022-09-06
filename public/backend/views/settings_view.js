const { dbFactory } = require('../base');
const nanoid = require('nanoid');
const settingsDb = dbFactory('settings.db')
const staffsDb = dbFactory('staffs.db')


class Settings {

    __settings_pattern = {
        school:{
            name:'school',
            default: null, // object
        },

        sessions:{
            name:'sessions',
            default:{
                no_of_terms:3, // session categories
                verbose:"Term", // session category name
                pass_mark:0.4, // 40% to promote
                auto_promote:true, // auto promote students
            },
        },

        grades: {
            name: 'grades',
            default: [
                { _id: nanoid.nanoid(), key: '70-100', value: 'A', remark: 'EXCELLENT' },
                { _id: nanoid.nanoid(), key: '60-69', value: 'B', remark: 'VERY GOOD' },
                { _id: nanoid.nanoid(), key: '50-59', value: 'C', remark: 'GOOD' },
                { _id: nanoid.nanoid(), key: '45-49', value: 'D', remark: 'FAIR' },
                { _id: nanoid.nanoid(), key: '0-44', value: 'F', remark: 'FAILED' }
            ]
        },

        attrs: {
            name: 'attrs',
            default: {
                keys: [
                    { _id: nanoid.nanoid(), value: 'Obedience' },
                    { _id: nanoid.nanoid(), value: 'Honesty' },
                    { _id: nanoid.nanoid(), value: 'Self control' },
                    { _id: nanoid.nanoid(), value: 'Self reliance' },
                    { _id: nanoid.nanoid(), value: 'Use of initiative' },
                ],

                mappings: [
                    {
                        _id: nanoid.nanoid(),
                        point: 1,
                        value: 'Not Reponsible'
                    },

                    {
                        _id: nanoid.nanoid(),
                        point: 2,
                        value: 'Fairly responsible',
                    },

                    {
                        _id: nanoid.nanoid(),
                        point: 3,
                        value: 'Shows Signs of Responsibility',
                    },

                    {
                        _id: nanoid.nanoid(),
                        point: 4,
                        value: 'Responsible',
                    },
                    {
                        _id: nanoid.nanoid(),
                        point: 5,
                        value: 'Very Responsible',
                    },

                ]
            }
        },

        subjects: {
            name:'subjects',
            default: {
                [nanoid.nanoid()]: {
                    name: 'Mathematics',
                    short: 'MTH',
                    description: 'An abstract science',
                    staffs: [], // list of staffs teaching this subject
                    total_obtainable: 100,
                    required: true,
                },
                [nanoid.nanoid()]: {
                    name: 'English',
                    short: 'ENG',
                    description: 'English studies',
                    staffs: [], // list of staffs teaching this subject
                    total_obtainable: 100,
                    required: true,
                    
                },
                [nanoid.nanoid()]: {
                    name: 'Computer',
                    short: 'COMP',
                    description: 'Study of computer',
                    staffs: [], // list of staffs teaching this subject
                    total_obtainable: 100,
                    required: true,
                },
            },
        },

        
        levels: {
            name:'levels',
            default: {
                [nanoid.nanoid()]: {
                    label: 'Preparatory',
                    subjects: [],
                },
                [nanoid.nanoid()]: {
                    label: 'Grade 1',
                    subjects: [],
                },
                [nanoid.nanoid()]: {
                    label: 'Grade 2',
                    subjects: [],
                },
                [nanoid.nanoid()]: {
                    label: 'Grade 3',
                    subjects: [],
                },
                
            },
        },

        roles:{
            name:'roles',
            default:{
                school_head:{
                    label:"Head Master",
                    staff_id:null
                },
                level_roles:[]
            },
        },

        staffs: {
            name:'staffs',
            default:[]
        }, // array
    }

    /* 
        * School data
        {
            - logo: str,
            - name: str,
            - description: str,
            - motto: str,
            - address: str,
            - state: str,
            - city: str,
            - zipcode: str,
            - country: str, 
            - contacts: str,
            - email: str,
            - website: str,
        } 
    */


    constructor() {

        this.initialize = async () => {

            console.log(`Setting up backend...`);

            /*
                Check the settings pattern, check through the settings,
                if a particular setting can't be found, create it
            */


            for (let [field_name, field_config] of Object.entries(this.__settings_pattern)){
                

                if (field_name === this.__settings_pattern.staffs.name) continue;

                
                // exists return 
                const exists = await this.__exists(field_name)
                
                // if the setting exists
                if (exists) continue // continue to the next

                // otherwise create the setting
                const st_dt = {
                    setting_name: field_config.name,
                    setting_data: field_config.default
                }

                // add it to the settings
                await settingsDb.insert(st_dt)
            }

            return 

        }
        
        this.get = async (setting_name, raw = false) => {

            let doc = await settingsDb.findOne({ setting_name });

            // if not raw, return the serialized version of the document
            // otherwise return the document as queried
            return !raw ? this.serialize(doc) : doc; //setting_data

        }

        this.update = async(setting_name, data) => { 

            // Update/Create Staff
            if (setting_name === this.__settings_pattern.staffs.name) {
                const { _id, ...rest_data } = data;

                if (!_id) {
                    // Create staff
                    const new_staff = await staffsDb.insert({ ...rest_data });

                    return this.serializeNonSettings(new_staff);

                } else {
                    // update staff
                    await staffsDb.update({ _id }, { ...rest_data });

                    return null;
                }

            }


            // Find the setting
            let prev_setting = await this.get(setting_name, true)

            if (!prev_setting) return null // TODO: THROW ERROR    
            
            // update normal settings
            prev_setting.setting_data = { ...prev_setting.setting_data,...data}
            await settingsDb.update({setting_name},{...prev_setting})

            return null;

        }

        this.delete = async(setting_name, _id) => { 

            // Delete Staff
            if (setting_name === this.__settings_pattern.staffs.name) {

                await staffsDb.remove({_id});
                return null;

            }

        }

        
        this.all = async () => {

            const other_settings = await settingsDb.find({}, { multi: true });
            const staffs = await staffsDb.find({}, { multi: true });

            const docs = [
                ...other_settings,
                {
                    setting_name: this.__settings_pattern.staffs.name,
                    setting_data: this.serializeNonSettings(staffs)
                }
            ]


            return this.serialize(docs);

        }


        this.reset = async() => {
            // Set everything to null
            await settingsDb.remove({}, { multi: true });
            await staffsDb.remove({}, { multi: true });

            for (let field in this.__settings_pattern) {                

                if (field === this.__settings_pattern.staffs.name) continue;

                const st_dt = {
                    setting_name: field,
                    setting_data: null
                }

                // add it to the settings
                await settingsDb.insert(st_dt);
            }

            return
        }
 
    }



    serialize = (document) => {


        if (document === null) return

        // incase of mutiple setting_data

        if (Array.isArray(document)){
            const settings_documents = {};

            document.forEach((each) => {

                let { setting_name, setting_data } = each;

                
                settings_documents[setting_name] = setting_data;

            });

            return settings_documents;
        }

        // otherwise, if single document
        return document.setting_data
    }


    serializeNonSettings = (document) => {

        if (!document) return null

        if (!Array.isArray(document)) {
            const { createdAt, updatedAt } = document;

            if (Boolean(createdAt)) {
                document.createdAt = createdAt.toISOString();
            }

            if (Boolean(updatedAt)) {
                document.updatedAt = updatedAt.toISOString();
            }

            return document;
        }

        document = document.map((each) => {
            const { createdAt, updatedAt } = each;

            // each.createdAt = createdAt.toISOString();
            // each.updatedAt = updatedAt.toISOString();

            if (Boolean(createdAt)) {
                each.createdAt = createdAt.toISOString();
            }

            if (Boolean(updatedAt)) {
                each.updatedAt = updatedAt.toISOString();
            }

            return each;
        })

        return document
    }



    __exists = async(setting_name)=>{
        const count = await settingsDb.count({setting_name})
        return count > 0;
    }



}


module.exports = {
    Settings
}