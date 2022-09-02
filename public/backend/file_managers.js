const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const {app_files_dir} = require('./base');


const images_dir_path = path.join(app_files_dir, "images");
const partial_images_dir_path = (filename)=> path.join("images",filename);

const ImageManager = (filepath, configurations) => {

    let { file_name } = configurations;
    let format = path.extname(filepath);

    // console.log(format);

    if (!file_name) {
        file_name = 'img';
    }

    let fileName = `${file_name}_${new Date().getTime()}${format}`
    
    const file_path = path.resolve(images_dir_path, fileName);

    if (!fs.existsSync(images_dir_path)) {
        fs.mkdirSync(images_dir_path, { recursive: true })
    }

    return new Promise((resolved,rejected)=>{
        // console.log(filepath, full_path)
        sharp(filepath)
            .toFile(file_path)
            .then(() => {
                // Can Log image info with info parameter passed to this callback
                // console.log("Image Object =>", info)
                resolved(partial_images_dir_path(fileName));
                return;
            }).catch(err => {
                console.log(err)
                rejected(err)
            })
    });    

}


module.exports = { ImageManager };