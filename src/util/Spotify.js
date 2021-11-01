let accessToken;
let clientID;
const redirectURI = 'https://joelmmm-apps.herokuapp.com/apps/jammming';
const keyURI = './key';

async function getClientID() {
  const response = await fetch(keyURI);
  const id = await response.text()
  return id
}

const Spotify = {
  async getAccessToken() {
    if (accessToken) {
      return accessToken;
    }
    //check for access token match
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      // this clears the parameters, allowing us to grab a new access token.
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', '', '/apps/jammming');
    } else {
      clientID = await getClientID();
      const accessUrl = `https://accounts.spotify.com/authorize?` +
        `client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      window.location.href = accessUrl;
    }
  },
  //method to to request based on a search term. Then it returns the tracklist objects
  search(term) {
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
      {
        headers: {
          Authorization: 'Bearer ' + accessToken
        }
      }).then(response => {
        if (response.ok) {
          return response.json();
        } throw new Error('Request failed!');
      }).then(jsonResponse => {
        if (!jsonResponse.tracks) {
          console.log('maybe here ... ', jsonResponse);
          return [];
        } else {
          return jsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          }));
        }
      })
  },/* this method saves the playlist into user's account. Makes 3 requests:
         1. GET the users Current Id. (using access token).
         2. POST a playlist Name. (using the Id returned from previous promise).
         3. POST tracks to the playlist. (using the Playlist Id returned from previous promise).   */
  savePlaylist(playlistName, uriArr) {
    if (!playlistName || !uriArr.length) {
      return
    }
    const header = { Authorization: 'Bearer ' + accessToken }
    let userId;
    let playlistId;
    let snapshotId;
    //this request is for getting the user's id. STEP 1
    return fetch('https://api.spotify.com/v1/me', { headers: header }).then(response => {
      if (response.ok) {
        return response.json();
      } throw new Error('Request failed! Cannot get user Id.');
    }, networkError => console.log(networkError.message)
    ).then(jsonResponse => {
      userId = jsonResponse.id;
      // this is for STEP 2
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: 'POST',
        headers: header,
        'Content-Type': 'application/json',
        body: JSON.stringify({ name: playlistName })
      }
      ).then(response => {
        if (response.ok) {
          return response.json();
        } throw new Error('Request failed! Cannot post playlistName.')
      }, networkError => console.log(networkError.message)).then(jsonResponse => {
        playlistId = jsonResponse.id;
        //this is for STEP 3.
        return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ uris: uriArr }),
          method: 'POST'
        }
        ).then(response => {
          if (response.ok) {
            return response.json();
          } throw new Error('Request failed! Cannot add tracks to playlist.')
        }, networkError => console.log(networkError.message)
        ).then(jsonResponse => snapshotId = jsonResponse)
      })

    })

  }

}


export default Spotify;
