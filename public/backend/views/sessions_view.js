const { dbFactory } = require('../base');

const sessionsDb = dbFactory('sessions.db')
const termsDb = dbFactory('terms.db')
const termRecordsDb = dbFactory('termRecords.db')


// Sessions
class Sessions {

    /* 
        * Session Data
        {
            - label:string,
            - title: string,
            - date_started:data,
            - date_closed: date, // if null, that means the session is ongoing
            - settings:{
                - terms:{
                    1:[term_id],
                    ...
                },
                - levels:{
                    [level_id]:{
                        - set_id: string,
                    },
                    ...
                },
                - roles:{ 
                    - school_head:...,
                    - levels:...,
                    - subjects:...,
                }
            }
        }


        
        * Session Term
        {
            - label: string,
            - date_started: Date,
            - date_concluded:Date,
            - session_id:String,
            - term_index:int,
            - no_of_times_opened:int,
            - next_term_begins:Date // ends the term
        }


        * Session Term Student Record
        {
            - term_id: string,
            - student_id: string,
            - level_id: string, 
            - subjects:
                [
                    ...subject_info,
                    - ca: number,
                    - exam:number,
                ],
            - attendance:
                - no_of_times_present: number,
                - no_of_times_absent: number,
            - remarks:
                - school_head:
                    - staff:...details,
                    - remark: string,
                    - role_label: string,
                - level_head:
                    - staff:...details,
                    - remark: string,
                    - role_label: string,
                
            - attr:
                [
                    - key_id:,
                    - point:
                ]
            ...other_meta_data
        }

    */



    constructor(){

        this.create = async (session_data) => {
            const {title, label} = session_data;

            // Check if session already exists
            const title_exists = await sessionsDb.findOne({title});

            if(Boolean(title_exists)){
                throw Error("Session title already exists");
            }

            const label_exists = await sessionsDb.findOne({ label });

            if (Boolean(label_exists)) {
                throw Error("Session label already exists");
            }


            // Prepare Session data
            let doc = await sessionsDb.insert(session_data);


            return this.serialize(doc);
        }


        this.all = async() => {
            let docs = await sessionsDb.find({}, { multi: true });
            return this.serialize(docs);
        }


        this.get = async (_id) => {

            let doc = await sessionsDb.findOne({ _id });

            return this.serialize(doc);
        }

        this.update = async ({ _id, ...updates_session_data }) => {

            let prev_doc = await sessionsDb.findOne({ _id });

            if (!prev_doc) return null;// Error

            await sessionsDb.update({ _id }, { ...prev_doc, ...updates_session_data });

            return { _id, ...updates_session_data }; //this.serialize({ _id, ...prev_doc, ...updates_session_data });
        }

        // Terms
        this.createTerm = async (term_data) => {

            // Prepare Session data
            let doc = await termsDb.insert(term_data);

            return this.serialize(doc);
        }

        this.getTerms = async (session_id) => {

            let doc = await termsDb.find({ session_id });

            return this.serialize(doc);
        }

        this.updateTerm = async (term_data) => {

            const {_id} = term_data;



            await termsDb.update({ _id }, { ...term_data });

            return term_data; //this.serialize(doc);
        }

        this.getTerm = async (term_id) => {

            let doc = await termsDb.findOne({ _id:term_id });

            return this.serialize(doc);
        }

        this.queryTerm = async (query) => {

            let doc = await termsDb.findOne(query);

            return this.serialize(doc);
        }

        // Term record
        this.createTermRecord = async (term_record_data) => {
            
            // Prepare Session data
            let doc = await termRecordsDb.insert(term_record_data);

            return this.serialize(doc);
        }

        this.updateTermRecord = async (term_record_data) => {


            const {_id} = term_record_data;

            // get previous data
            const prev = await termRecordsDb.findOne({_id});

            if (!Boolean(prev)) return term_record_data;

            await termRecordsDb.update({_id}, {...prev, ...term_record_data});

            return { ...prev, ...term_record_data } //this.serialize(doc);
        }

        this.getTermRecord = async ({ term_id, student_id }) => {


            // get previous data
            const doc = await termRecordsDb.findOne({ term_id, student_id});

            return this.serialize(doc);
        }

        this.queryTermRecord = async (query) => {


            // get previous data
            const doc = await termRecordsDb.find(query);

            return this.serialize(doc);
        }
    }

    serializeSessionData = async(new_session_data)=>{
        const {auto_promote_students, ...session_data} = new_session_data;

    }

    proccessLevelData = ()=>{

    }


    serialize = (document) =>{
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


    proccessReport = ({school, student, })=>{

    }

}



module.exports = {
    Sessions,
}