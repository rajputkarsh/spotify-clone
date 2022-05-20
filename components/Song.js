
import { toast } from "react-toastify"
import { useRecoilState } from "recoil"
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom"
import useSpotify from "../hooks/useSpotify"
import { concatenateArray } from "../lib/artists"
import { millisecondsToMinsAndSeconds } from "../lib/time"

function Song( { order, track, small=false } ) {  
    
    const spotifyApi = useSpotify()

    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState)
    const [isPlaying, setIsPlaying]           = useRecoilState(isPlayingState)

    const playSong = () => {
        setCurrentTrackId(track.id)
        setIsPlaying(true)

        spotifyApi.play({
            uris: [track.uri],
        }).catch(error => {
            toast.error(error   )
        })
    }

    return small ? 
        (
            <div onClick={playSong} className="grid grid-cols-2 pl-2 text-gray-600 hover:bg-gray-900 rounded-lg">
                <div className="flex items-center space-x-4">
                    <p>{order + 1}</p>
                    <img className="h-8 w-8" src={track?.album?.images[0]?.url} />                
                
                    <div>
                        <p className="w-20 lg:w-64 truncate text-white">{track.name}</p>
                        <p className="w-24 ">{concatenateArray([track.artists[0]], 'name')}</p>
                    </div>

                    <div className="flex items-center justify-between ml-auto md:ml-0">
                        <p>{millisecondsToMinsAndSeconds(track.duration_ms)}</p>
                    </div>

                </div>
            </div>
        )
    
    : (
        <div onClick={playSong} className="grid grid-cols-2 text-gray-600 py-4 px-5 hover:bg-gray-900 rounded-lg">
            <div className="flex items-center space-x-4">
                <p>{order + 1}</p>
                <img className="h-10 w-10" src={track?.album?.images[0]?.url} />                
            
                <div>
                    <p className="w-36 lg:w-64 truncate text-white">{track.name}</p>
                    <p className="w-40 ">{concatenateArray(track.artists, 'name')}</p>
                </div>

                <div className="flex items-center justify-between ml-auto md:ml-0">
                    <p className="w-40 hidden md:inline">{track.album.name}</p>
                    <p>{millisecondsToMinsAndSeconds(track.duration_ms)}</p>
                </div>

            </div>
        </div>
    )


}

export default Song