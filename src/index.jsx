const contentNode = document.getElementById('contents');


class IssueList extends React.Component{
    constructor(){
        super();
        this.state = {
            issues: []
        };
        
        // 延迟执行
        this.createIssue = this.createIssue.bind(this);
    };
    // 生命周期方法钩子
    componentDidMount(){
        this.loadData();
    }
    loadData(){
        fetch('/api/issues').then(response => 
            response.json()
        ).then(data => {
            console.log("Total Count: " + data._metadata.total_count);
            data.records.forEach(issue => {
                issue.created = new Date(issue.created);
                if(issue.completionDate){
                    issue.completionDate = new Date(issue.completionDate);
                }
            });

            // 这里的this会从上层寻找
            this.setState({issues: data.records});
        });

    };
    createIssue(newIssue){
        fetch('/api/issues', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newIssue)
        }).then(response => {
            if(response.ok){
                response.json().then(updatedIssue => {
                    console.log(updatedIssue);
                    updatedIssue.created = new Date(updatedIssue.created);
                    if(updatedIssue.completionDate){
                        updatedIssue.completionDate = new Date(updatedIssue.completionDate);
                    }
                    const newIssues = this.state.issues.concat(updatedIssue);
                    this.setState({
                        issues: newIssues
                    });
                });
            }else{
                response.json().then(error => {
                    alert("Failed to add issue: " + error.message);
                });
            }
        }).catch(err => {
            console.log("Error while sending to server: " + err.message);
        })
    }
    render(){
        return(
            <div>
                <h1>Issue Tracker</h1>
                <IssueFilter/>
                <hr/>
                <IssueTable issues={this.state.issues}/>
                <hr/>
                <IssueAdd createIssue={this.createIssue}/>
                <hr/>
            </div>
        );
    }
}

class IssueFilter extends React.Component{
    render(){
        return(
            <div>This is a placeholder for Issue Filter</div>
        )
    }
}



class IssueAdd extends React.Component{
    constructor(){
        super();
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    handleSubmit(e){
        e.preventDefault();
        var form = document.forms.issueAdd;
        this.props.createIssue({
            owner: form.owner.value,
            title: form.title.value,
            status: 'open',
            created: new Date()
        })
    };
    render(){
        return (
            <div>
                <form name="issueAdd" onSubmit={this.handleSubmit}>
                    <input type="text" name="owner" placeholder="Owner"/>
                    <input type="text" name="title" placeholder="title"/>
                    <button>Add</button>
                </form>
            </div>
        )
    }
}

// 改写为无状态组件
const IssueRow = (props) => (
    <tr>
        <td>{props.issue.id}</td>
        <td>{props.issue.status}</td>
        <td>{props.issue.owner}</td>
        <td>{props.issue.created.toDateString()}</td>
        <td>{props.issue.effort}</td>
        <td>{props.issue.completionDate? props.issue.completionDate.toDateString():''}</td>
        <td>{props.issue.title}</td>
    </tr>
)

// 改写为无状态组件
function IssueTable(props){
    const issueRows = props.issues.map(issue => <IssueRow key={issue.id} issue={issue}/>);
    return(
        <table className="bordered-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Status</th>
                    <th>Owner</th>
                    <th>Created</th>
                    <th>Effort</th>
                    <th>Completion</th>
                    <th>Title</th>
                </tr>
            </thead>
            <tbody>
                {issueRows}
            </tbody>
        </table>
    )
}

ReactDOM.render(<IssueList />, contentNode);