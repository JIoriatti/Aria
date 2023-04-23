import { useEffect, useRef, useState } from 'react'
import styles from './HistoryWindow.module.css'
import { motion } from 'framer-motion'
import { useSongStateContext } from 'utils/SongContext';

export default function HistoryWindow({history, sideBarRef, iconContainerRef}){
    const songState = useSongStateContext();
    const [height, setHeight] = useState(sideBarRef.current.clientHeight - iconContainerRef.current.clientHeight - 125)
    const [hoveredSong, setHoveredSong] = useState(null);
    const initialHeightRef = useRef(height);

    useEffect(()=>{
        if(!songState.isTimerHit){
            setHeight((prevHeight)=> prevHeight -= 60)
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
            {history.map((song,i)=>{
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
                            {hoveredSong === song.id && 
                                <>
                                    <div className={styles.playButton}>
                                        <img 
                                            src="/bottomPlayWhite.png" 
                                            alt="Play"
                                            className={styles.miniBtnImage + ' ' + styles.playImage} 
                                        />
                                    </div>
                                    <div className={styles.heart}>
                                        <img 
                                            src="/heart-svgrepo-com.png" 
                                            alt="Favorite" 
                                            className={styles.miniBtnImage} 
                                        />
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