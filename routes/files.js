const router = require('express').Router();
const multer = require('multer')
const path = require('path')
const File = require('../model/file')
const { v4 : uuid4 } = require('uuid');
const { diskStorage } = require('multer');

// For storing the uploaded file or for file upload in our database.
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        // 16186416161-516514613165.zip
        // Datenow- current tome stamp , math.random = it will genarate number between 0-1 and we multiply it by 1 billion and round it off
        // at last we can genrate extname(extention name)
        cb(null, uniqueName);
    }
})

const upload = multer({
    storage,

    limit:{ fileSize: 1000000 * 100},

}).single('myfile');



// Post route
router.post('/', (req, res) => {

    // store file
    upload(req, res, async (err) => {
         // Validate request
        if(!req.file){
            return res.json({error : 'All field are required.'})
        }

        if(err) {
            return res.status(500).send({ error : err.message})
        }
    
        // store into database
        const file = new File({
            filename: req.file.filename,
            uuid: uuid4(),
            path: req.file.path,
            size : req.file.size 
        })

        const response = await file.save();

        //Response ----> link
        return res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}`})
        // http://localhost:3000/files/23463hjsdgfgj
    });  


})
 


router.post('/send', async (req, res) => {
    const { uuid, emailTo, emailFrom } = req.body;
    if(!uuid || !emailTo || !emailFrom) {
        return res.status(422).send({ error: 'All fields are required except expiry.'});
    }
    // Get data from db 
    try {
      const file = await File.findOne({ uuid: uuid });
      if(file.sender) {
        return res.status(422).send({ error: 'Email already sent once.'});
      }
      file.sender = emailFrom;
      file.receiver = emailTo;
      const response = await file.save();

      // send mail
      const sendMail = require('../services/mailService');
      sendMail({
        from: emailFrom,
        to: emailTo,
        subject: 'AnyShare file sharing',
        text: `${emailFrom} shared a file with you.`,
        html: require('../services/emailTemplate')({
                  emailFrom, 
                  downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}?source=email` ,
                  size: parseInt(file.size/1000) + ' KB',
                  expires: '24 hours'
              })
      }).then(() => {
        return res.json({success: true});
      }).catch(err => {
        return res.status(500).json({error: 'Error in email sending.'});
      });
  } catch(err) {
    return res.status(500).send({ error: 'Something went wrong.'});
  }
  
  });

module.exports = router;