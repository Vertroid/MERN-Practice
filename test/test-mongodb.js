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
        testWithGenerator();
    }else if(process.argv[2] === 'async'){
        testWithAsync();
    }else{
        console.log('Invalid option.');
        usage();
    }
}

function testWithCallbacks(){
    MongoClient.connect('mongodb://localhost/', { useNewUrlParser: true}, function(err, db){
        let dbo = db.db('playground');
        dbo.collection('employees').insertOne({id: 1, name: 'Callback'}, function(err, result){ // 使用回调函数
            console.log("Result of insertion: ", result.insertedId);
            dbo.collection('employees').find({id: 1}).toArray(function(err, docs){
                console.log('Result of find: ', docs);
                db.close();
            })
        })
    })
}

// 使用Promise
function testWithPromise(){
    let db, dbo;
    MongoClient.connect('mongodb://localhost/', { useNewUrlParser: true }).then(connection => {
        db = connection;
        dbo = db.db('playground');
        return dbo.collection('employees').insertOne({id: 1, name: 'Promise'});
    }).then(result => {
        console.log("Result of insertion: " + result.insertedId);
        return dbo.collection('employees').find({id: 1}).limit(1).next();
    }).then(docs => {
        console.log("Result of find: " + JSON.stringify(docs));
        db.close();
    }).catch(err => console.log("Error: " + err));
}

// 使用Co，类似Coroutine
function testWithGenerator(){
    const co = require('co');
    co(function *(){
        const db = yield MongoClient.connect('mongodb://localhost/playground', {useNewUrlParser:true});
        const dbo = db.db('playground');
        const result = yield dbo.collection('employees').insertOne({id: 1, name: 'Generator'});
        console.log("Result of insertion: " + result.insertedId);
        const docs = yield dbo.collection('employees').find({id: 1}).toArray();
        console.log("Result of find: " + docs);
        db.close();
    }).catch(err => {
        console.log('Error: ' + err);
    });
}

function testWithAsync(){
    const async = require('async');
    let db, dbo;
    async.waterfall([
        next => {
            MongoClient.connect('mongodb://localhost/playground', {useNewUrlParser:true}, next);
        },
        (connection, next) => {
            db = connection;
            dbo = db.db('playground');
            dbo.collection('employees').insertOne({id: 1, name: 'Async'}, next);
        },
        (insertResult, next) => {
            console.log("Result of insertion: " + insertResult.insertedId);
            dbo.collection('employees').find({id: 1}).toArray(next);
        },
        (docs, next) => {
            console.log("Result of find: " + docs);
            db.close();
            next(null);
        }
    ])
}