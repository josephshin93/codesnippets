import React, { Component } from 'react';



interface DropdownSearchProps {
  search: any; // TrieSearch object that is set up and filled
  onAct: (userId: string) => void;
}

interface DropdownSearchState {
  results: Array<any>;
}

class DropdownSearch extends Component<DropdownSearchProps, DropdownSearchState> {
  constructor(props: DropdownSearchProps) {
    super(props);

    this.state = {
      results: [],
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event: React.FormEvent<HTMLInputElement>) {
    // console.log(
    //   'search results of \'' + event.currentTarget.value + '\'', 
    //   this.props.search.get(event.currentTarget.value)
    // );
    this.setState({
      results: this.props.search.get(event.currentTarget.value),
    });
  }

  renderResults() {
    if (this.state.results && this.state.results.length > 0) {
      return this.state.results.map((entry, index) => (
        <li key={index} className='collection-item'>
          <p>Name: {entry.firstName + ' ' + entry.lastName}</p>
          <p>Email: {entry.email}</p>
          <button onClick={(e) => {
            e.preventDefault();
            this.props.onAct(entry.id)
          }}>Add</button>
        </li>
      ));
    }
    return <li className='collection=item'>No results found.</li>;
  }

  // FIXME?: entry display is specific to user data, not generalized
  render() {
    return (
      <div>
        <input 
          type='text' 
          onChange={this.handleChange} 
        />
        <ul className='collection'>
          {this.renderResults()}
        </ul>
      </div>
    );
  }
}

export default DropdownSearch;
