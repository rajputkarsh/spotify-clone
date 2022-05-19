import { useSession, signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import Songs from "./Songs"
import { useRecoilState, useRecoilValue } from "recoil"
import UserProfile from './UserProfile'
import { playlistState, playlistIdState } from "../atoms/playlistAtom"
import useSpotify from "../hooks/useSpotify"
import { shuffle } from "lodash"

function Center() {

    const spotifyApi = useSpotify()
    const {data: session, status} = useSession()
    const playlistId = useRecoilValue(playlistIdState)
    const [playlist, setPlaylist] = useRecoilState(playlistState)

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

    useEffect(() => {
        setColor(shuffle(colors).pop())
    }, [playlistId])

    useEffect( () => {
        spotifyApi.getPlaylist(playlistId)
        .then(data => {
            setPlaylist(data.body)
        })
        .catch(error => {
            console.log("Error in fetching playlist songs : ", error)
        })
    }, [playlistId, spotifyApi])

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
        <UserProfile />

        <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}>
            <img className="h-44 w-44 shadow-xl" src={playlist?.images[0]?.url} alt="" />
            <div>
                <p>PLAYLIST</p>
                <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">{playlist?.name}</h1>
            </div>
        </section>
        <div className="mt-5">
            <Songs />
        </div>
    </div>
  )
}

export default Center