import React from 'react'

function ArtistTile() {
  return (
    <div onClick={() => {}} id={"id"} className='cursor-pointer group h-60 w-60 md:h-80 md:w-60 p-4 rounded-xl bg-[#181818] hover:bg-[#2A2A2A] transition transform duration-100 ease-in'>
    <img src={""} className="shadow-sm" />
    <div className='flex mt-2'>
        <div>
            {"name"}
            <p className='text-gray-500'>{"description"}</p>                
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

export default ArtistTile