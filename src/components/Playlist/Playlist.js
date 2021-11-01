import React from 'react';
import './Playlist.css';
import {TrackList} from '../TrackList/TrackList';

export class Playlist extends React.Component {
  constructor(props){
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
  }
  handleNameChange(event){
    this.props.onNameChange(event.target.value);
  }
  render(){
    return (
      <div className="Playlist">
        <input defaultValue={this.props.playlistName} value={this.props.playlistName} onChange={this.handleNameChange} />
        <TrackList onRemove={this.props.onRemove} isRemoval={1} tracks={this.props.playlistTracks} />
        <button onClick={this.props.onSave} className="Playlist-save">SAVE TO SPOTIFY</button>
      </div>
    )
  }
}
