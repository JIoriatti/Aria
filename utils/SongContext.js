'use client'
import React, {useContext, useReducer, createContext} from "react";
import { reducer } from "./reducer";

const SongStateContext = createContext();
const SongDispatchContext = createContext();

export function useSongStateContext(){
    return useContext(SongStateContext);
}
export function useSongDispatchContext(){
    return useContext(SongDispatchContext);
}

//had to create seperate context for songPlayerBar so it wouldnt re-render on every state change from
//global context provider, caused the timer to be janky when user interacted with page.

export default function SongProvider({children}){
    const [state, dispatch] = useReducer(reducer, {
        currentSong: null,
        nextSong: null,
        songName: '',
        artistName: '',
        songDuration: 0,
        songTime: 0,
        backgroundImage: '',
        isImageClicked: false,
        isTimerHit: true,
        hasSongEnded: false,
        isSongPlaying: false,
    })
    return (
        <div>
            <SongStateContext.Provider value={state}>
                <SongDispatchContext.Provider value={dispatch}>
                    {children}
                </SongDispatchContext.Provider>
            </SongStateContext.Provider>
        </div>
    )
}
