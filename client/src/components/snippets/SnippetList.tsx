import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSnippets } from '../../actions';

interface Props {
    fetchSnippets: () => void,
    snippets: any
}

class SnippetList extends Component<Props> {
    componentDidMount() {
        this.props.fetchSnippets();
    }

    renderSnippets() {
        return this.props.snippets.map( (snippet: any) => {
            return (
                <div key={snippet.title}>
                    <h3>Title: { snippet.title }</h3>
                    <div><b>Content:</b> { snippet.content }</div>
                    <div><b>Description:</b> { snippet.description }</div>
                    <div><b>OwnerID:</b> { snippet.ownerID }</div>
                    <div><b>OwnerName:</b> { snippet.ownerName }</div>
                    <div><b>OwnerPic:</b> { snippet.ownerPic }</div>
                    <div><b>Status:</b> { snippet.status }</div>
                    <div><b>Team:</b> { snippet.team }</div>
                    <div><b>TimeCreated:</b> {new Date(snippet.timeCreated._seconds * 1000).toLocaleDateString() }</div>
                    <div><b>TotalComments:</b> { snippet.totalComments }</div>
                    <div><b>TotalLikes:</b> { snippet.totalLikes }</div>
                </div>
            )
        })
    }
    
    render() {
        console.log("snippetlist", this.props);
        return (
            <div>
                {this.renderSnippets()}
            </div>
        );
    }
}

function mapStateToProps({ snippets }: any) {
    return { snippets };
}

export default connect(mapStateToProps, { fetchSnippets })(SnippetList);
