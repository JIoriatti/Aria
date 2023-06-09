import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './Hero.module.css'
import HeroTrack from './HeroTrack'
import { useDispatchContext, useStateContext } from 'utils/ReducerContext';
import { motion } from 'framer-motion'
import { ACTIONS } from 'utils/actions';
import { useSongDispatchContext, useSongStateContext } from 'utils/SongContext';

//**** for future dev: used adding/removal of event listener to handle hero song playing and 
//** conditions instead of a bunch of if statements and booleans as I did on the videoHero. Remove redundant booleans and use
// potentially one or only 2 if neccissary, isHeroMuted, isAudioPlaying, isVideoPlaying, etc.

//add fadeout to heroAudio

const V_STEP = 0.12
const V_STEPQUICK= 0.030
const MAX = 0.5
const MIN = 0
const INTERVAL = 100
const SHORT_DUR = 500
const LONG_DUR = 2000
const SCROLL_Y_THRESHOLD = -500


export default function HeroNoVideo ({font, artistData}){
    const hasUserInteracted = useRef(false);
    const isHeroPlayingRef = useRef(false);
    const [isAudioFinished, setIsAudioFinished] = useState(true);
    const audioRef = useRef();
    const containerRef = useRef();
    const state = useStateContext();
    const dispatch = useDispatchContext();
    const songState = useSongStateContext();
    const songDispatch = useSongDispatchContext();

    const trackScroll = useCallback(()=>{
        const rect = containerRef.current.getBoundingClientRect();
        
            if(hasUserInteracted.current && rect.y > -500){
                if(!state.isSongPlaying && state.isHeroMuted){
                    audioRef.current.play();
                    isHeroPlayingRef.current = true;
                    dispatch({type: ACTIONS.IS_HERO_PLAYING, payload: true})
                    dispatch({type: ACTIONS.IS_PAST_SCROLL_Y_THRESHOLD, payload: false})
                }
            }
            if(hasUserInteracted.current && rect.y < -500){
                // audioRef.current.volume = MIN;
                // audioRef.current.pause();
                isHeroPlayingRef.current = false;
                dispatch({type: ACTIONS.IS_HERO_PLAYING, payload: false})
                dispatch({type: ACTIONS.IS_PAST_SCROLL_Y_THRESHOLD, payload: true})
            }
    },[])


    const handleReplay = useCallback(()=>{
        setIsAudioFinished(false);
        isHeroPlayingRef.current = true;
        dispatch({type: ACTIONS.IS_HERO_PLAYING, payload: true})
        // audioRef.current.volume = MAX
        audioRef.current.play();
        dispatch({type: ACTIONS.IS_HERO_MUTED, payload : false})
        window.addEventListener('scroll', trackScroll, true)
    },[])

    useEffect(()=>{
        if(artistData){
            audioRef.current.volume = MIN
            dispatch({type: ACTIONS.SET_HERO_VIDEO, payload: audioRef.current})
        }
    },[artistData])

    useEffect(()=>{
        if(!isAudioFinished && !state.isSongPlaying && !state.isHeroMuted){
            window.addEventListener('scroll', trackScroll, true)
        }
        if(state.isSongPlaying){
            window.removeEventListener('scroll', trackScroll, true)
        }

        setIsAudioFinished(false)
    },[state.isSongPlaying])

    useEffect(()=>{
        if(state.isPastScrollYThreshold && !isAudioFinished){
            const fadeOut = setInterval(() => {
                if(audioRef.current.volume - V_STEP > MIN){
                    audioRef.current.volume -= V_STEP
                }
                if(audioRef.current.volume - V_STEP < MIN){
                    audioRef.current.volume = MIN;
                }
            }, INTERVAL)
            setTimeout(() => {
                clearInterval((fadeOut));
                audioRef.current.pause();
            },SHORT_DUR)
        }
    },[state.isPastScrollYThreshold, isAudioFinished])


    return (
        <div 
            className={styles.container + ' ' + styles.heroImageNoVideo + ' ' +font}
            style={{backgroundImage: `url(${artistData.artistInfo.images[0].url})`
            // backgroundAttachment: 'fixed'    
        }}
        ref={containerRef}
        >
            <audio
                src={artistData?.tracks[8].tracks.items[0].preview_url}
                onEnded={()=>{
                    setIsAudioFinished(true);
                    isHeroPlayingRef.current = false;
                    dispatch({type: ACTIONS.IS_HERO_PLAYING, payload: false})
                    dispatch({type: ACTIONS.IS_HERO_MUTED, payload : true})
                    window.removeEventListener('scroll', trackScroll, true);
                    audioRef.current.volume = MIN;
                }}
                onPlay={()=>{
                    songDispatch({type: ACTIONS.IS_TIMER_HIT, payload: true})
                    audioRef.current.volume = MIN;
                    const fadeIn = setInterval(() => {
                        if(audioRef.current.volume + V_STEP < MAX){
                            audioRef.current.volume += V_STEP
                        }
                        if(audioRef.current.volume + V_STEP > MAX){
                            audioRef.current.volume = MAX
                        }
                    }, INTERVAL)
                    setTimeout(() => {
                        clearInterval((fadeIn));
                    }, SHORT_DUR)
                }}
                onTimeUpdate={()=>{
                    if(audioRef.current.currentTime > audioRef.current.duration * 0.98){
                        const fadeOut = setInterval(() => {
                            if(audioRef.current.volume > V_STEP){
                                audioRef.current.volume -= V_STEP
                            }
                            if(audioRef.current.volume < V_STEP){
                                audioRef.current.volume = MIN
                            }
                        }, INTERVAL)
                        setTimeout(() => {
                            clearInterval((fadeOut));
                        },SHORT_DUR)
                    }
                }}
                ref={audioRef}
            >


            </audio>
            <motion.h1
                className={styles.name}
                initial={{ translateY: 0, originY: 0 }}
                animate={{ translateY: state.isHeroPlaying ? -300 : 0, originY: 0 }}
                // exit={{translateY: 0, originY: 0}}
                transition={{ delay: 0, duration: 0.5, ease: 'easeInOut' }}
            >
                {artistData?.artistInfo?.name}
            </motion.h1>
            <HeroTrack font={font} track={artistData?.albums[8]} trackDetails={artistData?.tracks[8].tracks.items[0]} isHeroPlayingRef={isHeroPlayingRef} isAudioOnly={true}/>
            <div id='heroImageFade' className={styles.heroImageFade}></div>
            <div className={styles.fadeToBlack}></div>

            {!state.isSongPlaying &&
                <>
                    {!isAudioFinished ?
                        <>
                            {state.isHeroMuted ?
                                <button
                                    className={styles.mute}
                                    onClick={() => {
                                        dispatch({ type: ACTIONS.IS_HERO_MUTED, payload: false })
                                        hasUserInteracted.current = true;
                                        audioRef.current.volume = 0;
                                        audioRef.current.play();
                                        isHeroPlayingRef.current = true;
                                        dispatch({type: ACTIONS.IS_HERO_PLAYING, payload: true})
                                        window.addEventListener('scroll', trackScroll, true)
                                    }}
                                    name='mute'
                                >
                                </button> :
                                <button
                                    className={styles.unmute}
                                    onClick={() => {
                                        dispatch({ type: ACTIONS.IS_HERO_MUTED, payload: true })
                                        audioRef.current.pause();
                                        isHeroPlayingRef.current = false;
                                        dispatch({type: ACTIONS.IS_HERO_PLAYING, payload: false})
                                        window.removeEventListener('scroll', trackScroll, true)
                                    }}
                                    name='unmute'
                                >
                                </button>
                            }
                        </>
                        :
                        <motion.button
                            className={styles.replay}
                            name='replay'
                            onClick={handleReplay}
                            animate={{ opacity: isAudioFinished ? 1 : 0 }}
                            transition={{ duration: 0.5 }}
                        ></motion.button>
                    }
                </>
            }
        </div>
    )
}