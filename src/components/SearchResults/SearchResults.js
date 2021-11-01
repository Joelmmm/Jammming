import React from 'react';
import './SearchResults.css';
import {TrackList} from '../TrackList/TrackList';
import PropTypes from 'prop-types';

export class SearchResults extends React.Component {
  render(){
    return (
      <div className="SearchResults">
        <h2>Results</h2>
        <TrackList isRemoval={0} onAdd={this.props.onAdd} tracks={this.props.searchResults} />
      </div>
    )
  }
}
SearchResults.propTypes = {
  searchResults: PropTypes.array.isRequired
};
