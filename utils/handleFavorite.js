import { ACTIONS } from "./actions";

export const createDatabaseObj = (target, data)=>{
    let artists = [];
    let songInfo = data.find((song)=>{
        return song.id === target.dataset.id
    })
    if(songInfo.hasOwnProperty('tracks')){
        songInfo = {...songInfo, preview_url: songInfo.tracks.items[0].preview_url}
    }
    songInfo.artists.forEach((artist)=>{
        artists.push(artist.name)
    })
    songInfo = {...songInfo, artistsNames: artists}

    return songInfo;
}

export const handleFavoriteClick = async (e, data, session, dispatch, sideBarObj) => {
        try {
            let songInfo;
            if(data){
                songInfo = createDatabaseObj(e.target, data)
            }
            else{
                songInfo = sideBarObj
            }
            await fetch(`/api/favorites/${session.user.id}`, {
                method: 'POST',
                body: JSON.stringify({
                    songInfo,
                })
            })
            const response = await fetch(`/api/favorites/${session.user.id}`, {
                method: 'GET'
            })
            const updatedFavorites = await response.json();
            dispatch({ type: ACTIONS.SET_USER_FAVORITES, payload: updatedFavorites.favorites })
        } catch (err) {
            throw new Error(err)
        }
    
}