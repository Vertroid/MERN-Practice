const contentNode = document.getElementById('contents');
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

class IssueList extends React.Component{
    render(){
        return(
            <div>
                <h1>Issue Tracker</h1>
                <IssueFilter/>
                <hr/>
                <IssueTable issues={issues}/>
                <hr/>
                <IssueAdd/>
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
    render(){
        return(
            <div>This is a placeholder for Issue Add</div>
        )
    }
}

class IssueRow extends React.Component{
    static get defaultProps(){
        return {
            issue_title: "-- no title --"
        }
    }
    static get propTypes(){
        return {
            issue_id: React.PropTypes.number.isRequired,
            issue_title: React.PropTypes.string
        }
    }
    render(){
        const issue = this.props.issue;
        return(
            <tr>
                <td>{issue.id}</td>
                <td>{issue.status}</td>
                <td>{issue.owner}</td>
                <td>{issue.created.toDateString()}</td>
                <td>{issue.effort}</td>
                <td>{issue.completionDate? issue.completionDate.toDateString():''}</td>
                <td>{issue.title}</td>
            </tr>
        );
    }
}

class IssueTable extends React.Component{
    render(){
        const issueRows = this.props.issues.map(issue => <IssueRow key={issue.id} issue={issue}/>);
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
}

ReactDOM.render(<IssueList />, contentNode);