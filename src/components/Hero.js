import styles from './Hero.module.css'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useStateContext, useDispatchContext } from 'utils/ReducerContext';
import Image from 'next/image';
import {motion, AnimatePresence} from 'framer-motion'
import { ACTIONS } from 'utils/actions';
import HeroTrack from './HeroTrack';
import { useSongDispatchContext, useSongStateContext } from 'utils/SongContext';

const V_STEP = 0.12
const V_STEPQUICK= 0.030
const MAX = 0.5
const MIN = 0
const INTERVAL = 100
const SHORT_DUR = 500
const LONG_DUR = 2000
const SCROLL_Y_THRESHOLD = -500

export default function Hero({font, artistData, videoRef}){
    // const [isMuted, setIsMuted] = useState(true);
    const [isHeroPlaying, setIsHeroPlaying] = useState(true);
    const [thresholdHit, setThresholdHit] = useState(false)
    const [isVideoFinished, setIsVideoFinished] = useState(false)
    const [once, setOnce] = useState(true);
    const state = useStateContext();
    const dispatch = useDispatchContext();
    const songState = useSongStateContext();
    const songDispatch = useSongDispatchContext();
    // const videoRef = useRef();
    
    const handleReplay = ()=>{
        setIsVideoFinished(false)
        window.addEventListener('scroll', trackInView, true)
    }
    // const setTimeoutDelay = useCallback((doStuff)=>{
    //     setTimeout(()=>{
    //         doStuff
    //     }, 2000)
    // })
    

    const trackInView = useCallback(() => {
            const rect = videoRef.current.getBoundingClientRect();
                if (rect.y < SCROLL_Y_THRESHOLD) {
                    if (videoRef.current.paused === false) {
                        dispatch({type: ACTIONS.IS_PAST_SCROLL_Y_THRESHOLD, payload: true})
                        // setThresholdHit(true);
                    }
                    dispatch({type: ACTIONS.IS_HERO_PLAYING, payload: false})
                    setIsHeroPlaying(false);
                }
                if (rect.y > SCROLL_Y_THRESHOLD) {
                    if (videoRef.current.paused) {
                        dispatch({type: ACTIONS.IS_PAST_SCROLL_Y_THRESHOLD, payload: false})
                        // setThresholdHit(false);
                        videoRef.current.play();
                    }
                    dispatch({type: ACTIONS.IS_HERO_PLAYING, payload: true})
                    setIsHeroPlaying(true)
                }
    },[])
    useEffect(() => {
        dispatch({type: ACTIONS.SET_IS_SONG_PLAYING, payload: false})
        videoRef.current.volume = MAX
        
        window.addEventListener('scroll', trackInView, true)

        return () => window.removeEventListener('scroll', trackInView, true);
    },[])

    useEffect(()=>{
        if(state.isPastScrollYThreshold && !isVideoFinished){
            const fadeOut = setInterval(() => {
                if(videoRef.current.volume - V_STEP > MIN){
                    videoRef.current.volume -= V_STEP
                }
                if(videoRef.current.volume - V_STEP < MIN){
                    videoRef.current.volume = MIN;
                }
            }, INTERVAL)
            setTimeout(() => {
                clearInterval((fadeOut));
                videoRef.current.pause();
            },SHORT_DUR)
        }
    },[state.isPastScrollYThreshold, isVideoFinished])

    useEffect(()=>{
        if(state.isSongPlaying){
            window.removeEventListener('scroll', trackInView, true);
        }
        if(!state.isSongPlaying && videoRef.current){
            window.addEventListener('scroll', trackInView, true);
        }
    },[state.isSongPlaying])

    return (

        <div className={styles.container}>
            {!isVideoFinished  && 
                <video src="/JasonRossHero.mp4"
                    autoPlay
                    onEnded={()=>{
                        setIsVideoFinished(true);
                        setIsHeroPlaying(false);
                        window.removeEventListener('scroll', trackInView, true);
                    }}
                    onCanPlay={()=>{
                        videoRef.current.volume = MAX
                        //autoplay would not work if video was muted and replayed, this fixed it
                        videoRef.current.play();
                    }}
                    onPlay={()=>{
                        songDispatch({type: ACTIONS.IS_TIMER_HIT, payload: true})
                        setOnce(true)
                        videoRef.current.volume = MIN;
                        const fadeIn = setInterval(() => {
                            if(videoRef.current.volume + V_STEP < MAX){
                                videoRef.current.volume += V_STEP
                            }
                            if(videoRef.current.volume + V_STEP > MAX){
                                videoRef.current.volume = MAX
                            }
                        }, INTERVAL)
                        setTimeout(() => {
                            clearInterval((fadeIn));
                        }, SHORT_DUR)
                        setIsHeroPlaying(true);
                    }}
                    onTimeUpdate={()=>{
                        if(videoRef.current.currentTime > videoRef.current.duration * 0.97 && once){
                            setOnce(false)
                            const fadeOut = setInterval(() => {
                                if(videoRef.current.volume > V_STEPQUICK){
                                    videoRef.current.volume -= V_STEPQUICK
                                }
                                if(videoRef.current.volume < V_STEPQUICK){
                                    videoRef.current.volume = MIN
                                }
                            }, INTERVAL)
                            setTimeout(() => {
                                clearInterval((fadeOut));
                            },LONG_DUR)
                        }
                    }}
                    muted={state.isHeroMuted}
                    className={styles.video}
                    ref={videoRef}
                >
                </video>
            }
            <AnimatePresence>
                {(isVideoFinished || state.isPastScrollYThreshold || state.isSongPlaying) &&
                
                    <motion.div
                        className={styles.fadeInOutWrapper}
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{duration: 0.5}}
                        exit={{opacity: 0}}
                    >   
                        <div className={styles.heroImageFade}></div>
                        <Image
                            className={styles.heroImage}
                            fill={true}
                            sizes='600px'
                            src={artistData?.artistInfo.images[0].url}
                            alt={artistData?.artistInfo.name}
                        />
                    </motion.div>
                }
            </AnimatePresence>
            
            <div className={styles.fadeToBlack}></div>
            {!state.isSongPlaying &&
                <>
                    {!isVideoFinished ?
                        <>
                            {state.isHeroMuted ?
                                <button
                                    className={styles.mute}
                                    onClick={() => dispatch({ type: ACTIONS.IS_HERO_MUTED, payload: false })}
                                    name='mute'
                                >
                                </button> :
                                <button
                                    className={styles.unmute}
                                    onClick={() => dispatch({ type: ACTIONS.IS_HERO_MUTED, payload: true })}
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
                            animate={{ opacity: isVideoFinished ? 1 : 0 }}
                            transition={{ duration: 0.5 }}
                        ></motion.button>
                    }
                </>
            }
            {/* <h1
                className={styles.name + ' ' + font}
            >
                Jason <span style={{width: '190px'}}></span>Ross
            </h1> */} 
                <motion.h1
                    className={styles.name + ' ' + font}
                    initial={{translateY: 0, originY: 0}}
                    animate={{translateY: isHeroPlaying? -300 : 0, originY: 0}}
                    // exit={{translateY: 0, originY: 0}}
                    transition={{delay:isHeroPlaying? 2 : 0, duration: 0.5, ease: 'easeInOut'}}
                >
                    {artistData?.artistInfo?.name}
                </motion.h1>
                {artistData?.isJR ? 
                <HeroTrack font={font} track={artistData?.albums[62]} trackDetails={artistData?.tracks[62].tracks.items[0]} isHeroPlaying={isHeroPlaying}/>
                :
                <HeroTrack font={font} track={artistData?.albums[8]} trackDetails={artistData?.tracks[8].tracks.items[0]} isHeroPlaying={isHeroPlaying}/>
            }                
            {/* <HeroTrack font={font} track={artistData?.albums[10]} trackDetails={artistData?.tracks[10].tracks.items[0]} isHeroPlaying={isHeroPlaying}/> */}
            {/* <Image
                src={'/JRLogo.png'}
                alt='Jason Ross Logo'
                height={120}
                width={150}
                className={styles.logo}
            /> */}
        </div>

    )
}