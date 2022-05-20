
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import useSpotify from "../../hooks/useSpotify" 
import { useRecoilState } from "recoil"
import { playlistIdState } from "../../atoms/playlistAtom"
import UserProfile from "../../components/UserProfile"
import { FAVOURITE_COUNTRY, MAX_TILES_IN_A_ROW } from '../../constants/constants'
import { shuffle } from 'lodash'
import SongTile from '../../components/SongTile'
import { concatenateArray } from '../../lib/artists'
import { millisecondsToMinsAndSeconds } from '../../lib/time'
import AlbumTrack from '../../components/AlbumTrack'
import { redirectTo } from '../../lib/misc'
import PlaylistTiles from '../../components/PlaylistTiles'

function AlbumPlaylists() {

    const {data: session, status} = useSession()
    const [playlistId, setPlaylistId] = useRecoilState(playlistIdState)
    const router = useRouter()
    const { album } = router.query

    const spotifyApi = useSpotify()

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

    const [albumInfo, setAlbumInfo] = useState(null)
    const [songs, setSongs]         = useState([])
    const [topTracks, setTopTracks] = useState([])
    const [topAlbums, setTopAlbums] = useState([])
    const [relatedArtists, setRelatedArtists] = useState([])

    const totalTimeReducer = (total, track) => {
        return total+track.duration_ms
    }

    useEffect(() => {
        setColor(shuffle(colors).pop())
    }, [album])    

    useEffect(() => {
        spotifyApi.getAlbum(album).then(artistData => {

            const artistId = artistData?.body?.artists?.[0]?.id

            spotifyApi.getArtistTopTracks(artistId, FAVOURITE_COUNTRY).then(topTracksData => {
                setTopTracks(topTracksData.body.tracks)
            })
            .catch(error => {
                console.log("ERROR -- ", error)
            })
        
            spotifyApi.getArtistAlbums(artistId).then(data => {
                setTopAlbums(data.body.items)
            })

            spotifyApi.getArtistRelatedArtists(artistId).then(data => {
                setRelatedArtists(shuffle(data.body.artists))
            }).catch(error =>{
                console.log("ERROR HERE - ", error)
            })             

            setAlbumInfo({
                id           : artistData.body.id,
                name         : artistData.body.name,
                image        : artistData.body.images?.[0].url,
                artists      : concatenateArray(artistData.body.artists, 'name'),
                artistId     : artistId,
                releaseDate  : artistData.body.release_date,
                tracks       : artistData.body.total_tracks,
                totalDuration: millisecondsToMinsAndSeconds(artistData.body.tracks.items.reduce(totalTimeReducer, 0))
            })
        })

        spotifyApi.getAlbumTracks(album).then(data => {
            setSongs(data.body.items)
        })
    }
    , [album, session, spotifyApi])


    return (
        <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
            <UserProfile />
    
            <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}>
                    <img className="h-44 w-44 shadow-xl" src={albumInfo?.image} alt="" />
                    <div>
                        <p>ALBUM</p>
                        <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">{albumInfo?.name}</h1>
                        <div>   
                            <p>{albumInfo?.artists}</p>
                            <ul className="flex list-disc pl-4">
                                <li className='pr-2 mr-2'>{`${albumInfo?.tracks} track${ albumInfo?.tracks > 1 ? 's' : '' } `}</li>
                                <li className='ml-2'>{albumInfo?.totalDuration}</li>
                            </ul>
                        </div>
                    </div>
            </section>
    
            <div className="mt-8 px-8 flex flex-col space-y-1 text-white">
                <p className='text-2xl font-bold'>Songs</p>
                {
                    songs.map( (song, i) => (
                        <AlbumTrack key={song?.id} order={i} id={song?.id} uri={song?.uri} name={song?.name} albumName={albumInfo?.name} duration={song?.duration_ms} image={albumInfo?.image} artists={albumInfo?.artists}/>
                    ))
                }
            </div>
    
            <div className="mt-8 px-8 space-y-1 text-white">
                <p className='text-2xl font-bold'>Popular Releases By {albumInfo?.artists}</p>
                <div className=' grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-4'>
                    {
                        topTracks.slice(0, MAX_TILES_IN_A_ROW).map(
                            (track, i) => (
                                <SongTile key={`track-${i}-${track.id}`} id={track.id} name={track.name} description={""} image={track?.album?.images?.[0]?.url} />
                            )
                        )
                    }
                </div>
            </div>        
    
            <div className="mt-8 px-8 space-y-1 text-white">
                <p className='text-2xl font-bold'>More Albums by {albumInfo?.artists}</p>
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

export default AlbumPlaylists