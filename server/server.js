const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static('static'));
app.use(bodyParser.json());

const issues = [
    {
        id: 1,
        status: "open",
        owner: "Vertex",
        created: new Date('2018/6/30'),
        completionDate: undefined,
        effort: 5,
        title: "Learning MERN pro stack"
    },
    {
        id: 2,
        status: "closed",
        owner: "Zephyr",
        created: new Date('2016/5/31'),
        completionDate: new Date('2017/1/25'),
        effort: 5,
        title: "Learning Unity3D"
    }
]

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



