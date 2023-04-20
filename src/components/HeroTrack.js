import styles from './HeroTrack.module.css'
import { AnimatePresence, motion } from 'framer-motion'
import AnimatedIcon from './AnimatedIcon'


export default function HeroTrack ({font, track, trackDetails, isHeroPlaying, isAudioOnly}){
    return (
        <>
            <AnimatePresence>
                {isHeroPlaying && 
                    <motion.div 
                        className={styles.container + ' ' + font}
                        initial={{ opacity: 0}}
                        animate={{ opacity: 1}}
                        exit={{ opacity: 0, transition: {duration: 0.4, delay: 0}}}
                        transition={{duration: 0.5, delay: isAudioOnly? 0.2 : 2}}
                    >
                        <div className={styles.imageWrapper}>
                            <img
                                className={styles.image}
                                src={track.images[1].url} 
                                alt={track.name} 
                            />
                        <AnimatedIcon forHero={true}/>
                        </div>
                        <h2 className={styles.name}>{trackDetails.name}</h2>
                    </motion.div>                
                }
            </AnimatePresence>
        </>
    )
}

//tracks[62].tracks.items[0]