
import UserProfile from "./UserProfile"
import Song from './Song'
import useSpotify from "../hooks/useSpotify"
import { useSession } from 'next-auth/react'
import { useEffect, useState } from "react"

function LikedSongs() {

  const [songList, setSongList] = useState([])

  const {data: session, status} = useSession()
  const spotifyApi = useSpotify()

  useEffect(() => {
    spotifyApi.ref
    spotifyApi.getMySavedTracks()
    .then(data => {
      setSongList(data.body.items)
    })
    .catch(error => {
      console.log(error)
    })
  }, [session, useSpotify])

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
        <UserProfile />

        <section className={`flex items-end space-x-7  h-20 text-white p-8`}>
            <div>
                <h1 className="text-3xl font-bold">Liked Songs</h1>
            </div>
        </section>
        <div className="px-8 flex flex-col space-y-1 pb-28 text-white">
            {
                songList?.map((track, i) => (
                    <Song key={track?.track?.id} order={i} track = {track?.track}/>
                ))
            }
        </div>
    </div>
  )
}

export default LikedSongs