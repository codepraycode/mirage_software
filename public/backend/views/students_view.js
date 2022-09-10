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

            await studentsDb.update({ _id }, { ...std,...data}, {upsert:true});

            return data;
        }

        this.admit_student = async ({student_id, admission_no}) => {
        
            // Verify admission number had not been used
            const alreadyUsed = await studentsDb.findOne({ admission_no: String(admission_no).toLowerCase() });

            if (Boolean(alreadyUsed)) {
                throw Error(`Admission number already assigned to "${alreadyUsed.first_name} ${alreadyUsed.last_name}"`);
            }

            const std = await studentsDb.findOne({ _id: student_id });

            if (!Boolean(std)) {
                throw Error("Could not resolve student");
            }

            await studentsDb.update({ _id: student_id }, { ...std, admission_no });

            return null;
        }

        this.delete_student = async(_id)=>{
            // student_data.set_id = set_id;
            await studentsDb.remove({ _id });

            return null;
        }

        this.load_students = async (set_id) => {
            let docs = await studentsDb.find({ set_id });
            
            return this.serialize(docs, true);
        }


        this.load_student = async (_id) => {
            let docs = await studentsDb.findOne({ _id });
            
            return this.serialize(docs, true);

        }

        this.load_admitted_students = async () => {

            let docs = await studentsDb.find({ admission_no: { $ne: null } }, {multi:true});

            return this.serialize(docs, true);
        }

        
        // Sponsors
        this.save_sponsor = async (_id, sponsor) => {
            let student = await studentsDb.findOne({ _id });

            if(!Boolean(student)) return null // Error

            await studentsDb.update({ _id }, { ...student, sponsor });

            return sponsor;
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

        const students = await this.load_students(set_id);

        let total = 0;
        let total_male = 0;
        let total_female = 0;
        
        let admitted_male = 0;
        let admitted_female = 0;

        students.forEach(student => {
            total += 1;

            if (student.gender === 'male') {
                total_male += 1;

                if(Boolean(student.admission_no)){
                    admitted_male += 1;
                }

            } else if (student.gender === 'female') {
                total_female += 1;

                if (Boolean(student.admission_no)) {
                    admitted_female += 1;
                }
            }
        });


        return {
            total,
            total_male,
            total_female,
            admitted_male,
            admitted_female,
            admitted_total: admitted_male + admitted_female
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