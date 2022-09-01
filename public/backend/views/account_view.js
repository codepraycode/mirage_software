const { dbFactory } = require('../base');

const accountsDb = dbFactory('accounts.db')


class Account {

    constructor() {
        
        this.addUpdate = async (user_data) => {

            const {confirm_password, ...user} = user_data;

            const {username, ...rest} = user;



            let doc = await accountsDb.update({ username }, {username, ...rest}, {upsert:true});

            return doc;

        }

        this.authenticate = async ({username,password}) =>{
            const user = this.query({ $or: [{ username: username }, { email: username }] });

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

        this.query = async (query) => {

            let doc = await accountsDb.find({ ...query });

            return doc //this.serialize(doc);

        }
    }


}


module.exports = {
    Account
}