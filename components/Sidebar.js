
import { LogoutIcon, HomeIcon, SearchIcon, LibraryIcon, PlusCircleIcon, HeartIcon, RssIcon } from "@heroicons/react/outline"
import { useSession } from "next-auth/react"        
import Router from 'next/router'
import { useState, useEffect } from "react"
import { useRecoilState } from "recoil"
import { playlistIdState } from "../atoms/playlistAtom"
import SpotifyLogo from "../svg/SpotifyLogo"
import useSpotify from "../hooks/useSpotify"

function Sidebar() {

    const spotifyApi = useSpotify()

    const {data: session, status} = useSession()
    const [playlists, setPlaylists] = useState([])
    const [playlistId, setPlaylistId] = useRecoilState(playlistIdState)

    const createNewPlaylist = () => {

        spotifyApi.createPlaylist("", {
            description: "", 
            'collaborative' : false, 
            'public': true
        }).then(data => {
            console.log("DATA -> ", data)
        }).catch(error => {
            console.log("ERROR -> ", error)
        })

    }

    useEffect( () => {
        if(spotifyApi.getAccessToken()){
            spotifyApi.getUserPlaylists().then((data) => {
                setPlaylists(data.body.items)
            })
        }
    }, [session, spotifyApi] )

    const redirectTo = (url) => {
        Router.push(url)
    }

    return (
        <div className="text-gray-500 pb-36 p-5 text-xs lg:text-sm border-r border-gray-900 overflow-y-scroll h-screen sm:min-w-[12rem] lg:min-w-[15rem] hidden md:inline-flex scrollbar-hide">

            <div className="space-y-3 width-100">

                <SpotifyLogo />

                <button className="flex items-center space-x-2 hover:text-white ">
                    <HomeIcon className="h-5 w-5"/>
                    <p>Home</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white ">
                    <SearchIcon className="h-5 w-5"/>
                    <p>Search</p>
                </button>
                <button onClick={() => { redirectTo("/playlists") }} className="flex items-center space-x-2 hover:text-white ">
                    <LibraryIcon className="h-5 w-5"/>
                    <p>Your Library</p>
                </button>

                <hr className="border-t-[0.1px] border-gray-900"/>

                <button onClick={() => {createNewPlaylist()}} className="flex items-center space-x-2 hover:text-white ">
                    <PlusCircleIcon className="h-5 w-5"/>
                    <p>Create Playlist</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white ">
                    <HeartIcon className="h-5 w-5"/>
                    <p>Liked Songs</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white ">
                    <RssIcon className="h-5 w-5"/>
                    <p>Your Episodes</p>
                </button>

                <hr className="border-t-[0.1px] border-gray-900"/>

                {
                    playlists.map( 
                        (playlist) => (
                            <p key={playlist.id} onClick={() => {setPlaylistId(playlist.id); redirectTo("/")}} className="cursor-pointer hover:text-white">
                                {playlist.name}
                            </p>
                        )
                    )
                }

            </div>

        </div>
    )
}

export default Sidebar