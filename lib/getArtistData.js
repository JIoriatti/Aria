export const getAccessToken = async () =>{
    try{
        const response = await fetch('https://accounts.spotify.com/api/token',{
            method: "POST",
            headers : {
            'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `grant_type=client_credentials&client_id=${process.env.SPOTIFY_CLIENT_ID}&client_secret=${process.env.SPOTIFY_CLIENT_SECRET}`
        })
        const responseToJSON = await response.json();
        return responseToJSON.access_token;

    }catch(err){
        console.log(err)
    }
}
export const getArtistId = async (token, artistName)=>{
    try{
        const response = await fetch(`https://api.spotify.com/v1/search?q=artist:${encodeURIComponent(artistName)}&type=artist`,{
            headers: {
                'Authorization': `Bearer  ${token}`
                }
        })
        const resToJson = await response.json();
        return resToJson.artists.items[0].id

    }catch(err){
        console.log(err)
    }
}
export const getArtistInfo = async (token, artistId) =>{
    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`,{
        headers: {
        'Authorization': `Bearer  ${token}`
        }
    })
    const responseToJSON = await response.json();
    return responseToJSON;
}

export const getArtistAlbums = async (token, artistId, url=`https://api.spotify.com/v1/artists/${artistId}/albums`, prevArray = []) =>{
    return fetch(url,{
        headers: {
            'Authorization': `Bearer  ${token}`
            }
    }).then((response)=>{
        return response.json();
    }).then((res)=>{
        console.log(res)
        let finalArray = [ ...prevArray, ...res.items ]
        console.log(finalArray)
        if(res.next && finalArray.length< 90){
            return getArtistAlbums(token, artistId, res.next, finalArray)
        }
        return finalArray;
    }) 
}
// LIMIT NUMBER OF FETCHES
export const getAlbumTracks = async (albumID, token)=>{
    const response = await fetch(`https://api.spotify.com/v1/albums/${albumID}/tracks`,{
        headers: {
            'Authorization': `Bearer  ${token}`
            }
    })
    const tracksOnAlbum = await response.json();
    return tracksOnAlbum;
}
export const getTopTracks = async (token, artistId)=>{
    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=US`,{
        headers: {
            'Authorization': `Bearer  ${token}`,
            }
    })
    const topTracks = await response.json();
    const filteredTopTracks = topTracks.tracks.map((track)=>{
        return track = {...track, images: track.album.images, album_type: track.album.album_type, isTopTrack: true}
    })
    return filteredTopTracks;
}

export default async function getArtistData (artistName){
    //{"US","United States of America"}
    const fetchArtistData = async () =>{
        const token = await getAccessToken();
        const artistId = await getArtistId(token, artistName)
        const artistInfo = await getArtistInfo(token, artistId);
        const albumData = await getArtistAlbums(token, artistId);
        const topTracks = await getTopTracks(token, artistId)
        const allAlbumTracks = albumData.map((album, i)=>{
                if(i<63){
                    return getAlbumTracks(album.id, token).then((tracks)=>{
                        return {
                            albumName: album.name,
                            tracks,
                        }   
                    })
                }
        }).filter((arrayIndex)=>{
            return arrayIndex!== undefined
        })
        const tracks = await Promise.all(allAlbumTracks);
        const albums = albumData.slice(0,63).map((album)=>{
            let matchedTracks = tracks.find((groupOfTracks)=>{
                return groupOfTracks.albumName === album.name
            })
            
            return album = {...album, tracks: matchedTracks.tracks}
            }).slice(0,300)
        
        let isJR = false;
        
        //*** TEMPORARY */
        if(artistInfo.name === 'Jason Ross'){
            isJR = true
        }
        //limiting the amount of data being displayed to 100 items for performance
        //implement fetch as user explores later
        return {artistInfo, albums, tracks, topTracks, artistId, isJR};
      }


    return fetchArtistData();
}
