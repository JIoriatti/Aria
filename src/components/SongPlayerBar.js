import styles from './SongPlayerBar.module.css'
import { AnimatePresence, motion } from 'framer-motion'
import { useStateContext,useDispatchContext } from 'utils/ReducerContext'
import { useEffect, useState } from 'react';
import { ACTIONS } from 'utils/actions';
import SongTimer from './SongTimer';
import Image from 'next/image';
import { useSongStateContext, useSongDispatchContext } from 'utils/SongContext';

export default function SongPlayerBar({font}){
    
    const state = useStateContext();
    const dispatch = useDispatchContext();

    const songState = useSongStateContext();
    const songDispatch = useSongDispatchContext();

        return (
            <AnimatePresence>
                {/* && !songState.isTimerHit */}
                {songState.isImageClicked && !songState.isTimerHit &&
                    <motion.div
                        className={styles.container + ' ' + font}
                        initial={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        
                        {/* <div className={styles.infoContainer}> */}
                            {/* <div className={styles.artistInfo}>
                                <div
                                    className={styles.artistName}
                                >
                                    {songState.artistName}
                                </div>
                                <div
                                    className={styles.songName}
                                >
                                    {songState.songName}
                                </div>
                            </div> */}
                        {/* </div> */}
                        <SongTimer />

                    </motion.div>
                 }
            </AnimatePresence>
        )
}
    