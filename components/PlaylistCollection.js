
import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRecoilState } from "recoil"
import { playlistIdState } from "../atoms/playlistAtom"
import useSpotify from "../hooks/useSpotify"
import PlaylistTiles from "./PlaylistTiles"
import { redirectTo } from "../lib/misc"
import { MAX_PLAYLIST_SONGS } from "../constants/constants"

function PlaylistCollection({ id, name, limit=MAX_PLAYLIST_SONGS }) {

  const spotifyApi = useSpotify()
  const {data: session, status} = useSession()
  const [playlists, setPlaylists] = useState([])
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState)


  useEffect(() => {
    spotifyApi.getPlaylistsForCategory(id, {limit: limit})
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
                <PlaylistTiles key={"playlist-tile=" + id + "-" + playlist.name} id={id} name={playlist.name} description={""} image={playlist?.images[0]?.url} redirect={() => { setPlaylistId(playlist.id); redirectTo("/playlist")}} />
                )
            )
        }      
    </div>
  )
}

export default PlaylistCollection