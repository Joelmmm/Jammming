import React from 'react';
import './SearchBar.css'

export class SearchBar extends React.Component {
  constructor(props){
    super(props)
    this.state = {term: 'the term'};
    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }
  search(){
    this.props.onSearch(this.state.term)
  }
  handleTermChange(e){
    const newTerm = e.target.value;
    this.setState({ term: newTerm });
  }
  handleSave(e) {
    if(e.keyCode === 13) this.search();
    return;
  }
  render(){
    return (
      <div className="SearchBar">
        <input defaultValue={''} placeholder="Enter A Song, Album, or Artist"
               onChange={this.handleTermChange}
               onKeyDown={this.handleSave} />
        <button onClick={this.search} className="SearchButton">SEARCH</button>
      </div>
    )
  }
}
