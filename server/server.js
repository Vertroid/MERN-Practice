const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
let db, dbo;

const app = express();
app.use(express.static('static'));
app.use(bodyParser.json());

MongoClient.connect('mongodb://localhost/issuetracker', {useNewUrlParser: true}).then(conn => {
    db = conn;
    dbo = db.db('issuetracker');
    app.listen(3000, function(){
        console.log('App started at port 3000');
    });
}).catch(err => {
    console.log("Error while connecting DB: " + err);
});

const validIssueStatus = {
    open: true,
    closed: true
};

const issueFieldType = {
    status: 'required',
    owner: 'required',
    effort: 'optional',
    created: 'required',
    completionDate: 'optional',
    title: 'required',
}

// 验证issue合法
function validateIssue(issue){
    for(const field in issueFieldType){
        const type = issueFieldType[field];
        if(!type){
            delete issue[field]; // 删除issue中不需要的键
        }else if(type === 'required' && !issue[field]){
            return `${field} is required!`;
        }
    }

    if(!validIssueStatus[issue.status]){
        return `${issue.status} is not a valid status`;
    }
}

app.get('/api/issues', (req, res) => {
    dbo.collection('issues').find().toArray().then(result => {
        const metadata = {
            total_count: result.length
        };
        res.json({
            _metadata: metadata,
            records: result
        });
    }).catch(err => {
        console.log("Error while reading: " + err);
    });
});

app.post('/api/issues', (req, res) => {
    const newIssue = req.body;
    newIssue.created = new Date();

    if(!newIssue.status){
        newIssue.status = "open";
    }

    // 验证
    const err = validateIssue(newIssue);
    if(err){
        res.status(422).json({
            message: `Invalid requset: ${err}`
        });
        return;
    }
    dbo.collection('issues').insertOne(newIssue).then(result => {
        console.log(result);
        return dbo.collection('issues').find({_id: result.insertedId}).limit(1).next();
    }).then(row => {
        res.json(row);
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: `Internal server error: ${err}`
        });
    });
})





