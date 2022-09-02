const { app } = require('electron');
const Datastore = require('nedb-promises');
const path = require('path');

// =============== SETUP ==================

const appDocumentDir = app.getPath('documents');
const app_data_dir = path.join(appDocumentDir, ".mirage_software_data")

const app_db_dir = path.join(app_data_dir, "db")
const app_files_dir = path.join(app_data_dir, "files");


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
    app_files_dir,
}


