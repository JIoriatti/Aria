import styles from './AnimatedIcon.module.css'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react';
import { useStateContext, useDispatchContext } from 'utils/ReducerContext';

export default function AnimatedIcon({mp3, forHero, forSideBar}){
const state = useStateContext();
const dispatch = useDispatchContext();
 
if(forHero){
    return (
        <>
            {!state.isHeroMuted && 
                <div className={styles.container + ' ' + styles.forHero}>
                    <motion.span 
                        className={styles.bar}
                        transition={{delay:0.2, repeat: Infinity, repeatType: 'reverse', repeatDelay: 0, duration: 0.5}}
                        initial={{scaleY: 0.4, originY: 1}}
                        animate={{scaleY: 1, originY: 1}}
                    >
                    </motion.span>
                    <motion.span 
                        className={styles.bar}
                        transition={{ repeat: Infinity, repeatType: 'reverse', repeatDelay: 0, duration: 0.5}}
                        initial={{scaleY: 0.3, originY: 1}}
                        animate={{scaleY: 1, originY: 1}}
                    ></motion.span>
                    <motion.span 
                        className={styles.bar}
                        transition={{delay:0.4 ,repeat: Infinity, repeatType: 'reverse', repeatDelay: 0, duration: 0.5}}
                        initial={{scaleY: 0.2, originY: 1}}
                        animate={{scaleY: 0.8, originY: 1}}
                    ></motion.span>
                </div>
                
            }
        </>
    )
}
else{
        return (
            <>
                {(state.isSongPlaying && state.selectedMp3===mp3) &&
                    <div className={forSideBar ? styles.container + ' ' + styles.forSideBar : styles.container}>
                        <motion.span 
                            className={styles.bar}
                            transition={{delay:0.2, repeat: Infinity, repeatType: 'reverse', repeatDelay: 0, duration: 0.5}}
                            initial={{scaleY: 0.4, originY: 1}}
                            animate={{scaleY: 1, originY: 1}}
                        >
                        </motion.span>
                        <motion.span 
                            className={styles.bar}
                            transition={{ repeat: Infinity, repeatType: 'reverse', repeatDelay: 0, duration: 0.5}}
                            initial={{scaleY: 0.3, originY: 1}}
                            animate={{scaleY: 1, originY: 1}}
                        ></motion.span>
                        <motion.span 
                            className={styles.bar}
                            transition={{delay:0.4 ,repeat: Infinity, repeatType: 'reverse', repeatDelay: 0, duration: 0.5}}
                            initial={{scaleY: 0.2, originY: 1}}
                            animate={{scaleY: 0.8, originY: 1}}
                        ></motion.span>
                        {!forSideBar &&
                            <p className={styles.currentlyPlaying}>Currently playing...</p>
                        }
                    </div>
                    
                }
            </>
        )
    }
}