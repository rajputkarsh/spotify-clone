import React, { useState, useEffect } from 'react'
import useSpotify from '../hooks/useSpotify'
import { useRecoilState } from 'recoil'
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom'
import { PlayIcon } from '@heroicons/react/solid'
import { PlusCircleIcon } from '@heroicons/react/outline'
import { toast } from 'react-toastify'
import Modal from './Modal'

function SongTile({ id, name, description, image, uri }) {
  const spotifyApi = useSpotify()

  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false)
  const [playlists, setPlaylists] = useState([])
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items)
      })
    }
  }, [spotifyApi])

  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState)
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)

  const playSong = () => {
    setCurrentTrackId(id)
    setIsPlaying(true)

    spotifyApi
      .play({
        uris: [uri],
      })
      .catch((error) => {
        // toast.dark('ERROR: Spotify Premium Required!')
      })
  }

  const addToPlaylist = (e) => {
    e.preventDefault();
    spotifyApi.addTracksToPlaylist(selectedPlaylist, [uri]).then(
      data => {
        toast.dark('Song added to playlist');
        setShowAddToPlaylistModal(false);
      }
    )
  }

  return (
    <React.Fragment>
      <div
        onClick={playSong}
        className="group h-80 w-60 transform cursor-pointer rounded-xl bg-[#181818] p-4 transition duration-100 ease-in hover:bg-[#2A2A2A] md:h-80 md:w-60"
      >
        <img src={image} className="shadow-sm" />
        <div className="mt-2 flex">
          <div>
            {name}
            <p className="text-gray-500">{description}</p>
          </div>
          <div className="flex-grow">
            <div className="flex justify-end">
              <button>
                <PlayIcon
                  className={`hidden h-12 w-12 transform text-green-700 transition duration-700 ease-in group-hover:block`}
                />
              </button>
            </div>
          </div>
        </div>
        <button
          className="absolute bottom-2 right-2 flex justify-end"
          onClick={() => setShowAddToPlaylistModal(true)}
        >
          <PlusCircleIcon className="h-5 w-5" />
        </button>
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
    </React.Fragment>
  )
}

export default SongTile
