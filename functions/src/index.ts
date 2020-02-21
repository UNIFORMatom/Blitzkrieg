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
    const contentType = object.contentType;
    

    if (contentType?.startsWith('image/')){
        console.log('not a text file');
    }
    //downloading file
    const fileName = path.basename(filePath);
    const bucket = admin.storage().bucket(fileBucket);
    const tempFilePath = path.join(os.tmpdir(), fileName);

    const metadata = {
        contentType: contentType,
      };

    await bucket.file(filePath).download({destination: tempFilePath});
    console.log('File downloaded locally to', tempFilePath);

    const myNewFile = new File(fileName, 'tempname.txt', {type: 'txt'});

    const tempFilePath1 = path.join(path.dirname(filePath), myNewFile);
    await bucket.upload(tempFilePath, {
        destination: tempFilePath1,
        metadata: metadata,
    });
    return fs.unlinkSync(tempFilePath);

 });
