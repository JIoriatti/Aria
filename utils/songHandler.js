import { ACTIONS } from "./actions";
const V_STEP = 0.06
const MAX = 0.5
const MIN = 0
const INTERVAL = 200 //200
const SHORT_DUR = 1000 //1000
const LONG_DUR = 2000   //2000
const DUR_THRESHOLD = 0.95


const createSong = (mp3)=>{
    const newAudio = new Audio(mp3);
    return newAudio
}
const fadeSongIn = (newSong)=>{
    let songFadeIn = setInterval(() => {
        if(newSong.volume + V_STEP < MAX){
            newSong.volume += V_STEP;
        }
        if(newSong.volume + V_STEP > MAX){
            newSong.volume = MAX
        }
    }, INTERVAL)
    let songFadeInEnd = setTimeout(() => {
        clearInterval(songFadeIn)
    }, LONG_DUR)

    return ()=> {
        clearTimeout(songFadeInEnd)
    }
}
const fadeSongOut = (newSong) => {
    const songFadeOut = setInterval(() => {
        if (newSong.volume - V_STEP > MIN) {
            newSong.volume -= V_STEP;
        }
        if(newSong.volume - V_STEP < MIN){
            newSong.volume = MIN
        }
    }, INTERVAL)
    const songFadeOutEnd = setTimeout(() => {
        clearInterval(songFadeOut)
    }, LONG_DUR)
    return () => clearTimeout(songFadeOutEnd);
}

export const handleSongChange = (e, state, dispatch, songDispatch, session) => {
    if(session){
        if(state.userHistory.some((song)=> song.songName === e.target.dataset.song)){
            dispatch({type: ACTIONS.SET_IS_HISTORY_PLAYING, payload: true})
        }
        else{
            dispatch({type: ACTIONS.SET_IS_HISTORY_PLAYING, payload: false})
        }
    }
    if (e.target.dataset.mp3 === state?.selectedMp3 && !state?.isSongPlaying) {
        state.currentSong.play();
    }
    if (e.target.dataset.mp3 === state?.selectedMp3 && state?.isSongPlaying) {
        state?.currentSong?.pause();
    }
    if (!state.currentSong || e.target.dataset.mp3 !== state?.selectedMp3) {
        state?.currentSong?.pause();
        dispatch({ type: ACTIONS.SET_SONG_TIME, payload: 0})
        songDispatch({type: ACTIONS.SET_SONG_TIME, payload: 0})

        const newSong = createSong(e.target.dataset.mp3);
        newSong.preload = 'metadata'
        newSong.onloadedmetadata = function () {
            dispatch({ type: ACTIONS.SET_SONG_DURATION, payload: newSong.duration })
            songDispatch({type: ACTIONS.SET_SONG_DURATION, payload: newSong.duration})
        }
        function handleFadeOut() {
            if(newSong.currentTime > newSong.duration * DUR_THRESHOLD){
                //avoiding the fadeout interval from being fired every time the songTime changes
                //past the 95% threshold
                fadeSongOut(newSong);
                newSong.removeEventListener('timeupdate', handleFadeOut)
            }
        }
        newSong.addEventListener('timeupdate', handleFadeOut)

        newSong.addEventListener('play', () => {
            songDispatch({type: ACTIONS.HAS_SONG_ENDED, payload: false})
            songDispatch({type: ACTIONS.IS_TIMER_HIT, payload: false})

            newSong._updateInterval = setInterval(() => {
                dispatch({ type: ACTIONS.SET_SONG_TIME, payload: newSong.currentTime + 1 })
                songDispatch({type: ACTIONS.SET_SONG_TIME, payload: newSong.currentTime + 1})
            }, SHORT_DUR);
          }, true);
          
        newSong.addEventListener('pause', () => clearInterval(newSong._updateInterval), true)

        newSong.onended = function () {
            dispatch({ type: ACTIONS.SET_IS_SONG_PLAYING, payload: false })
            songDispatch({ type: ACTIONS.SET_IS_SONG_PLAYING, payload: false })
            songDispatch({type: ACTIONS.HAS_SONG_ENDED, payload: true})
            dispatch({ type: ACTIONS.SET_SELECTED_MP3, payload: null})
            //temporary -- change back to 0 when re-rendering is fixed
            dispatch({type: ACTIONS.SET_SONG_TIME, payload: 0})
            songDispatch({type: ACTIONS.SET_SONG_TIME, payload: 0})
            dispatch({type:ACTIONS.SET_IS_HISTORY_PLAYING, payload: false})
            if(!state.isPastScrollYThreshold){
                dispatch({type: ACTIONS.IS_HERO_PLAYING, payload: true})
            }
        }
        dispatch({ type: ACTIONS.SET_CURRENT_SONG, payload: newSong })
        songDispatch({type: ACTIONS.SET_CURRENT_SONG, payload: newSong})
        
        newSong.volume = MIN
        
        newSong.play();
        fadeSongIn(newSong);
    }
}
export const handleSongChangeState = (e, state, dispatch, songDispatch, session) => {
    dispatch({ type: ACTIONS.SET_BACKGROUND_IMAGE, payload: e.target.dataset.image })
    songDispatch({ type: ACTIONS.SET_BACKGROUND_IMAGE, payload: e.target.dataset.image })

    dispatch({ type: ACTIONS.SET_BACKGROUND_COLOR, payload: e.target.dataset.color })
    dispatch({ type: ACTIONS.SET_IS_IMAGE_CLICKED, payload: true })

    songDispatch({ type: ACTIONS.SET_IS_IMAGE_CLICKED, payload: true })

    dispatch({ type: ACTIONS.SET_SELECTED_MP3, payload: e.target.dataset.mp3 })
    dispatch({ type: ACTIONS.SET_SONG_NAME, payload: e.target.dataset.song })
    dispatch({ type: ACTIONS.SET_ARTIST_NAME, payload: e.target.dataset.artist })

    songDispatch({ type: ACTIONS.SET_SONG_NAME, payload: e.target.dataset.song })
    songDispatch({ type: ACTIONS.SET_ARTIST_NAME, payload: e.target.dataset.artist })

    if (state.isSongPlaying && e.target.dataset.mp3 === state.selectedMp3) {
        dispatch({ type: ACTIONS.SET_IS_SONG_PLAYING, payload: false })
        songDispatch({ type: ACTIONS.SET_IS_SONG_PLAYING, payload: false })
    }
    if (!state.isSongPlaying) {
        dispatch({ type: ACTIONS.SET_IS_SONG_PLAYING, payload: true })
        songDispatch({ type: ACTIONS.SET_IS_SONG_PLAYING, payload: true })
    }
}