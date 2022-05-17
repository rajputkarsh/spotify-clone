
import SongTile from "./SongTile"
import Router from 'next/router'
import { useSession, signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import { ChevronDownIcon } from "@heroicons/react/outline"
import useSpotify from "../hooks/useSpotify"
import { getArtistNames } from "../lib/artists"

function HomeSections() {

    const spotifyApi = useSpotify()
    const {data: session, status} = useSession()
    const [recentlyPlayedSongs, setRecentlyPlayedSongs] = useState([])

    const TOTAL_RECENT_SONGS = 3

    useEffect( () => {
        if(spotifyApi.getAccessToken()){
            spotifyApi.getMyRecentlyPlayedTracks({limit:10}).then((data) => {

                const uniqueRecentlyPlayedSongs = [...new Map(data.body.items.map(song =>
                    [song?.track?.id, song])).values()].slice(0, TOTAL_RECENT_SONGS);

                setRecentlyPlayedSongs(uniqueRecentlyPlayedSongs)
            })
        }
    }, [session, spotifyApi] )


    return (
        <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
            <header className="absolute top-5 right-8  z-10">
                <div onClick={signOut} className="flex items-center bg-black text-white space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2">
                    <img className="rounded-full w-10 h-10" src={session?.user?.image ?? "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"} alt="" />
                    <h2>{ session?.user?.name }</h2>
                    <ChevronDownIcon className="h-5 w-5" />
                </div>
            </header>
    
            <section className={`flex items-end space-x-7  h-40 text-white p-8`}>
                <div>
                <h1 className="text-3xl font-bold">Recenty Played Songs</h1>
                </div>
            </section>
            <div className="z-1 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 text-white gap-4 justify-center">
                {
                    recentlyPlayedSongs.map( 
                        (recentlyPlayedSong) => (
                            <SongTile key={recentlyPlayedSong?.track?.id} id={recentlyPlayedSong?.track?.id} name={recentlyPlayedSong?.track?.name} description={getArtistNames(recentlyPlayedSong?.track?.artists)} image={recentlyPlayedSong?.track?.album?.images[0]?.url} uri={recentlyPlayedSong?.track?.uri} />
                        )
                    )
                }
    
            </div>
        </div>
      )
}

export default HomeSections