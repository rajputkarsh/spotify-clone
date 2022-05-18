
import {PlayIcon} from "@heroicons/react/solid"

function TopResultTile({ id, name, image, type }) {
  return (
    <div onClick={() => {}} id={"id"} className='cursor-pointer group h-48 p-4 rounded-xl bg-[#181818] hover:bg-[#2A2A2A] transition transform duration-100 ease-in'>
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