import { useEffect } from 'react'
import styles from './HistoryWindow.module.css'
import { motion } from 'framer-motion'

export default function HistoryWindow({history}){
    return (
        <motion.div 
            className={styles.container}
            initial={{height: 0}}
            transition={{duration: 0.2}}
            animate={{originY: 0, height: 'initial'}}
            exit={{height: 0}}
        >
            {history.map((song,i)=>{
                return <div 
                            key={i}
                            className={styles.songContainer}
                        >
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
                                    {song.artistsNames.map((artist,i, array)=>{
                                        if(i<array.length -1){
                                            return `${artist}, `;
                                        }
                                        else{
                                            return artist
                                        }
                                    })}
                                </div>
                            </div>
                        </div>
            })}
        </motion.div>
    )
}