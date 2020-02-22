import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
//import { Storage } from '@google-cloud/storage';
//import { object } from 'firebase-functions/lib/providers/storage';
admin.initializeApp()
//const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');
const readline = require('readline');

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
    .then( download => {
        console.log('donwloaded: ', fileName);
    })
    .catch( dnfailed => {
        console.log('download failed: ', fileName)
    })
    console.log('File downloaded locally to', tempFilePath);

    //const dir = (tempFilePath);
    fs.rename(tempFilePath, '/tmp/myrenamedfile.txt', function (err: any) {
        if (err) throw err;
        console.log('File Renamed!');
    });
/*
    const readInterface = readline.createInterface({
        input: fs.createReadStream('/tmp/myrenamedfile.txt'),
        output: process.stdout,
        console: false
    });

    let pipecount;
    let amount: string;
    let phno: string;
    readInterface.on('line', function(line: any) {
        console.log(line);
        for(let i = 0; i < line.length; i++){
            pipecount = 0;
            amount = '';
            phno = '';
        
            if(pipecount == 3){
                amount = amount + line[i];
            } else if(pipecount == 1){
                phno = phno + line[i];
            }
            if(line[i] == '|'){
                pipecount++;
            }
        }
        console.log('amount:', amount);
        console.log('phone no:', phno);
    });
*/
    //let userRef = functions.database.ref('users/wallet/');
    
    var text = fs.readFileSync('/tmp/myrenamedfile.txt');
    var textByLine = text.split("\n");

    let pipecount;
    let amount: string;
    let phno: string;
    for(var i = 0; i < textByLine.length; ++i){
        pipecount = 0;
        amount = '';
        phno = '';
        if(textByLine[i] == '|'){
            pipecount++;
        }
        if(pipecount == 3){
            amount = amount + textByLine[i];
        } else if(pipecount == 1){
            phno = phno + textByLine[i];
        }
    }

    //const myNewFile = 'new_${fileName}';
    const tempFilePath1 = path.join(path.dirname(filePath), fileName);
    await bucket.upload(tempFilePath, {
        destination: tempFilePath1,
        metadata: newMetadata,
    })
    .then( uploaded => {
        console.log('new file uploaded: ', fileName)
    })
    .catch( upfailed => {
        console.log('upload failed: ', fileName)
    })
    return fs.unlinkSync(tempFilePath);

 });
