const express = require('express');
const router = express.Router();
const hellosign = require('hellosign-sdk')({ email_address: "xxx@xxx.com", password: "{YOUR PASSWORD}" });
const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './tosign');
    },
    filename: function (req, file, cb) {
        cb(null , file.originalname);
    }
});

const upload = multer({ storage: storage });

var signatureRequestId = '';
var IsSignatureRequestComplete = false;

hellosign.account.update({
    callback_url: process.env.HOST_URL+'/api/callback'
}).then((res) => {
    console.log("--- Account Update ---");
    console.log(res);
}).catch((err) => {
    console.log(err)
});

router.post('/callback',(req,res)=>{
    res.send('Hello API Event Received');
    console.log("--- Callback Response  ---");
    console.log(res);
});

router.post('/sign', upload.single('file'), (req,res)=>{

    res.send('Sign request is called');
    console.log('Sign request is called');

    console.log(req);

    var title = req.body.title;
    var subject = req.body.subject;
    var message = req.body.message;
    var email_address = req.body.email_address;
    var name = req.body.name;
    var file = req.file.originalname;

    console.log(file);

    const opts = {
        test_mode: 1,
        title: title,
        subject: subject,
        message: message,
        signers: [
            {
                email_address: email_address,
                name: name
            }
        ],

        files: ['./tosign/'+file]
    };

    console.log(opts);
    hellosign.signatureRequest.send(opts).then((res) => {
        console.log(res);
        signatureRequestId = res.signature_request.signature_request_id;
        console.log('Signature Request Id: '+signatureRequestId);
    }).catch((err) => {
        console.log(err)
    });
});

router.post('/sign/status',(req,res)=>{

    res.send('Sign status');

    hellosign.signatureRequest.get(signatureRequestId).then((res) => {
        console.log(res);
        res.send(res);
        IsSignatureRequestComplete = res.signature_request.is_complete;
        console.log('Is Signature Request Complete:'+IsSignatureRequestComplete);
    }).catch((err) => {
        console.log(err)
    });
});

router.get('/download/file',(req,res)=>{

    res.send('Download request is called');
    try {
        console.log('download request is called');
        console.log('SID: '+signatureRequestId);

        console.log('Is Signature Request Complete:'+IsSignatureRequestComplete);
        if(IsSignatureRequestComplete){
            hellosign.signatureRequest.download(signatureRequestId, (err, res) => {
                const file = fs.createWriteStream("./downloads/files/"+signatureRequestId + '_file.pdf');

                res.pipe(file);

                file.on('finish', () => {
                    file.close();
                    console.log("Downloaded");
                });
            });
        }else{
            console.log('Please wait for the signing process to be completed to download the document.');
        }
    }catch (e) {
        console.log(e);
    }
});

router.get('/download/folder',(req,res)=>{

    res.send('Download request is called');
    try {
        console.log('download request is called');

        if(IsSignatureRequestComplete){
            hellosign.signatureRequest.download(signatureRequestId, { file_type: 'zip' }, (err, res) => {
                const file = fs.createWriteStream("./downloads/folders/"+signatureRequestId+"_folder.zip");

                res.pipe(file);

                file.on('finish', () => {
                    file.close();
                    console.log("Downloaded");
                });
            });
        }else{
            console.log('Please wait for the signing process to be completed to download the document.');
        }

    }catch (e) {
        console.log(e);
    }
});

router.get('/', (req, res) => {
    res.send("Server is listening.");
});

module.exports = router;
