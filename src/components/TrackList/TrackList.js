import React from 'react';
import './TrackList.css';
import {Track} from '../Track/Track';
import PropTypes from 'prop-types';
                              
export class TrackList extends React.Component {
  render(){
    return (
      <div className="TrackList">
          {
            this.props.tracks.map((trackk) => {
                return <Track track={trackk} key={trackk.id} onAdd={this.props.onAdd} onRemove={this.props.onRemove} isRemoval={this.props.isRemoval}/>
               }
            )
          }
      </div>
    )
  }
}
TrackList.propTypes = {
  tracks: PropTypes.array.isRequired
};
