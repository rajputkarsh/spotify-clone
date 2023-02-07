import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import Router from 'next/router'
import Songs from './Songs'
import { useRecoilState, useRecoilValue } from 'recoil'
import UserProfile from './UserProfile'
import { playlistState, playlistIdState } from '../atoms/playlistAtom'
import useSpotify from '../hooks/useSpotify'
import { shuffle } from 'lodash'
import Modal from '../components/Modal'
import { toast } from 'react-toastify'

function Center() {
  const spotifyApi = useSpotify()
  const { data: session, status } = useSession()
  const playlistId = useRecoilValue(playlistIdState)
  const [playlist, setPlaylist] = useRecoilState(playlistState)

  const colors = [
    'from-indigo-500',
    'from-blue-500',
    'from-green-500',
    'from-red-500',
    'from-yellow-500',
    'from-pink-500',
    'from-purple-500',
  ]

  const [color, setColor] = useState(null)
  const [updatePlaylist, setUpdatePlaylist] = useState(false)

  const [playlistName, setPlaylistName] = useState('')
  const [playlistDesc, setPlaylistDesc] = useState('')

  useEffect(() => {
    setColor(shuffle(colors).pop())
  }, [playlistId])

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylist(data.body)
        setPlaylistName(data.body.name)
        setPlaylistDesc(data.body.description)
        setPlaylistUrl(
          data.body?.images.length > 0 ? data.body?.images[0]?.url : ''
        )
      })
      .catch((error) => {
        console.log('Error in fetching playlist songs : ', error)
      })
  }, [playlistId, spotifyApi])

  const handleUpdatePlaylist = () => {
    setUpdatePlaylist(true)
  }

  const updatePlaylistData = (e) => {
    e.preventDefault();

    if(!playlistName){
      toast.dark("Please enter valid playlist name");
      return;
    }
    if(!playlistDesc){
      toast.dark("Please enter valid playlist description");
      return;
    }

      spotifyApi.changePlaylistDetails(playlist.id, {
        name: playlistName,
        description: playlistDesc,
      }).then((data) => {
      Router.reload(window.location.pathname)
      })
  }

  return (
    <div className="h-screen flex-grow overflow-y-scroll scrollbar-hide">
      <UserProfile />

      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 p-8 text-white`}
      >
        <img
          className="h-44 w-44 shadow-xl"
          src={playlist?.images[0]?.url ?? "https://i.scdn.co/image/ab67706c0000bebb350b10ee68315601a3a177be"}
          alt=""
        />
        <div>
          <p>PLAYLIST</p>
          <h1
            className="text-2xl font-bold md:text-3xl xl:text-5xl"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              handleUpdatePlaylist()
            }}
          >
            {playlist?.name}
          </h1>
        </div>
      </section>
      <div className="mt-5">
        {playlist?.tracks?.items && playlist?.tracks?.items.length > 0 ? (
          <Songs />
        ) : (
          <>
            <br />
            <h3 className=" p-8 text-white">
              You need to add songs in your Spotify Account
            </h3>
          </>
        )}
      </div>
      {updatePlaylist && (
        <Modal setShowModal={setUpdatePlaylist} title={'Update Playlist'}>
          {
            <div className="flex w-full max-w-sm flex-col">
              <div className="mb-6 md:flex md:items-center">
                <div className="md:w-full">
                  <input
                    className="w-full appearance-none rounded py-2 px-4 leading-tight text-white focus:border-purple-500 focus:bg-white focus:outline-none"
                    type="text"
                    style={{ backgroundColor: '#181818' }}
                    placeholder={'Playlist Name'}
                    value={playlistName}
                    onChange={(e) => {
                      setPlaylistName(e.target.value)
                    }}
                  />
                </div>
              </div>

              <div className="mb-6 md:flex md:items-center">
                <div className="md:w-full">
                  <input
                    className="w-full appearance-none rounded py-2 px-4 leading-tight text-white focus:border-purple-500 focus:bg-white focus:outline-none"
                    type="text"
                    style={{ backgroundColor: '#181818' }}
                    placeholder={'Playlist Description'}
                    value={playlistDesc}
                    onChange={(e) => {
                      setPlaylistDesc(e.target.value)
                    }}
                  />
                </div>
              </div>

              <button
                onClick={(e) => updatePlaylistData(e)}
                className="rounded border border-gray-400 bg-white py-2 px-4 font-semibold text-gray-800 shadow hover:bg-gray-100"
              >
                Update
              </button>
            </div>
          }
        </Modal>
      )}
    </div>
  )
}

export default Center
