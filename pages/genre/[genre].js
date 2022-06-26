
import { getSession, signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import useSpotify from "../../hooks/useSpotify" 
import { useRecoilState } from "recoil"
import { redirectTo } from "../../lib/misc"
import { playlistIdState } from "../../atoms/playlistAtom"
import PlaylistTiles from '../../components/PlaylistTiles'
import UserProfile from "../../components/UserProfile"

function Genre() {

    const {data: session, status} = useSession()
    const [playlistId, setPlaylistId] = useRecoilState(playlistIdState)
    const router = useRouter()
    const { genre } = router.query

    const spotifyApi = useSpotify()

    const [playlists, setPlaylists] = useState([])

    useEffect(() => {
      spotifyApi.getPlaylistsForCategory(genre, {limit: 20})
      .then(data => {
        setPlaylists(data.body.playlists.items)
      })
      .catch(error => {
        console.log("ERROR while fetching category playlist : ", error)
      })
  
    }, [session, spotifyApi])    

    return (

          <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
            <UserProfile />

            <section className={`flex items-end space-x-7 bg-gradient-to-b to-black  h-30 text-white p-8`}>
                <div>
                <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">Playlists</h1>
                </div>
            </section>
            <div className="z-1 mt-5 p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 text-white gap-4 justify-center">
                {
                    playlists.map( 
                        (playlist) => (
                        <PlaylistTiles key={playlist.id} id={playlist.id} name={playlist.name} description={""} image={playlist?.images[0]?.url} redirect={() => { setPlaylistId(playlist.id); redirectTo("/playlist")}} />
                        )
                    )
                }

            </div>
        </div>
  )
}

export default Genre


export async function getServerSideProps(context){
  const session = await getSession(context)

  return {
    props:{
      session
    }
  }
}