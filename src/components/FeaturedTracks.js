import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './FeaturedTracks.module.css'
import { useStateContext, useDispatchContext } from 'utils/ReducerContext';
import PlayButton from './PlayButton';
import AnimatedIcon from './AnimatedIcon';
import { AnimatePresence, useAnimationControls, motion, animate} from 'framer-motion';
import IntervalTrack from './IntervalTrack';


export default function FeaturedTracks ({tracks, loading, artistData}){
    const [featuredTrack, setFeaturedTrack] = useState(null);
    const state = useStateContext();
    const dispatch = useDispatchContext();
    const controls = useAnimationControls();
    const controlsRef = useRef(controls);
    const intervalRef = useRef(0);
    const [index, setIndex] = useState(0);
    

    const parseDuration = (timeInMs)=>{
        const timeInSeconds = timeInMs / 1000;
        const timeInMinutes = timeInSeconds / 60;
        const remainderOfNextMinute = timeInMinutes % 1;
        
        const minutes = Math.trunc(timeInMinutes);
        const seconds = remainderOfNextMinute * 60;
        if(seconds.toFixed(0)<10){
            return `${minutes}:0${seconds.toFixed(0)}`
        }
        else{
            return `${minutes}:${seconds.toFixed(0)}`
        }
    }

    
    useEffect(()=>{
        setFeaturedTrack(tracks[index])
        if(index >tracks.length -1){
            setIndex(0)
        }
        const interval = setTimeout(()=>{
            setIndex((prevIndex)=> prevIndex+=1)
        },8000)
        controlsRef.current.set({opacity: 0, scale: 0.9, translateY: 0.9, originY: 0})
        controlsRef.current.start({opacity: 1, scale: 1, translateY: 1, originY: 0})

        return () => {
            clearTimeout(interval);
        }
    },[index])


    useEffect(()=>{
        if(!loading && tracks){
            setFeaturedTrack(tracks[index])
        }
    },[])
    if (!loading) {
        return (
            <div
                className={styles.mainContainer}
            >
                <h2 className={styles.title}>Featured Tracks</h2>
                <div
                    className={styles.container}
                >
                    <AnimatePresence>
                        <motion.div
                            className={styles.wrapper}
                            initial={{ opacity: 0, scale: 0.9, translateY: 0.9, originY: 0 }}
                            animate={controlsRef.current}
                            exit={{ opacity: 0, scale: 0.9, translateY: 0.9, originY: 0 }}
                            transition={{ duration: 0.6, ease: 'easeInOut' }}
                        >
                            <img
                                className={styles.image}
                                src={featuredTrack?.images[1]?.url}
                                alt={featuredTrack?.name}
                            // onMouseEnter={(e)=>{
                            //     updateHoveredImageState(e)                               
                            // }}
                            // onMouseOut={(e) => {
                            //     dispatch({ type: ACTIONS.SET_HOVERED_IMAGE, payload: null })
                            // }}
                            // data-image={featuredTrack?.images[1]?.url}
                            // data-artist={featuredTrack?.artists[0]?.name}
                            // data-song={featuredTrack?.name}
                            // data-id={featuredTrack?.id}

                            // data-mp3={featuredTrack?.preview_url}
                            // onClick={handleImageClick}
                            >
                            </img>
                            <div className={styles.trackInfoContainer}>
                                <div className={styles.trackNameReleaseWrapper}>
                                    <h3 className={styles.trackName}>{featuredTrack?.name}</h3>
                                    <p className={styles.releaseDate}>Released: {featuredTrack?.release_date}</p>
                                </div>
                                <p className={styles.duration}>{parseDuration(featuredTrack?.tracks.items[0].duration_ms)}</p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                    <IntervalTrack tracks={tracks} index={index} setIndex={setIndex} />
                </div>
            </div>
        )
    }
}
