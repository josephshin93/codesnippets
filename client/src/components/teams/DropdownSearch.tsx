import React, { Component } from 'react';



interface DropdownSearchProps {
  search: any; // TrieSearch object that is set up and filled
  onAct: (userId: string) => void;
}

interface DropdownSearchState {
  input: string;
  results: Array<any>;
}

class DropdownSearch extends Component<DropdownSearchProps, DropdownSearchState> {
  constructor(props: DropdownSearchProps) {
    super(props);

    this.state = {
      input: '',
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
      input: event.currentTarget.value,
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
            this.props.onAct(entry.id);
            this.setState({
              input: '',
              results: [],
            });
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
          placeholder='Search user by email' 
          value={this.state.input}
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
