
function getArtistNames(artists){
    var artistNames = [];
  
    for (var i = 0; i < artists.length; i++){
        artistNames.push(artists[i].name);
    }
  
    return artistNames.join(", ");
  }

function Song( { order, track } ) {  
    
    console.log(track)

    return (
        <div>
            <div className="flex items-center space-x-4">
                <p>{order + 1}</p>
                <img className="h-10 w-10" src={track?.album?.images[0]?.url} />                
            
                <div>
                    <p>{track.name}</p>
                    <p>{getArtistNames(track.artists)}</p>
                </div>

                <div>
                    <p>{track.album.name}</p>
                    <p>{track.duration_ms}</p>
                </div>

            </div>
        </div>
    )
}

export default Song