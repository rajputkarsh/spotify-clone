
import { ChevronDownIcon } from "@heroicons/react/outline"
import { getSession, signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import useSpotify from "../../hooks/useSpotify" 
import PlaylistTiles from '../../components/PlaylistTiles'

function Genre() {

    const {data: session, status} = useSession()
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
            <header className="absolute top-5 right-8  z-10">
                <div onClick={signOut} className="flex items-center bg-black text-white space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2">
                    <img className="rounded-full w-10 h-10" src={session?.user?.image ?? "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"} alt="" />
                    <h2>{ session?.user?.name }</h2>
                    <ChevronDownIcon className="h-5 w-5" />
                </div>
            </header>

            <section className={`flex items-end space-x-7 bg-gradient-to-b to-black  h-30 text-white p-8`}>
                <div>
                <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">Playlists</h1>
                </div>
            </section>
            <div className="z-1 mt-5 p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 text-white gap-4 justify-center">
                {
                    playlists.map( 
                        (playlist) => (
                            <PlaylistTiles key={playlist.id} id={playlist.id} name={playlist.name} description={""} image={playlist?.images[0]?.url} redirect={() => {setPlaylistId(playlist.id); redirectTo("/")}} />
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