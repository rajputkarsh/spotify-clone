
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import useSpotify from "../../hooks/useSpotify" 
import { useRecoilState } from "recoil"
import { redirectTo } from "../../lib/misc"
import { playlistIdState } from "../../atoms/playlistAtom"
import UserProfile from "../../components/UserProfile"
import { MAX_VISIBLE_SONGS, FAVOURITE_COUNTRY, MAX_TILES_IN_A_ROW } from '../../constants/constants'
import Song from '../../components/Song'
import { shuffle } from 'lodash'
import PlaylistTiles from '../../components/PlaylistTiles'
import { concatenateArray } from '../../lib/artists'

function ArtistPlaylists() {

    const {data: session, status} = useSession()
    const [playlistId, setPlaylistId] = useRecoilState(playlistIdState)
    const router = useRouter()
    const { artist } = router.query

    const spotifyApi = useSpotify()

    const [topSongs, setTopSongs]             = useState([])
    const [artistInfo, setArtistInfo]         = useState(null)
    const [topAlbums, setTopAlbums]           = useState([])
    const [topPlaylists, setTopPlaylists]     = useState([])
    const [relatedArtists, setRelatedArtists] = useState([])

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
    }, [artist])    

    useEffect(() => {

        if(artist){
            spotifyApi.getArtistTopTracks(artist, FAVOURITE_COUNTRY)
            .then(
                data => {
                    setTopSongs(shuffle(data.body.tracks))
                }
            )
            .catch(
                error => {
                    console.log(error)
                }
            )
    
            spotifyApi.getArtist(artist).then(artistData => {

                spotifyApi.searchPlaylists(artistData.body.name, {limit: MAX_TILES_IN_A_ROW}).then(data => {
                    setTopPlaylists(shuffle(data.body.playlists.items))
                    setArtistInfo({
                        name : artistData.body.name,
                        image: artistData.body?.images[0].url 
                    })
                })                
            })
      
            spotifyApi.getArtistAlbums(artist).then(data => {
                setTopAlbums(shuffle(data.body.items))
            })

      
            spotifyApi.getArtistRelatedArtists(artist).then(data => {
                setRelatedArtists(shuffle(data.body.artists))
            }).catch(error =>{
                console.log("ERROR HERE - ", error)
            })            
        }        

    }, [session, spotifyApi, artist])    
    
    console.log(topPlaylists)

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
        <UserProfile />

        <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}>
                <img className="h-44 w-44 shadow-xl" src={artistInfo?.image} alt="" />
                <div>
                    <p>ARTIST</p>
                    <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">{artistInfo?.name}</h1>
                </div>
        </section>

        <div className="mt-8 px-8 flex flex-col space-y-1 text-white">
            <p className='text-2xl font-bold'>Popular</p>
            {
                topSongs.slice(0, MAX_VISIBLE_SONGS).map( (song, i) => (
                    <Song key={song.id} order={i} track={song}/>
                ))
            }
        </div>

        <div className="mt-8 px-8 space-y-1 text-white">
            <p className='text-2xl font-bold'>Listen to Playlists</p>
            <div className=' grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-4'>
                {
                    topPlaylists.map(
                        (playlist, i) => (
                            <PlaylistTiles key={`playlist-${i}-${playlist.id}`} id={playlist.id} name={playlist.name} description={""} image={playlist?.images[0]?.url} redirect={() => { setPlaylistId(playlist.id); redirectTo("/playlist")}} />
                        )
                    )
                }
            </div>
        </div>        

        <div className="mt-8 px-8 space-y-1 text-white">
            <p className='text-2xl font-bold'>Discover Albums</p>
            <div className=' grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-4'>
                {
                    topAlbums.slice(0, MAX_TILES_IN_A_ROW).map(
                        (album, i) => (
                            <PlaylistTiles key={`album-${i}-${album.id}`} id={album.id} name={album.name} description={`Total Tracks - ${album.total_tracks}`} image={album?.images[0]?.url} redirect={() => {redirectTo(`/album/${album.id}`)}} />
                        )
                    )
                }
            </div>
        </div>

        <div className="mt-8 px-8 flex flex-col space-y-1 text-white">
            <p className='text-2xl font-bold'>Related Artists</p>
            <div className=' grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-4'>
                {
                    relatedArtists.slice(0, MAX_TILES_IN_A_ROW).map(
                        (artist, i) => (
                            <PlaylistTiles key={`artist-${i}-${artist.id}`} id={artist.id} name={artist.name} description={`Genre - ${concatenateArray(artist, 'genre')}`} image={artist?.images[0]?.url} redirect={() => {redirectTo(`/artist/${artist.id}`)}} />
                        )
                    )
                }
            </div>
        </div>

    </div>
  )
}

export default ArtistPlaylists