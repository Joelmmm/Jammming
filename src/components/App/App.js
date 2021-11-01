import React, {useState, useEffect} from 'react';
import './App.css';
import {SearchBar} from '../SearchBar/SearchBar';
import {SearchResults} from '../SearchResults/SearchResults';
import {Playlist} from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

function App () {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistName, setPlaylistName] = useState('New Playlist');
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [storeroom, setStoreroom] = useState([]);


  useEffect(() => {
    Spotify.getAccessToken();
  }, []);

  function addTrack(track){
    if(!playlistTracks.includes(track)){
      setPlaylistTracks(prev => [...prev, track] );
      const newResults = searchResults.filter(elem => elem !== track );
      setSearchResults(newResults);
      setStoreroom(prev => [...prev, track] );
    }
  }

  function removeTrack(track){
    const filteredTracks = playlistTracks.filter(elem => (elem.id !== track.id));
    if(storeroom.some(copy => copy === track)){
      setSearchResults(prev => [track, ...prev] );
      setPlaylistTracks(filteredTracks);
    } else {
      setPlaylistTracks(filteredTracks);
    }
  }

  function updatePlaylistName(name){
    setPlaylistName(name);
  }

  function savePlaylist(){
    const trackURIs = playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(playlistName, trackURIs).then(() => {
      updatePlaylistName('New Playlist');
      setPlaylistTracks([]);
    });
  }

  function search(term){
    Spotify.search(term).then(newSearchResults => {
      setSearchResults(newSearchResults);
      setStoreroom([]);
    });
  }

  return (
    <div>
      <h1>Ja<span className="highlight">mmm</span>ing</h1>
      <div className="App">
        <SearchBar onSearch={search} />
        <div className="App-playlist">
          <SearchResults onAdd={addTrack} searchResults={searchResults}/>
          <Playlist onNameChange={updatePlaylistName}
                    onRemove={removeTrack}
                    playlistName={playlistName}
                    playlistTracks={playlistTracks}
                    onSave={savePlaylist} />
        </div>
      </div>
    </div>
  );
}

export default App;
