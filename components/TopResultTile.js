
import useSpotify from "../hooks/useSpotify"
import { useRecoilState } from "recoil"
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom"
import { playlistIdState } from "../atoms/playlistAtom"
import { redirectTo } from "../lib/misc"
import { PlayIcon } from "@heroicons/react/solid"
import { toast } from "react-toastify"

function TopResultTile({ id, name, image, type, uri }) {

    const spotifyApi = useSpotify()

    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState)
    const [playlistId, setPlaylistId] = useRecoilState(playlistIdState)
    const [isPlaying, setIsPlaying]           = useRecoilState(isPlayingState)

    const playSong = () => {
        setCurrentTrackId(id)
        setIsPlaying(true)

        spotifyApi.play({
            uris: [uri],
        }).catch(error => {
            toast.error(error)
        })
    }

    const handleClick = (event) =>{
        switch(type){
            case "SONG" : {
                playSong()
                break
            }
            case "ARTIST": {
                redirectTo(`/artist/${id}`)
                break
            }
            case "PLAYLIST": {
                setPlaylistId(id)
                redirectTo("/playlist")
                break
            }
            case "ALBUM": {
                redirectTo(`/album/${id}`)
                break
            }
            default:{
                toast.warning("Oops! This action is not available.")
                break
            }
        }
    }

  return (
    <div onClick={(e) => {handleClick(e)}} id={"id"} className='cursor-pointer group h-48 p-4 rounded-xl bg-[#181818] hover:bg-[#2A2A2A] transition transform duration-100 ease-in'>
    <img src={image} className="shadow-sm w-20 h-20 rounded-full" />
    <div className='flex mt-2'>
        <div>
            <h1 className="text-2xl font-bold">{name}</h1>
            <span className='text-sm font-bold p-1 px-2 bg-[#414141] rounded-lg'>{type}</span>                
        </div>
        <div className='flex-grow'>
            <div className='flex justify-end'>
                <button>
                    <PlayIcon className={`h-12 w-12 text-green-700 hidden group-hover:block transition transform duration-700 ease-in`} />
                </button>
            </div>
        </div>
    </div>
</div>
  )
}

export default TopResultTile