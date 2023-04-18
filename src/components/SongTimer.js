import { useEffect, useRef, useState } from 'react'
import styles from './SongTimer.module.css'
import { useStateContext, useDispatchContext } from 'utils/ReducerContext';
import { useSongDispatchContext, useSongStateContext } from 'utils/SongContext';
import Image from 'next/image';
import { motion, useAnimationControls } from 'framer-motion';
import { ACTIONS } from 'utils/actions';


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

    const controls = useAnimationControls();

    const parseTime = (time) => {
        const seconds = String(Math.floor(time % 60) || 0).padStart('2', '0');
        const minutes = String(Math.floor(time / 60) || 0).padStart('2', '0');
        

        return `${minutes}:${seconds}`
    }

    useEffect(()=>{
        controls.set({opacity: 0});
        controls.start({opacity: 1});
    },[songState.currentSong])

    return (
        <>
            <div className={styles.container}>
                <motion.div 
                    className={styles.infoContainer}
                    animate={controls}
                    transition={{duration: 0.3}}
                >
                    <div className={styles.imageWrapper}>
                        <Image
                            src={songState.backgroundImage}
                            alt="thumbnail of current track"
                            height={55}
                            width={55}
                        />
                    </div>
                    <div className={styles.songNameArtistName}>
                        {songState.artistName + ' - ' + songState.songName }
                    </div>
                </motion.div>
                <div className={styles.timer}>
                    {parseTime(Math.trunc(songState?.songTime))}
                </div>
                <div className={styles.middleWrapper}>
                    <div className={styles.controlsContainer}>
                        <div className={styles.controls}>
                            <img 
                                className={styles.previous}
                                src={'/nextWhite.png'}
                                alt='previous song'
                            />
                                {songState.isSongPlaying ? 
                                    <div 
                                        className={styles.pause}
                                        onClick={()=> {
                                            songDispatch({type: ACTIONS.SET_IS_SONG_PLAYING, payload: false})
                                            songState.currentSong.pause();
                                        }}
                                    >
                                            <motion.div 
                                                className={styles.pauseImage}
                                                alt='pause song'
                                            ></motion.div>
                                    </div>
                                    :
                                    <div 
                                        className={styles.play}
                                        onClick={()=> {
                                            songDispatch({type: ACTIONS.SET_IS_SONG_PLAYING, payload: true})
                                            songState.currentSong.play();
                                        }}
                                    >
                                        <motion.div
                                            className={styles.playImage}
                                            alt='resume song'
                                        ></motion.div>
                                    </div>
                                }
                            <img 
                                className={styles.next}
                                src={'/nextWhite.png'}
                                alt='next song'
                            />
                        </div>
                    </div>
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
                </div>
                <div className={styles.timer}>
                    {parseTime(songState?.songDuration)}
                </div>
            </div>
        </>
    )
}