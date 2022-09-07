const { dbFactory } = require('../base');

const setsDb = dbFactory('sets.db')
const studentsDb = dbFactory('students.db')
// Sets

class SchoolSet {

    constructor() {

        this.create = async (set_data) => {

            const {name, label} = set_data;

            const any_set_name = await setsDb.findOne({name});

            if(Boolean(any_set_name)){
                throw Error("Set name already exists");
            }

            const any_set_label = await setsDb.findOne({ label });

            if (Boolean(any_set_label)) {
                throw Error("Set label already exists");
            }

            
            let doc = await setsDb.insert(set_data);

            return this.serialize(doc)

        }

        this.update = async ({_id, ...data}) => {

            // Find the setting
            let prev_set_data = await this.get(_id)

            if (!prev_set_data) return null;


            // update the data
            const updated_data = { ...prev_set_data, ...data }

            try{
                await setsDb.update({ _id }, updated_data)
            }catch (err){
                console.error(err);
            }

            return updated_data

        }

        this.delete = async (_id) => {
            const res = await setsDb.remove({ _id });

            return res

        }

        this.all = async () => {

            let docs = await setsDb.find({}, { multi: true });

            return this.serialize(docs);

        }

        this.get = async (_id) => {

            let doc = await setsDb.findOne({ _id });

            if(!doc) return null;

            const stats = await this.get_stats(doc);

            return {
                ...doc,
                stats
            }

        }

        
        this.query = async (query, many=false) => {

            let doc;

            if (many){
                doc = await setsDb.find({ ...query },{multi:true});
            }else{
                doc = await setsDb.findOne({ ...query });
            }

            

            return this.serialize(doc);

        }

        // Students

        this.save_student = async(data)=>{
            // student_data.set_id = set_id;
            
            const { _id } = data;

            const std = await studentsDb.findOne({ _id });

            if(!Boolean(std)){
                const doc = await studentsDb.insert({ ...data });
                
                return doc;
            }

            await studentsDb.update({ _id }, { ...data}, {upsert:true});

            return data;

        }

        this.load_students = async (set_id) => {
            let docs = await studentsDb.find({ set_id });
            
            return this.serialize(docs, true);

        }

        this.load_admitted_students = async (set_id) => {

            let docs = await studentsDb.find({ set_id, admission_no: { $ne: null } }, {multi:true});

            return this.serialize(docs, true);

        }


        // Sponsors
        this.save_sponsor = async (student_id, data) => {

            await studentsDb.update({ _id: student_id }, { sponsor:data });

            return data;

        }

        this.reset = () => { }
    }


    serialize = (document, students=false) => {

        if (!document) return null

        if(!Array.isArray(document)){
            const { createdAt, updatedAt  } = document;

            if(Boolean(createdAt)){
                document.createdAt = createdAt.toISOString();
            }

            if (Boolean(updatedAt)) {
                document.updatedAt = updatedAt.toISOString();
            }

            return document;
        }

        document = document.map((each)=>{
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

    get_stats = async(set_data) => {
        if (!set_data) return null;

        const { _id: set_id } = set_data;

        const students = await this.load_admitted_students(set_id);
        let male = 0;
        let female = 0;

        students.forEach(student => {
            if (student.gender === 'male') {
                male += 1;
            } else if (student.gender === 'female') {
                female += 1;
            }
        });

        return {
            male,
            female,
            total: students.length,
        }
    }



    __exists = async (query = null) => {
        if (query === null) {
            // check if there is at least a document
            const ex = await setsDb.find({})

            return ex.length > 0;
        }

        const count = await setsDb.count(query)
        return count > 0;
    }



}




module.exports  = {
    SchoolSet
}