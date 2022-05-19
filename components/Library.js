
import PlaylistTiles from "./PlaylistTiles"
import Router from 'next/router'
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import { playlistState, playlistIdState } from "../atoms/playlistAtom"
import useSpotify from "../hooks/useSpotify"
import { shuffle } from "lodash"
import UserProfile from "./UserProfile"

function Library() {

    const spotifyApi = useSpotify()
    const {data: session, status} = useSession()
    const [playlistId, setPlaylistId] = useRecoilState(playlistIdState)
    const [playlists, setPlaylists] = useState([])

    const colors = [
        "from-indigo-500",
        "from-blue-500",
        "from-green-500",
        "from-red-500",
        "from-yellow-500",
        "from-pink-500",
        "from-purple-500",
    ]

    const [color, setColor] = useState(null)

    const redirectTo = (url) => {
        Router.push(url)
    }

    useEffect(() => {
        setColor(shuffle(colors).pop())
    }, [playlistId])

    useEffect( () => {
        if(spotifyApi.getAccessToken()){
            spotifyApi.getUserPlaylists().then((data) => {
                setPlaylists(data.body.items)
            })
        }
    }, [session, spotifyApi] )

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
        <UserProfile />

        <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-40 text-white p-8`}>
            <div>
            <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">Library</h1>
            </div>
        </section>
        <div className="z-1 mt-5 p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 text-white gap-4 justify-center">
            {
                playlists.map( 
                    (playlist) => (
                        <PlaylistTiles key={playlist.id} id={playlist.id} name={playlist.name} description={playlist.description} image={playlist?.images[0]?.url} redirect={() => {setPlaylistId(playlist.id); redirectTo("/")}} />
                    )
                )
            }

        </div>
    </div>
  )
}

export default Library