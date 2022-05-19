
import Router from 'next/router'
import { useSession, signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import { ChevronDownIcon } from "@heroicons/react/outline"
import useSpotify from "../hooks/useSpotify"
import { useRecoilState } from "recoil"
import { playlistIdState } from "../atoms/playlistAtom"
import { shuffle } from "lodash"
import { PlayIcon } from "@heroicons/react/solid"
import TopResultTile from "./TopResultTile"
import { findMatchProbability } from '../lib/misc'
import Song from '../components/Song'
import { MAX_VISIBLE_SONGS } from '../constants/constants'
import UserProfile from './UserProfile'

function SearchTerm({ term }) {

    const spotifyApi = useSpotify()
    const {data: session, status} = useSession()
    const [searchTerm, setSearchTerm] = useState("")
    const [searchResults, setSearchResults] = useState(null)
    const [topResultType, setTopResultType] = useState("UNKNOWN")
    const [playlistId, setPlaylistId] = useRecoilState(playlistIdState)

    const redirectTo = (url) => {
        Router.push(url)
    }

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
            topResultProbability = trackProbability
        }
        
        if ( artistProbability > topResultProbability){
            topResult.id = artist.id
            topResult.name = artist.name
            topResult.image = artist?.images[0]?.url
            topResult.type = "ARTIST"
            topResultProbability = artistProbability
        }

        if ( albumProbability > topResultProbability){
            topResult.id = album.id
            topResult.name = album.name
            topResult.image = album?.images[0]?.url
            topResult.type = "ALBUM"
            topResultProbability = albumProbability
        }

        if ( playlistProbability > topResultProbability){
            topResult.id = playlist.id
            topResult.name = playlist.name
            topResult.image = playlist?.images[0]?.url
            topResult.type = "PLAYLIST"
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
                    <TopResultTile id={topResultType.id} name={topResultType.name} image={topResultType.image} type={topResultType.type}/>                    
                </div>

                <div className='md:w-1/2 pl-1'>
                    <h1 className='text-2xl'>Songs</h1>
                    <div>
                        {   
                            searchResults?.tracks?.items.slice(0, MAX_VISIBLE_SONGS).map((track, i) => (
                                <Song track={track} order={i} small={true} />
                            ))
                        }
                    </div>
                </div>
            </div>

            <div className='flex text-white pt-8 pl-8 pr-8'>
                    <h1 className='text-3xl'>Artists</h1>   
                    <div>
                        
                    </div>                 
                </div>

                <div className='flex text-white pt-8 pl-8 pr-8'>
                    <h1 className='text-3xl'>Albums</h1>        
                    <div>
                        
                    </div>            
                </div>

                <div className='flex text-white pt-8 pl-8 pr-8'>
                    <h1 className='text-3xl'>Playlists</h1>     
                    <div>
                        
                    </div>               
                </div>

        </div>
    )
}

export default SearchTerm