const { dbFactory } = require('../base');

const accountsDb = dbFactory('accounts.db')


class Account {

    constructor() {
        
        this.addUpdate = async (user_data) => {

            const {confirm_password, ...user} = user_data;

            const {username, email,...rest} = user;

            const anyuser = await this.query({ $or: [{ username: username }, { email: email }] }, false);

            if (Boolean(anyuser)) {
                throw Error("username or email already exists");
            }

            let doc = await accountsDb.update({ username }, {...user}, {upsert:true});

            return this.serialize(doc);

        }

        this.authenticate = async ({username,password}) =>{
            const user = await this.query({ $or: [{ username: username }, { email: username }] }, false);

            if(!Boolean(user)) {
                throw Error("username or email does not exists");
            }

            
            if (user.password.toLowerCase() !== password.toLowerCase()) {
                throw Error("Incorrect password");
            }

            const last_logged_in = new Date().toISOString();

            await accountsDb.update({ username: user.password }, { last_logged_in });

            return {
                ...user,
                last_logged_in
            }


        }

        this.query = async (query={}, many=true) => {

            if(!many){
                let doc = await accountsDb.findOne({ ...query });

                return this.serialize(doc);
            }

            let doc = await accountsDb.find({ ...query });

            return this.serialize(doc);

        }
    }


    serialize = (document) => {
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
        };

        return document.map((each) => {
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
        });
    }

}


module.exports = {
    Account
}