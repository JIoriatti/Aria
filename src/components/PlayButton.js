import styles from './PlayButton.module.css'
import { motion } from 'framer-motion'
import { useStateContext, useDispatchContext } from 'utils/ReducerContext'

export default function PlayButton ({ imageSrc, mp3}){
    const state = useStateContext();
    const dispatch = useDispatchContext();
    return (
        <>
            {mp3=== null && state.hoveredImage===imageSrc &&
                <motion.div 
                className={styles.notAvailable}
                initial={{opacity: state.isSongPlaying? 1 : 0}}
                transition={{duration: 0.2}}
                animate={{opacity: state.hoveredImage? 1 : 0}}
                onClick={(e)=> e.stopPropagation()}
            >
                Preview not available.
            </motion.div>
            } 
            {state.hoveredImage===imageSrc && mp3!== null &&
                <motion.div 
                    className={state.isSongPlaying && state.selectedMp3===mp3? styles.paused : styles.container}
                    initial={{opacity: state.isSongPlaying? 1 : 0}}
                    transition={{duration: 0.2}}
                    animate={{opacity: state.hoveredImage? 1 : 0}}
                    onClick={(e)=> e.stopPropagation()}
                >

                </motion.div>
            }
            {state.isSongPlaying && mp3===state.selectedMp3 && 
                <motion.div
                    className={state.isSongPlaying && state.selectedMp3 === mp3 ? styles.paused : styles.container}
                    onClick={(e) => e.stopPropagation()}
                >
                </motion.div>
            }
        </>
    )
}