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
          <div className='row'>
            <div className='col s10'>
              <p>Name: {entry.firstName + ' ' + entry.lastName}</p>
              <p>Email: {entry.email}</p>
            </div>
            <div className='col s2'>
              <button 
                className='btn-floating btn-small waves-effect waves-light'
                style={{marginTop: '0.9rem'}}
                onClick={(e) => {
                  e.preventDefault();
                  this.props.onAct(entry.id);
                  this.setState({
                    input: '',
                    results: [],
                  });
                }}
              >
                <i className='material-icons'>add</i>
              </button>
            </div>
          </div>
        </li>
      ));
    }
    return (
      <li className='collection=item'>
        <p className='grey-text text-lighten-2' style={{paddingLeft: '10px'}}>
          <em>No results found.</em>
        </p>
      </li>
    );
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
