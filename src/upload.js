const fs = require('fs');

module.exports = function(oldPath, name){
    let newPath = __dirname + '/public/images/' + name;
    fs.copyFile(oldPath, newPath, function (err) {
        if (err) {
            return console.error(err);
        }
        console.log('Upload successfully!');  
    })
}