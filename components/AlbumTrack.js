
import { toast } from "react-toastify"
import { useRecoilState } from "recoil"
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom"
import useSpotify from "../hooks/useSpotify"
import { millisecondsToMinsAndSeconds } from "../lib/time"

function AlbumTrack( { order, id, uri, name, albumName, duration, image, artists, small=false } ) {  
    
    const spotifyApi = useSpotify()

    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState)
    const [isPlaying, setIsPlaying]           = useRecoilState(isPlayingState)

    const playSong = () => {
        setCurrentTrackId(id)
        setIsPlaying(true)

        spotifyApi.play({
            uris: [uri],
        }).catch(error => {
            // toast.dark('ERROR: Spotify Premium Required!')
        });
    }

    return small ? 
        (
            <div onClick={playSong} className="grid grid-cols-2 pl-2 text-gray-600 hover:bg-gray-900 rounded-lg">
                <div className="flex items-center space-x-4">
                    <p>{order + 1}</p>
                    <img className="h-8 w-8" src={image} />                
                
                    <div>
                        <p className="w-20 lg:w-64 truncate text-white">{name}</p>
                        <p className="w-24 ">{artists}</p>
                    </div>

                    <div className="flex items-center justify-between ml-auto md:ml-0">
                        <p>{millisecondsToMinsAndSeconds(duration)}</p>
                    </div>

                </div>
            </div>
        )
    
    : (
        <div onClick={playSong} className="grid grid-cols-2 text-gray-600 py-4 px-5 hover:bg-gray-900 rounded-lg">
            <div className="flex items-center space-x-4">
                <p>{order + 1}</p>
                <img className="h-10 w-10" src={image} />                
            
                <div>
                    <p className="w-36 lg:w-64 truncate text-white">{name}</p>
                    <p className="w-40 ">{artists}</p>
                </div>

                <div className="flex items-center justify-between ml-auto md:ml-0">
                    <p className="w-40 hidden md:inline">{albumName}</p>
                    <p>{millisecondsToMinsAndSeconds(duration)}</p>
                </div>

            </div>
        </div>
    )


}

export default AlbumTrack