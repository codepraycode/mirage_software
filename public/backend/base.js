const { app } = require('electron');
const Datastore = require('nedb-promises');
const path = require('path');

// =============== SETUP ==================

const appUserDir = app.getPath('documents');

// In Production, use userData path to store db
// in Development, use the public folder
const isPacked = app.isPackaged;

const app_db_dir = path.join(appUserDir, "mirage_software_data", "db")

// isPacked ? 
//         path.join(appUserDir, "mrgdt","db") : path.join(__dirname,'../../data/db')


const dbFactory = (db_name)=>{
    // let filename = path.join(app_db_dir, db_name)
    return Datastore.create({
        autoload: true,
        filename: path.join(app_db_dir, db_name),
        timestampData:true
    })

    // return datastore
}





module.exports = {
    dbFactory,
}


