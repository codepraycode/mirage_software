const { dbFactory } = require('../base');

const settingsDb = dbFactory('settings.db')
const staffsDb = dbFactory('staffs.db')


class Settings {

    __settings_pattern = {
        school:'school', // object
        sessions:'sessions',
        subjects: 'subjects',
        staffs: 'staffs', // array
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


            for (let field in this.__settings_pattern){

                if (field === this.__settings_pattern.staffs) continue;

                // exists return 
                const exists = await this.__exists(field)
                
                // if the setting exists
                if (exists) return // continue to the next

                // otherwise create the setting
                const st_dt = {
                    setting_name: field,
                    setting_data: null
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
            if ([this.__settings_pattern.staffs].includes(setting_name)) {
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
            prev_setting.setting_data = data
            await settingsDb.update({setting_name},{...prev_setting})

            return null;

        }


        this.all = async () => {

            const other_settings = await settingsDb.find({}, { multi: true });
            const staffs = await staffsDb.find({}, { multi: true });


            const docs = [
                ...other_settings,
                {
                    setting_name: this.__settings_pattern.staffs,
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

                if (field === this.__settings_pattern.staffs) continue;

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
        
        // console.log("Serializing:> ", document)

        if (document === null) return

        // incase of mutiple setting_data

        if (Array.isArray(document)){
            const settings_documents = {};

            document.forEach((each) => {

                let { setting_name, setting_data } = each;

                // return {
                //     setting_name,
                //     data: setting_data
                // }
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