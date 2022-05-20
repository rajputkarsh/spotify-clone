
import SongTile from "./SongTile"
import { useSession, signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import useSpotify from "../hooks/useSpotify"
import { concatenateArray } from "../lib/artists"
import { shuffle } from "lodash"
import PlaylistCollection from "./PlaylistCollection"
import { MAX_RECENT_SONGS, MAX_CATEGORIES } from "../constants/constants"
import UserProfile from "./UserProfile"

function HomeSections() {

    const spotifyApi = useSpotify()
    const {data: session, status} = useSession()
    const [recentlyPlayedSongs, setRecentlyPlayedSongs] = useState([])
    const [categories, setCategories] = useState([])

    const addRecentlyPlayedSongs = () => {
        spotifyApi.getMyRecentlyPlayedTracks({limit:10}).then((data) => {

            const uniqueRecentlyPlayedSongs = [...new Map(data.body.items.map(song =>
                [song?.track?.id, song])).values()].slice(0, MAX_RECENT_SONGS);

            setRecentlyPlayedSongs(uniqueRecentlyPlayedSongs)
        })
    }

    const addCategories = () => {
        spotifyApi.getCategories({country: "IN"}).then(data => {
            setCategories(shuffle(data.body?.categories?.items).slice(0, MAX_CATEGORIES))

        })
    }

    useEffect( () => {
        if(spotifyApi.getAccessToken()){
            addRecentlyPlayedSongs()
            addCategories()
        }
    }, [session, spotifyApi] )

    return (
        <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide ">

            <UserProfile />
    
            <section className={`flex items-end space-x-7  h-40 text-white p-8`}>
                <div>
                <h1 className="text-3xl font-bold">Recenty Played Songs</h1>
                </div>
            </section>
            <div className="z-1 p-10 pt-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 text-white gap-4 justify-center">
                {
                    recentlyPlayedSongs.map( 
                        (recentlyPlayedSong) => (
                            <SongTile key={recentlyPlayedSong?.track?.id} id={recentlyPlayedSong?.track?.id} name={recentlyPlayedSong?.track?.name} description={concatenateArray(recentlyPlayedSong?.track?.artists, 'name')} image={recentlyPlayedSong?.track?.album?.images[0]?.url} uri={recentlyPlayedSong?.track?.uri} />
                        )
                    )
                }
            </div>
                {
                    categories ? categories.map(
                        (category) => (
                            <>
                                <section className={`flex items-end space-x-7  h-30 text-white p-8`}>
                                    <div>
                                    <h1 className="text-3xl font-bold">{category.name}</h1>
                                    </div>
                                </section>     

                                <div>
                                    {
                                    <PlaylistCollection id={category.id} />   
                                    }                                 
                                </div>

                            </>
                        )
                    )
                    : ""
                }
        </div>
      )
}

export default HomeSections