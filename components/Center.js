import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import Songs from "../components/Songs"
import { useRecoilState, useRecoilValue } from "recoil"
import { ChevronDownIcon } from "@heroicons/react/outline"
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
            console.log(data.body)
        })
        .catch(error => {
            console.log("Error in fetching playlist songs : ", error)
        })
    }, [playlistId, spotifyApi])

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
        <header className="absolute top-5 right-8">
            <div className="flex items-center bg-black text-white space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2">
                <img className="rounded-full w-10 h-10" src={session?.user?.image ?? "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"} alt="" />
                <h2>{ session?.user?.name }</h2>
                <ChevronDownIcon className="h-5 w-5" />
            </div>
        </header>

        <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}>
            <img className="h-44 w-44 shadow-xl" src={playlist?.images[0]?.url} alt="" />
            <div>
                <p>PLAYLIST</p>
                <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">{playlist?.name}</h1>
            </div>
        </section>
        <div>
            <Songs />
        </div>
    </div>
  )
}

export default Center