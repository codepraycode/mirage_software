const { dbFactory } = require('../base');

const sessionsDb = dbFactory('sessions.db')
const termsDb = dbFactory('terms.db')


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


        this.getTerm = async (term_id) => {

            let doc = await termsDb.findOne({ _id:term_id });

            return this.serialize(doc);
        }

        this.queryTerm = async (query) => {

            let doc = await termsDb.findOne(query);

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

}



module.exports = {
    Sessions,
}