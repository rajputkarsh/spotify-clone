import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useRecoilState } from 'recoil'
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom'
import useSpotify from '../hooks/useSpotify'
import { concatenateArray } from '../lib/artists'
import { millisecondsToMinsAndSeconds } from '../lib/time'
import { PlusCircleIcon } from '@heroicons/react/outline'
import Modal from './Modal'

function Song({ order, track, small = false }) {
  const spotifyApi = useSpotify()

  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState)
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)

  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false)
  const [playlists, setPlaylists] = useState([])
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items)
      })
    }
  }, [spotifyApi])

  const playSong = () => {
    setCurrentTrackId(track.id)
    setIsPlaying(true)

    spotifyApi
      .play({
        uris: [track.uri],
      })
      .catch((error) => {
        // toast.dark('ERROR: Spotify Premium Required!')
      })
  }

  const addToPlaylist = (e) => {
    e.preventDefault();
    spotifyApi.addTracksToPlaylist(selectedPlaylist, [track.uri]).then(
      data => {
        toast.dark('Song added to playlist');
        setShowAddToPlaylistModal(false);
      }
    )
  }  

  return small ? (
    <div
      className="grid grid-cols-2 rounded-lg pl-2 text-gray-600 hover:bg-gray-900"
    >
      <div className="flex items-center space-x-4">
        <p>{order + 1}</p>
        <img className="h-8 w-8" src={track?.album?.images[0]?.url} />

        <div>
          <p className="w-20 truncate text-white lg:w-64">{track.name}</p>
          <p className="w-24 ">
            {concatenateArray([track.artists[0]], 'name')}
          </p>
        </div>

        <div className="ml-auto flex items-center justify-between md:ml-0">
          <p>{millisecondsToMinsAndSeconds(track.duration_ms)}</p>
        </div>
        
        <div>
          <button
            className=""
            onClick={() => setShowAddToPlaylistModal(true)}
          >
            <PlusCircleIcon className="text-white h-5 w-5" style={{display:'inline'}}/>
          </button>
        </div>

      </div>
    </div>
  ) : (
    <div
      onClick={playSong}
      className="grid grid-cols-2 rounded-lg py-4 px-5 text-gray-600 hover:bg-gray-900"
    >
      <div className="flex items-center space-x-4">
        <p>{order + 1}</p>
        <img className="h-10 w-10" src={track?.album?.images[0]?.url} />

        <div>
          <p className="w-36 truncate text-white lg:w-64">{track.name}</p>
          <p className="w-40 ">{concatenateArray(track.artists, 'name')}</p>
        </div>

        <div className="ml-auto flex items-center justify-between md:ml-0">
          <p className="hidden w-40 md:inline">{track.album.name}</p>
          <p>{millisecondsToMinsAndSeconds(track.duration_ms)}</p>
        </div>

        <div className=''>
          <button style={{width: 'max-content', backgroundColor: '#181818'}}
            className=""
            onClick={() => setShowAddToPlaylistModal(true)}
          >
            <PlusCircleIcon className="text-white h-5 w-5" style={{display:'inline'}}/>
            <span className='p-2'>
              Add to Playlist
            </span>
          </button>
        </div>
      </div>
      {showAddToPlaylistModal && (
        <Modal
          setShowModal={setShowAddToPlaylistModal}
          title={'Add to Playlist'}
        >
          {
            <div className="flex w-full max-w-sm flex-col">
              <div className="mb-6 md:flex md:items-center">
                <div className="md:w-full">
                  <label for={'select_playlist'}>
                    Select a playlist
                  </label>
                  <select
                    id={'select_playlist'}
                    className="text-white"
                    style={{ backgroundColor: '#181818', marginLeft: '1rem' }}
                    onChange={(e) => {setSelectedPlaylist(e.target.value)} }
                    value={selectedPlaylist}
                  >
                    {playlists.map((playlist) => (
                      <option value={playlist.id}>{playlist.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={(e) => addToPlaylist(e)}
                className="rounded border border-gray-400 bg-white py-2 px-4 font-semibold text-gray-800 shadow hover:bg-gray-100"
              >
                Add
              </button>              
            </div>
          }
        </Modal>
      )}
    </div>
  )
}

export default Song
