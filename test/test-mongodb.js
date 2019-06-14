'use strict';
const MongoClient = require('mongodb');

function usage(){
    console.log("Usage: ");
    console.log(' node', __filename, '<option>');
    console.log('options: ');
    console.log(' callbacks: use callbacks.');
    console.log(' promise: use promise.');
    console.log(' generator: use generator.');
    console.log(' async: use async');
    
}

if(process.argv.length < 3){
    console.log('Need arguments.');
    usage();
} else {
    if(process.argv[2] === 'callbacks'){
        testWithCallbacks();
    }else if(process.argv[2] === 'promise'){
        testWithPromise();
    }else if(process.argv[2] === 'generator'){

    }else if(process.argv[2] === 'async'){

    }else{
        console.log('Invalid option.');
        usage();
    }
}

function testWithCallbacks(){
    MongoClient.connect('mongodb://localhost/playground', function(err, db){
        db.collection('employees').insertOne({id: 1, name: 'Callback'}, function(err, result){ // 使用回调函数
            console.log("Result of insertion: ", result.insertedId);
            db.collection('employees').find({id: 1}).toArray(function(err, docs){
                console.log('Result of find: ', docs);
                db.close();
            })
        })
    })
}

function testWithPromise(){
    let db;
    MongoClient.connect('mongodb://localhost/playground').then(connection => {
        db = connection;
        return db.collection('employees'.insertOne({id: 1, name: 'Promise'}));
    }).then(result => {
        console.log("Result of insertion: " + result.insertedId);
        return db.collection('employees').find({id: 1}).toArray();
    }).then(docs => {
        console.log("Result of find: " + docs.length);
        db.close();
    }).catch(err => console.log("Error: " + err));
}

function testWithGenerator(){

}

function testWithAsync(){

}