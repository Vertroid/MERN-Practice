'use strict';

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

module.exports = {
    validateIssue: validateIssue
};