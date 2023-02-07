import { useCallback, useEffect, useState } from 'react'
import Router from 'next/router';
import { useSession } from 'next-auth/react'
import { useRecoilState } from 'recoil'
import { debounce } from 'lodash'
import useSpotify from '../hooks/useSpotify'
import useSongInfo from '../hooks/useSongInfo'
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom'
import {
  HeartIcon,
  VolumeUpIcon as VolumeDownIcon,
} from '@heroicons/react/outline'
import {
  HeartIcon as FilledHeartIcon,
  FastForwardIcon,
  PlayIcon,
  PauseIcon,
  ReplyIcon,
  RewindIcon,
  SwitchHorizontalIcon,
  VolumeUpIcon,
} from '@heroicons/react/solid'


import { toast } from 'react-toastify'

function Player() {
  const spotifyApi = useSpotify()
  const { data: session, status } = useSession()
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState)
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)

  const [volume, setVolume] = useState(50);
  const [isLiked, setLiked] = useState(false);

  const songInfo = useSongInfo()

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        setCurrentTrackId(data.body?.item?.id)

        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing)
        })
      })
    }
  }

  const handleLikeSong = () => {
    if(isLiked){
        spotifyApi.removeFromMySavedTracks([currentTrackId]).then(setLiked(false));
        Router.reload(window.location.pathname);
    } else{
        spotifyApi.addToMySavedTracks([currentTrackId]).then(setLiked(true));
    }
  }

  const handlePlayPause = () => {
    spotifyApi
      .getMyCurrentPlaybackState()
      .then((data) => {
        if (data.body?.is_playing) {
          spotifyApi.pause()
          setIsPlaying(false)
        } else {
          spotifyApi.play()
          setIsPlaying(false)
        }
      })
      .catch((error) => {
        toast.error(
          'This API requires Spotify to be running in one of your devices'
        )
        console.log(error)
      })
  }

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackId, spotifyApi, session])

  useEffect(() => {
    if (spotifyApi.getAccessToken()){
        spotifyApi.getMySavedTracks().then(data => {
            console.log('liked tracks - ', data.body.items);
            data.body.items.forEach(track => {
                if(track?.track?.id == currentTrackId){
                    setLiked(true);
                    return;
                }
            })
          })    
    }
  }, [songInfo, currentTrackId]);

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume)
    }
  }, [volume])

  const debouncedAdjustVolume = useCallback(() =>
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((error) => {
        console.log(error)
      })
    }, 100)
  )

  return (
    <div className="grid h-20 grid-cols-3 bg-gradient-to-b from-black to-gray-900 px-2 text-xs text-white md:px-8 md:text-base">
      {/* left */}
      <div className="flex items-center space-x-4">
        <img
          className={`hidden md:inline ${
            songInfo?.album.images?.[0]?.url ? '' : 'md:hidden'
          } h-10 w-10`}
          src={songInfo?.album.images?.[0]?.url}
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
        {songInfo?.name && (
          <button
            onClick={() => {
              handleLikeSong()
            }}
            className="flex items-center space-x-2 hover:text-white "
          >
            {
                isLiked ? <FilledHeartIcon className="h-5 w-5" /> : <HeartIcon className="h-5 w-5" />
            }
          </button>
        )}
      </div>

      {/* center */}
      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="button" />
        <RewindIcon
          className="button"
          onClick={() => spotifyApi.skipToPrevious()}
        />

        {isPlaying ? (
          <PauseIcon onClick={handlePlayPause} className="button h-10 w-10" />
        ) : (
          <PlayIcon onClick={handlePlayPause} className="button h-10 w-10" />
        )}

        <FastForwardIcon
          className="button"
          onClick={() => spotifyApi.skiptoNext()}
        />
        <ReplyIcon className="button" />
      </div>

      {/* right */}

      <div className="flex items-center justify-end space-x-3 pr-5 md:space-x-4">
        <VolumeDownIcon
          onClick={() => volume > 0 && setVolume(volume - 10)}
          className="button"
        />
        <input
          className="md:56 w-28"
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => {
            setVolume(Number(e.target.value))
          }}
        />
        <VolumeUpIcon
          onClick={() => volume < 100 && setVolume(volume + 10)}
          className="button"
        />
      </div>
    </div>
  )
}

export default Player
