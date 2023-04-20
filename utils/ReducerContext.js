'use client'
import React, {useContext, useReducer} from "react";
import { reducer } from "./reducer";

const StateContext = React.createContext();
const DispatchContext = React.createContext();

export function useStateContext(){
    return useContext(StateContext);
} 
export function useDispatchContext(){
    return useContext(DispatchContext);
}

export default function ReducerProvider ({children}){
    const [state, dispatch] = useReducer(reducer, {
        hoveredImage: null,
        currentSong: null,
        nextSong: null,
        selectedMp3: '',
        songDuration: 0,
        songTime: 0,
        isSongPlaying: false,
        isHovered: false,
        backgroundImage: '/wp10068163-anjunabeats-wallpapers.jpg',
        backgroundColor: null,
        isImageClicked: false,
        artistName: '',
        songName: '',
        scrollYPosition: 0,
        isHeroMuted: true,
        isHeroPlaying: true,
        isPastScrollYThreshold: false,
        isSearchExpanded: false,
        searchInput: '',
        isNoSearchResult: false,
        interval: null,
    });

return (
    <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
            {children}
        </DispatchContext.Provider>
    </StateContext.Provider>
)
}