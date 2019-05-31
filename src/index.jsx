const contentNode = document.getElementById('contents');
class IssueList extends React.Component{
    render(){
        return(
            <div>
                <h1>Issue Tracker</h1>
                <IssueFilter/>
                <hr/>
                <IssueTable/>
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

class IssueTable extends React.Component{
    render(){
        return(
            <div>This is a placeholder for Issue Table</div>
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

ReactDOM.render(<IssueList />, contentNode);