
import { useEffect, useState } from "react"
import Router from 'next/router'
import { useSession, signOut } from "next-auth/react"
import { useRecoilState } from "recoil"
import { playlistIdState } from "../atoms/playlistAtom"
import useSpotify from "../hooks/useSpotify"
import PlaylistTiles from "./PlaylistTiles"
import { MAX_PLAYLIST_SONGS } from "../constants/constants"

function PlaylistCollection({ id, name }) {

  const spotifyApi = useSpotify()
  const {data: session, status} = useSession()
  const [playlists, setPlaylists] = useState([])
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState)

  const redirectTo = (url) => {
      Router.push(url)
  }

  useEffect(() => {
    spotifyApi.getPlaylistsForCategory(id, {limit: MAX_PLAYLIST_SONGS})
    .then(data => {
      setPlaylists(data.body.playlists.items)
    })
    .catch(error => {
      console.log("ERROR while fetching category playlist : ", error)
    })

  }, [session, spotifyApi])

  return (
    <div className="z-1 p-10 pt-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 text-white gap-4 justify-center">
        {
            playlists.map( 
                (playlist) => (
                    <PlaylistTiles key={id} id={id} name={name} description={""} image={playlist?.images[0]?.url} redirect={() => {setPlaylistId(playlist.id); redirectTo("/")}} />
                )
            )
        }      
    </div>
  )
}

export default PlaylistCollection