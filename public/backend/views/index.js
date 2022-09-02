const { app_files_dir } = require('../base');
const { Settings } = require('./settings_view');
const { Account } = require('./account_view');
const { SchoolSet } =require('./students_view');
const { Sessions } = require('./sessions_view');


module.exports={
    Settings,
    Account,
    Sessions,
    SchoolSet,

    app_files_dir,
    
}