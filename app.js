require('dotenv').config();

const express = require( 'express' );
const hbs = require( 'hbs' );
const SpotifyWebApi = require( 'spotify-web-api-node' );
const path = require( 'path' );

const app = express();

app.set( 'view engine', 'hbs' );
app.set( 'views', path.join( __dirname, '/views' ));
app.use( express.static( path.join(__dirname, '/public' )));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
    // accessToken: 'BQDb0kOuHdPDWdD26w5SUd1DZAx1UwKenBEyaaSbe2Dh_QW60YWx4c2V1dlThbX_wNVrrIcZBayGsVFNkfM'
  });

spotifyApi
  .clientCredentialsGrant()
  .then( data => spotifyApi.setAccessToken( data.body [ 'access_token' ]))
  .catch( error => console.log( 'Something went wrong when retrieving an access token', error ));

// Homepage
app.get('/', ( req, res, next ) => res.render( 'home' ));

// Search results
app.get( '/artist-search', ( req, res, next ) => {
  spotifyApi
    .searchArtists( req.query.artist )
    .then(data => {
      const searchResults = {
          artist: data.body.artists.items
      };
      res.render( 'artist-search-results', searchResults );
    })
    .catch( err => console.log( 'An error ocurred while searching artists: ', err ));
});

// Albums
app.get( '/albums/:id', ( req, res, next ) => {
  spotifyApi
    .getArtistAlbums( req.params.id )
    .then( data => {
      const albums = {
        album: data.body.items
      };
      res.render( 'albums', albums )
    })
    .catch( err => console.log( 'There was an error retrieving the albums: ', err ));
});


app.listen( 3000, () => console.log( 'My Spotify project running on port 3000 🎧 🥁 🎸 🔊' ));