import { useEffect, useRef, useState } from 'react'
import styles from './SongTimer.module.css'
import { useStateContext, useDispatchContext } from 'utils/ReducerContext';
import { useSongDispatchContext, useSongStateContext } from 'utils/SongContext';
import Image from 'next/image';


//FIX -- song timer/ progress bar re-rendering due to state changes from
//global context causing timer to be janky. Move component
//out of context provider and figure out a way to access
//song time/duration without context??


export default function SongTimer() {
    const [currentSongTime, setCurrentSongTime] = useState(0);
    const state = useStateContext();
    const dispatch = useDispatchContext();
    const progressBarRef = useRef();
    const songTimeRef = useRef();

    const songState = useSongStateContext();
    const songDispatch = useSongDispatchContext();

    const parseTime = (time) => {
        const seconds = String(Math.floor(time % 60) || 0).padStart('2', '0');
        const minutes = String(Math.floor(time / 60) || 0).padStart('2', '0');
        

        return `${minutes}:${seconds}`
    }

    // useEffect(()=>{
    //     if(state.currentSong.currentTime){
    //         songTimeRef.current = Math.trunc(state.currentSong.currentTime);
    //     }
    // },[state.currentSong.currentTime])
    return (
        <div className={styles.container}>
            <div className={styles.imageWrapper}>
                <Image
                    src={songState.backgroundImage}
                    alt="thumbnail of current track"
                    height={55}
                    width={55}
                />
            </div>
            <div className={styles.timer}>
                {/* {parseTime(Math.trunc(songState?.currentSong?.currentTime))} */}
                {parseTime(Math.trunc(songState?.songTime))}
                {/* {parseTime(songTimeRef.current)} */}
            </div>
            <div className={styles.middleWrapper}>
                <input
                    type="range"
                    ref={progressBarRef}
                    className={styles.progressBar}
                    style={{backgroundSize: (Math.trunc(songState?.songTime)) * 100 / (Math.trunc(songState?.songDuration)) + '% 100%'}}
                    // style={{backgroundSize: (songTimeRef.current * 100) / (Math.trunc(state?.currentSong.duration)) + '% 100%'}}
                    min='0'
                    step='1'
                    max={`${songState?.songDuration}`}
                    // onChange={(e)=>{
                    //     dispatch({type: ACTIONS.SET_SONG_TIME, payload: state.songDuration * (e.offsetX/progressBarRef.clientWidth)})
                    // }}
                />
            <div className={styles.infoContainer}>
                <div className={styles.songNameArtistName}>
                    {songState.artistName + ' - ' + songState.songName }
                </div>
            </div>
            </div>
            <div className={styles.timer}>
                {parseTime(songState?.songDuration)}
            </div>
        </div>
    )
}