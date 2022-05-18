
import Router from 'next/router'
import { useSession, signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import { ChevronDownIcon } from "@heroicons/react/outline"
import useSpotify from "../hooks/useSpotify"
import { useRecoilState } from "recoil"
import { playlistIdState } from "../atoms/playlistAtom"
import { shuffle } from "lodash"
import PlaylistTiles from "./PlaylistTiles"

function SearchWindow() {

    const spotifyApi = useSpotify()
    const {data: session, status} = useSession()
    const [genre, setGenre] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [playlistId, setPlaylistId] = useRecoilState(playlistIdState)

    const redirectTo = (url) => {
        Router.push(url)
    }

    const updateSearchTerm = (newSearchTerm) => {
        setSearchTerm(newSearchTerm)
    }

    const handKeyDownEvent = (e) => {
        if(e.key === "Enter"){
            redirectTo(`/search/${searchTerm}`)
        }
    }

    useEffect( () => {
        if(spotifyApi.getAccessToken()){
            spotifyApi.getCategories({country: "IN"}).then(data => {
                setGenre(shuffle(data.body?.categories?.items))
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

            <section className={`flex items-end space-x-7  h-24 text-white p-8`}>
                <div className="md:w-2/3">
                    <input onChange={(e) => updateSearchTerm(e.target.value)} onKeyDown={handKeyDownEvent} value={searchTerm} className="bg-white appearance-none border-2 border-gray-200 rounded-3xl w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-200" id="inline-full-name" type="text" placeholder="Artists, Songs or Podcasts" />
                </div>
            </section>

            <section className={`flex items-end space-x-7  h-20 text-white p-8`}>
                <div>
                    <h1 className="text-3xl font-bold">Browse All</h1>
                </div>
            </section>

            <div className="z-1 p-10 pt-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 text-white gap-4 justify-center">
            {
                genre.map(
                    (singleGenre) => (
                        <PlaylistTiles key={singleGenre.id} id={singleGenre.id} name={singleGenre.name} description={""} image={singleGenre?.icons[0]?.url} redirect={() => {redirectTo(`/genre/${singleGenre.id}`)}} />
                    )  
                )
            }                
            </div>

        </div>
    )
}

export default SearchWindow