const express = require('express');
const bodyParser = require('body-parser');
const mongo = require('mongodb').MongoClient;

const app = express();
app.use(express.static('static'));
app.use(bodyParser.json());

mongo.connect('mongodb://localhost/issuetracker', function(err, db){
    db.collection('')
})

const validIssueStatus = {
    open: true,
    closed: true
};

const issueFieldType = {
    id: 'required',
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
    const metadata = {
        total_count: issues.length
    };
    res.json({
        _metadata: metadata,
        records: issues
    });
});

app.post('/api/issues', (req, res) => {
    const newIssue = req.body;
    newIssue.id = issues.length + 1;
    newIssue.created = new Date();

    if(!newIssue.status){
        newIssue.status = "open";
    }

    // 验证
    const err = validateIssue(newIssue);
    if(!err){
        res.status(422).json({
            message: `Invalid issue: ${err}`
        });
        return;
    }

    issues.push(newIssue);
    res.json(newIssue);

})

app.listen(3000, function(){
    console.log('App started at port 3000');
});



