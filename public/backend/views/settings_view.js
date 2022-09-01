const { dbFactory } = require('../base');

const settingsDb = dbFactory('settings.db')


class Settings {

    __settings_pattern = {
        school:'school',
        sessions:'sessions',
        subjects: 'subjects',
        staffs: 'staffs',
    }


    constructor() {

        this.initialize = async () => {

            console.log(`Setting up backend...`);

            /* 
                Check the settings pattern, check through the settings,
                if a particular setting can't be found, create it
            */


            for (let field in this.__settings_pattern){
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

        this.update = async(setting_name, data) => { 
            // Find the setting
            let prev_setting = await this.get(setting_name, true)

            if (!prev_setting) return null // TODO: THROW ERROR

            
            // update the data
            prev_setting.setting_data = data
            await settingsDb.update({setting_name},{...prev_setting})

            return prev_setting;

        }

        this.get = async (setting_name,raw=false) => {

            // console.log(`get ${setting_name} settings`);

            let doc = await settingsDb.findOne({ setting_name });

            // if not raw, return the serialized version of the document
            // otherwise return the document as queried
            return !raw ? this.serialize(doc) : doc; //setting_data

        }

        this.all = async () => {

            let docs = await settingsDb.find({}, { multi: true });

            return this.serialize(docs);

        }


        this.reset = async() => {
            // Set everything to null
            for (let field in this.__settings_pattern) {                


                const st_dt = {
                    setting_name: field,
                    setting_data: null
                }

                // add it to the settings
                await settingsDb.remove({},{multi:true});
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


    __exists = async(setting_name)=>{
        const count = await settingsDb.count({setting_name})
        return count > 0;
    }



}


module.exports = {
    Settings
}