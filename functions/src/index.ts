import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
//import { object } from 'firebase-functions/lib/providers/storage';
admin.initializeApp()
//const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');

export const getUpdatedBalance = functions.storage.object().onFinalize(async (object) => {
  
    const fileBucket = object.bucket;
    const filePath:string = object.name!;
    //const contentType = object.contentType;
    
    const newMetadata = {
        contentType: 'text/plain',
    };

//downloading file
    const fileName = path.basename(filePath);
    const bucket = admin.storage().bucket(fileBucket);
    const tempFilePath = path.join(os.tmpdir(), fileName);

    await bucket.file(filePath).download({destination: tempFilePath})
    .then( downloaded => {
        console.log("File successfully downloaded: ", fileName);
    } )
    .catch( dnfailed => {
        console.log("file download failed: ", fileName);
    })
    console.log('File downloaded locally to', tempFilePath);

//changing metadata in the servers local storage
    fileName.updateMetadata(newMetadata).then( function(metadata: any) {
        console.log('metadata changed: ', metadata)
    })
    .catch( function(error: any) {
        console.log('error', error)
    } )

    ///const myFile = fileName;
    fs.readFile(fileName, (err: any, data: any) => {
        if(err) throw err;
        console.log(data.toString());
    })

//uploading the new file back to firebase storage
    const tempFilePath1 = path.join(path.dirname(filePath), fileName);
    await bucket.upload(tempFilePath, {
        destination: tempFilePath1,
        metadata: newMetadata,
    })
    .then( uploaded => {
        console.log("file successfully uploaded: ", fileName)
    })
    .catch( upfailed => {
        console.log('file upload failed: ', fileName)
    })
    return fs.unlinkSync(tempFilePath);

 });
