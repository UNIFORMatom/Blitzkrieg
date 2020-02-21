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
    
    const metadata = {
        contentType: 'text/plain',
    };

    //downloading file
    const fileName = path.basename(filePath);
    const bucket = admin.storage().bucket(fileBucket);
    const tempFilePath = path.join(os.tmpdir(), fileName);

    await bucket.file(filePath).download({destination: tempFilePath});
    console.log('File downloaded locally to', tempFilePath);

    //const myNewFile = 'new_${fileName}';
    const tempFilePath1 = path.join(path.dirname(filePath), fileName);
    await bucket.upload(tempFilePath, {
        destination: tempFilePath1,
        metadata: metadata,
    });
    return fs.unlinkSync(tempFilePath);

 });
