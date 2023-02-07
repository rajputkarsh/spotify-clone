import { PlayIcon } from '@heroicons/react/solid'
import { PlusCircleIcon } from '@heroicons/react/outline'

function PlaylistTiles({ id, name, description, image, redirect }) {
  return (
    <div
      onClick={redirect}
      key={'pl-tile-' + id}
      id={id}
      className="group h-60 w-60 transform cursor-pointer rounded-xl bg-[#181818] p-4 transition duration-100 ease-in hover:bg-[#2A2A2A] md:h-80 md:w-60"
    >
      <img src={image} className="mr-auto ml-auto max-h-[70%] shadow-sm" />
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
    </div>
  )
}

export default PlaylistTiles
