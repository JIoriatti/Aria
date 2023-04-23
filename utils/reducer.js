import { ACTIONS } from "./actions"

export const reducer = (state, action)=>{
    switch(action.type){
        case ACTIONS.SET_HOVERED_IMAGE:
            return {...state, hoveredImage: action.payload}
        case ACTIONS.SET_CURRENT_SONG:
            return {...state, currentSong: action.payload}
        case ACTIONS.SET_NEXT_SONG:
            return {...state, nextSong: action.payload}
        case ACTIONS.SET_SELECTED_MP3:
            return {...state, selectedMp3: action.payload}
        case ACTIONS.SET_SONG_DURATION:
            return {...state, songDuration: action.payload}
        case ACTIONS.SET_SONG_TIME:
            return {...state, songTime: action.payload}
        case ACTIONS.SET_SONG_NAME:
            return {...state, songName: action.payload}
        case ACTIONS.SET_ARTIST_NAME:
            return {...state, artistName: action.payload}
        case ACTIONS.SET_IS_SONG_PLAYING:
            return {...state, isSongPlaying: action.payload}
        case ACTIONS.SET_IS_HOVERED:
            return{...state, isHovered: action.payload}
        case ACTIONS.SET_BACKGROUND_IMAGE:
            return {...state, backgroundImage: action.payload}
        case ACTIONS.SET_BACKGROUND_COLOR:
            return {...state, backgroundColor: action.payload}
        case ACTIONS.SET_IS_IMAGE_CLICKED:
            return {...state, isImageClicked: action.payload}
        case ACTIONS.SET_SCROLL_Y_POSITION:
            return {...state, scrollYPosition: action.payload}
        case ACTIONS.IS_HERO_MUTED:
            return {...state, isHeroMuted: action.payload}
        case ACTIONS.IS_HERO_PLAYING:
            return {...state, isHeroPlaying: action.payload}
        case ACTIONS.IS_PAST_SCROLL_Y_THRESHOLD:
            return {...state, isPastScrollYThreshold: action.payload}
        case ACTIONS.SEARCH_INPUT:
            return {...state, searchInput: action.payload}
        case ACTIONS.IS_SEARCH_EXPANDED:
            return {...state, isSearchExpanded: !state.isSearchExpanded}
        case ACTIONS.IS_NO_SEARCH_RESULT:
            return {...state, isNoSearchResult: action.payload}
        case ACTIONS.IS_TIMER_HIT:
            return {...state, isTimerHit: action.payload}
        case ACTIONS.HAS_SONG_ENDED:
            return {...state, hasSongEnded: action.payload}
        case ACTIONS.SET_INTERVAL:
            return {...state, interval: action.payload}
        case ACTIONS.SET_COLOR_OBJ:
            return {...state, colorObj: action.payload}
        case ACTIONS.SET_VISIBILITY_OBJ:
            return {...state, visibilityObj: action.payload}
        case ACTIONS.SET_IS_HISTORY_PLAYING:
            return {...state, isHistoryPlaying: action.payload}
        case ACTIONS.SET_USER_HISTORY:
            return {...state, userHistory: action.payload}
        case ACTIONS.SET_USER_FAVORITES:
            return {...state, userFavorites: action.payload}
        default:
            throw new Error();
    }
}