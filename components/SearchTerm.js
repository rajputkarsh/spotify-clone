

import { useSession, signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import useSpotify from "../hooks/useSpotify"
import { useRecoilState } from "recoil"
import { playlistIdState } from "../atoms/playlistAtom"
import TopResultTile from "./TopResultTile"
import UserProfile from './UserProfile'
import { findMatchProbability } from '../lib/misc'
import Song from '../components/Song'
import { redirectTo } from "../lib/misc"
import PlaylistTiles from './PlaylistTiles'
import { MAX_VISIBLE_SONGS, MAX_PLAYLIST_SONGS } from '../constants/constants'

function SearchTerm({ term }) {

    const spotifyApi = useSpotify()
    const {data: session, status} = useSession()
    const [searchTerm, setSearchTerm] = useState(term ?? "")
    const [searchResults, setSearchResults] = useState(null)
    const [topResultType, setTopResultType] = useState("UNKNOWN")
    const [playlistId, setPlaylistId] = useRecoilState(playlistIdState)

    const updateSearchTerm = (newSearchTerm) => {
        setSearchTerm(newSearchTerm)
    }

    const handKeyDownEvent = (e) => {
        if(e.key === "Enter"){
            redirectTo(`/search/${searchTerm}`)
        }
    }

    const getTopResultType = (track, artist, album, playlist) => {
        let topResult = {
            id   : null,
            name : null,
            image: null,
            type : null,
            uri  : null
        }
        let topResultProbability = 0

        // Preference order -> Song - Artist - Album - Playlist
        let trackProbability    = findMatchProbability(term, track.name)
        let artistProbability   = findMatchProbability(term, artist.name)
        let albumProbability    = findMatchProbability(term, album.name)
        let playlistProbability = findMatchProbability(term, playlist.name)

        if ( trackProbability > topResultProbability){
            topResult.id = track.id
            topResult.name = track.name
            topResult.image = track?.album?.images[0]?.url
            topResult.type = "SONG"
            topResult.uri  = track.uri
            topResultProbability = trackProbability
        }
        
        if ( artistProbability > topResultProbability){
            topResult.id = artist.id
            topResult.name = artist.name
            topResult.image = artist?.images[0]?.url
            topResult.type = "ARTIST"
            topResult.uri  = artist.uri
            topResultProbability = artistProbability
        }

        if ( albumProbability > topResultProbability){
            topResult.id = album.id
            topResult.name = album.name
            topResult.image = album?.images[0]?.url
            topResult.type = "ALBUM"
            topResult.uri  = album.uri
            topResultProbability = albumProbability
        }

        if ( playlistProbability > topResultProbability){
            topResult.id = playlist.id
            topResult.name = playlist.name
            topResult.image = playlist?.images[0]?.url
            topResult.type = "PLAYLIST"
            topResult.uri  = playlist.uri
            topResultProbability = playlistProbability
        }
        return topResult
    }

    const getSearchResults = () => {
        spotifyApi.search(term, ['album', 'artist', 'playlist', 'track']).then(data => {

            setTopResultType(getTopResultType(
                data.body?.tracks?.items[0],
                data.body?.artists?.items[0],
                data.body?.albums?.items[0],
                data.body?.playlists?.items[0],
            ))
            
            setSearchResults(data.body)
        })
    }

    useEffect( () => {
        if(spotifyApi.getAccessToken()){
            getSearchResults()
        }        
    }, [session, spotifyApi, term] )


    return (
        <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
            <UserProfile />

            <section className={`flex items-end space-x-7  h-24 text-white p-8`}>
                <div className="md:w-2/3">
                    <input onChange={(e) => updateSearchTerm(e.target.value)} onKeyDown={handKeyDownEvent} value={searchTerm} className="bg-white appearance-none border-2 border-gray-200 rounded-3xl w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-200" id="inline-full-name" type="text" placeholder="Artists, Songs or Podcasts" />
                </div>
            </section>

            <section className={`flex items-end space-x-7  h-20 text-white p-8`}>
                <div>
                    <h1 className="text-3xl font-bold">Search Results for - <span className='capitalize'>{term}</span></h1>
                </div>
            </section>

            <div className='flex text-white pl-8 pr-8'>
                <div className='md:w-1/2 pr-1'>
                    <h1 className='text-2xl'>Top Result</h1>
                    <TopResultTile id={topResultType.id} name={topResultType.name} image={topResultType.image} type={topResultType.type} uri={topResultType?.uri}/>                    
                </div>

                <div className='md:w-1/2 pl-1'>
                    <h1 className='text-2xl'>Songs</h1>
                    <div>
                        {   
                            searchResults?.tracks?.items.slice(0, MAX_VISIBLE_SONGS).map((track, i) => (
                                <Song key={`song-${i}-${track.id}`} track={track} order={i} small={true} />
                            ))
                        }
                    </div>
                </div>
            </div>

            <div className='text-white pt-8 pl-8 pr-8'>
                <h1 className='text-3xl'>Artists</h1>        
                <div>
                    <div className="z-1 mt-5 p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 text-white gap-4 justify-center">
                        {
                            searchResults?.artists?.items.slice(0, MAX_PLAYLIST_SONGS).map(
                                (artist, i) => (
                                    <PlaylistTiles key={`artist-${artist.id}`} id={artist.id} name={artist.name} image={artist?.images[0]?.url} description={artist.description} redirect={() => { redirectTo(`/artist/${artist.id}`) } } />
                                )
                            )    
                        }
                    </div>                        
                </div>            
            </div>

            <div className='text-white pt-8 pl-8 pr-8'>
                <h1 className='text-3xl'>Albums</h1>        
                <div>
                    <div className="z-1 mt-5 p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 text-white gap-4 justify-center">
                        {
                            searchResults?.albums?.items.slice(0, MAX_PLAYLIST_SONGS).map(
                                (album, i) => (
                                    <PlaylistTiles key={`album-${album.id}`} id={album.id} name={album.name} image={album?.images[0]?.url} description={album.description} redirect={() => { redirectTo(`/album/${album.id}`) }} />
                                )
                            )    
                        }
                    </div>                        
                </div>            
            </div>

            <div className='text-white pt-8 pl-8 pr-8'>
                <h1 className='text-3xl'>Playlists</h1>     
                <div className="z-1 mt-5 p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 text-white gap-4 justify-center">
                    {
                        searchResults?.playlists?.items.slice(0, MAX_PLAYLIST_SONGS).map(
                            (playlist, i) => (
                                <PlaylistTiles key={`playlist-${playlist.id}`} id={playlist.id} name={playlist.name} image={playlist?.images[0]?.url} description={playlist.owner.display_name} redirect={() => { setPlaylistId(playlist.id); redirectTo("/playlist") }} />
                            )
                        )    
                    }
                </div>               
            </div>

        </div>
    )
}

export default SearchTerm