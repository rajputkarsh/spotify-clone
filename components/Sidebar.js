
import { LogoutIcon, HomeIcon, SearchIcon, LibraryIcon, PlusCircleIcon, HeartIcon, RssIcon } from "@heroicons/react/outline"
import { useSession } from "next-auth/react"     
import { redirectTo } from "../lib/misc"
import { useState, useEffect } from "react"
import { useRecoilState } from "recoil"
import { playlistIdState } from "../atoms/playlistAtom"
import SpotifyLogo from "../svg/SpotifyLogo"
import useSpotify from "../hooks/useSpotify"
import { toast } from "react-toastify"

function Sidebar() {

    const spotifyApi = useSpotify()

    const {data: session, status} = useSession()
    const [playlists, setPlaylists] = useState([])
    const [newPlaylistsCreated, setNewPlaylistsCreated] = useState(0)
    const [playlistId, setPlaylistId] = useRecoilState(playlistIdState)


    const createNewPlaylist = () => {

        const newPlaylistName = `My Playlist #${playlists.length+1}`

        spotifyApi.createPlaylist(session.user?.username, newPlaylistName, {
            description: "", 
            'collaborative' : false, 
            'public': true
        }).then(data => {
            toast.success(`Playlist ${data?.body?.name} created`)
            setNewPlaylistsCreated(newPlaylistsCreated + 1)
            setPlaylistId(data?.body?.id)
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
    }, [newPlaylistsCreated, session, spotifyApi] )

    return (
        <div className="text-gray-500 pb-36 p-5 text-xs lg:text-sm border-r border-gray-900 overflow-y-scroll h-[calc(100vh-6rem)] sm:min-w-[12rem] lg:min-w-[15rem] hidden md:inline-flex scrollbar-hide">

            <div className="space-y-3 width-100">

                <div  className="cursor-pointer mb-10" onClick={() => {redirectTo("/home")}} >
                    <SpotifyLogo/>
                </div>

                <button onClick={() => redirectTo("/home")} className="flex items-center space-x-2 hover:text-white">
                    <HomeIcon className="h-5 w-5" />
                    <p>Home</p>
                </button>
                <button onClick={() => redirectTo("/search")} className="flex items-center space-x-2 hover:text-white ">
                    <SearchIcon className="h-5 w-5"/>
                    <p>Search</p>
                </button>
                <button onClick={() => redirectTo("/playlists")} className="flex items-center space-x-2 hover:text-white ">
                    <LibraryIcon className="h-5 w-5"/>
                    <p>Your Library</p>
                </button>

                <hr className="border-t-[0.1px] border-gray-900"/>

                <button onClick={() => {createNewPlaylist()}} className="flex items-center space-x-2 hover:text-white ">
                    <PlusCircleIcon className="h-5 w-5"/>
                    <p>Create Playlist</p>
                </button>
                <button onClick={() => {redirectTo("/saved-tracks")}} className="flex items-center space-x-2 hover:text-white ">
                    <HeartIcon className="h-5 w-5"/>
                    <p>Liked Songs</p>
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