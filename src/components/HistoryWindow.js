import { useEffect, useRef, useState } from 'react'
import styles from './HistoryWindow.module.css'
import { motion } from 'framer-motion'
import { useSongStateContext, useSongDispatchContext } from 'utils/SongContext';
import { useStateContext, useDispatchContext } from 'utils/ReducerContext';
import { ACTIONS } from 'utils/actions';
import { handleSongChange, handleSongChangeState } from 'utils/songHandler';
import { colorScheme } from 'utils/colorScheme';
import { handleFavoriteClick } from 'utils/handleFavorite';
import { useSession } from 'next-auth/react';

export default function HistoryWindow({sideBarRef, iconContainerRef}){
    const songState = useSongStateContext();
    const songDispatch = useSongDispatchContext();
    const state = useStateContext();
    const dispatch = useDispatchContext();
    const [height, setHeight] = useState(sideBarRef.current.clientHeight - iconContainerRef.current.clientHeight - 175)
    const [hoveredSong, setHoveredSong] = useState(null);

    const {data: session, status} = useSession();
    
    const initialHeightRef = useRef(height);


    //to access state since bottom song bar player can only access songState
    useEffect(()=>{
        if(songState.isHistoryPlaying && state.isSongPlaying){
            dispatch({type: ACTIONS.SET_IS_HISTORY_PLAYING, payload: true})
        }
        if(!songState.isHistoryPlaying && !state.isSongPlaying){
            dispatch({type: ACTIONS.SET_IS_HISTORY_PLAYING, payload: false})
        }
    },[songState.isHistoryPlaying, state.isSongPlaying])

    useEffect(()=>{
        if(!songState.isTimerHit){
            setHeight((prevHeight)=> prevHeight -= 75)
        }
        else{
            setHeight(initialHeightRef.current)
        }
    },[songState.isTimerHit])
    return (
        <motion.div 
            className={styles.container}
            initial={{height: 0}}
            transition={{duration: 0.2}}
            animate={{originY: 0, height: `${height}px`}}
            exit={{height: 0}}
        >
            {state.userHistory.map((song,i)=>{
                return <div 
                            key={i}
                            className={styles.songContainer}
                            data-id={song.id}
                            onMouseEnter={(e)=> {
                                if(e.target.dataset.id === song.id){
                                    setHoveredSong(e.target.dataset.id)
                                }
                            }}
                            onMouseLeave={(e)=> {
                                setHoveredSong(null)
                            }}
                        >
                            <motion.div
                                className={styles.background}
                                animate={{
                                    opacity: state.isSongPlaying && state.selectedMp3 === song.previewMp3? 1 : 0
                                }}
                                transition={{duration: 0.4}}
                            ></motion.div>
                    {(hoveredSong === song.id || (state.isSongPlaying && state.selectedMp3 === song.previewMp3)) &&
                        <>
                            {state.isSongPlaying && state.selectedMp3 === song.previewMp3 ?
                                <div 
                                    className={styles.pauseButton}
                                    data-mp3={song.previewMp3}
                                    data-image={song.miniImage}
                                    data-song={song.songName}
                                    data-id={song.id}
                                    data-artist={song.artistsNames[0]}
                                    onClick={(e) => {
                                        songDispatch({ type: ACTIONS.SET_IS_SONG_PLAYING, payload: false })
                                        songState.currentSong.pause();
                                        dispatch({type:ACTIONS.SET_IS_HISTORY_PLAYING, payload: false})

                                        dispatch({type: ACTIONS.IS_HERO_PLAYING, payload: false})
                                    }}
                                    title='Pause'
                                >
                                    <img
                                        src="/pauseWhiteSmall.png"
                                        alt="Pause"
                                        className={styles.miniBtnImage + ' ' + styles.pauseImage}
                                    />
                                </div>
                                :
                                <div 
                                    className={styles.playButton}
                                    data-mp3={song.previewMp3}
                                    data-image={song.miniImage}
                                    data-song={song.songName}
                                    data-artist={song.artistsNames[0]}
                                    onClick={(e) => {
                                        handleSongChange(e, state, dispatch, songDispatch)
                                        colorScheme(e.target.dataset.image, dispatch, state)
                                        handleSongChangeState(e, state, dispatch, songDispatch);
                                        dispatch({type:ACTIONS.SET_IS_HISTORY_PLAYING, payload: true})

                                        dispatch({type: ACTIONS.IS_HERO_PLAYING, payload: false})
                                        state.heroVideo.pause();
                                    }}
                                    title='Play'
                                >
                                    <img
                                        src="/bottomPlayWhite.png"
                                        alt="Play"
                                        className={styles.miniBtnImage + ' ' + styles.playImage}
                                    />
                                </div>
                            }
                            <div 
                                className={styles.heart}
                                title='Favorite'
                                data-id={song.id}
                                onClick={(e)=>{
                                    if(e.target.dataset.id === song.id){
                                        handleFavoriteClick(e, null, session, dispatch, song)
                                    }
                                }}
                            >
                            {state.userFavorites.some((favorite) => favorite.id === song.id) ?
                                <img
                                    src="/redHeart.png"
                                    alt="Favorite"
                                    className={styles.miniBtnImage + ' ' + styles.heartImage}
                                />
                                :
                                <img
                                    src="/heart-svgrepo-com.png"
                                    alt="Favorite"
                                    className={styles.miniBtnImage + ' ' + styles.heartImage}
                                />

                            }
                            </div>
                        </>
                    }
                            <div
                                className={styles.imageContainer}   
                            >
                                <img 
                                    className={styles.image}
                                    src={song.image}
                                    alt={song.name}
                                />
                            </div>
                            <div 
                                className={styles.infoContainer}
                            >
                                <div 
                                    className={styles.songName}
                                >
                                    {song.songName}
                                </div>
                                <div 
                                    className={styles.songArtist}
                                >
                                    {song.artistsNames[0]}
                                </div>
                            </div>
                        </div>
            })}
        </motion.div>
    )
}