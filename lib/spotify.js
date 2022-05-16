import SpotifyWebApi from "spotify-web-api-node"

const scopes = [
    "playlist-modify-public",
    "playlist-modify-private",
    "playlist-read-private",
    "playlist-read-collaborative",

    "user-read-playback-position",
    "user-read-email",
    "user-read-private",
    "user-read-playback-state",
    "user-read-currently-playing",
    "user-read-recently-played",

    "user-library-modify",

    "user-follow-read",
    "user-follow-modify",
    "user-library-read",
    "user-top-read",    
    "ugc-image-upload",
    "user-modify-playback-state",

    "streaming",
].join(",")

const params = {
    scope: scopes
}

const queryParamString = new URLSearchParams(params)

const LOGIN_URL = `https://accounts.spotify.com/authorize?${queryParamString.toString()}`

const spotifyApi = new SpotifyWebApi({
    clientId     : process.env.NEXT_PUBLIC_CLIENT_ID,
    clientSecret : process.env.NEXT_PUBLIC_CLIENT_SECRET,
})

export default spotifyApi
export { LOGIN_URL }