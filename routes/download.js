const router = require('express').Router()
const File = require('../model/file');

router.get('/:uuid', async (req, res) => {

    // First we are checking the file uuid is present in our database or not
    const file = await File.findOne({uuid: req.params.uuid})
    // if not then 
    if(!file){
        return res.render('download', {error: 'Link has been expired.'});
    }
    // if yes ...
    // Here we are fetching the file from the database 
    const filePath = `${__dirname}/../${file.path}`
    // here res.download is make the file to get download.
    res.download(filePath);

})

module.exports = router;