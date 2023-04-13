import styles from './SideBar.module.css'
import { motion} from 'framer-motion'
import { useState } from 'react';
import { useStateContext } from 'utils/ReducerContext'
import { useSongStateContext } from 'utils/SongContext';

export default function SideBar({font}){
    const state = useStateContext();
    const [isHovered, setIsHovered] = useState(false);
    const songState = useSongStateContext();

    return (
            <motion.div 
                className={styles.container + ' ' + font}
                layout={true}
                style={{boxShadow: state.scrollYPosition !=0 ? ' 8px 8px 5px -5px var(--themeColorLight)' : 'none'}}
                // style={{height: songState.isTimerHit ? '100%' : 'calc(100% - 151px)'}}
                animate={{width: (isHovered && state.scrollYPosition !=0)? 300 : 75, originX: 0, height: songState.isTimerHit ? '100%' : 'calc(100% - 151px)', translateX: state.scrollYPosition !=0 ? 0 : -100}}
                transition={{width: {duration: 0.2, delay: isHovered ? 0.4 : 0}, height:{duration: 0.2, delay: songState.isTimerHit ? 0.1 : 0}, translateX:{duration: 0.2, delay: 0.8}}}
                onMouseEnter={()=>setIsHovered(true)}
                onMouseLeave={()=>setIsHovered(false)}
            >
                <div className={styles.sideBar}>
                    <motion.div 
                        className={styles.background}
                        animate={{ opacity: state.scrollYPosition != 0 ? 1 : 0 }}
                        transition={{ duration: 0.35 }}
                    >
                    </motion.div>
                    <div className={styles.iconContainer}>
                        <div className={styles.itemWrapper}>
                            <div 
                                className={styles.icon}
                            >
                                <img 
                                    src="/favorites-star.png" 
                                    alt="History" 
                                    className={styles.iconImage}
                                />
                            </div>
                            <div className={styles.text}>Favorites</div>
                        </div>
                        <div className={styles.itemWrapper}>
                            <div 
                                className={styles.icon}
                            >
                                <img src="/eye.png" alt="History" className={styles.iconImage}/>
                            </div>
                            <div className={styles.text}>Recently Viewed Artists</div>
                        </div>
                        <div className={styles.itemWrapper}>
                            <div 
                                className={styles.icon}
                            >
                                <img src="/song-history.png" alt="History" className={styles.iconImage}/>
                            </div>
                            <div className={styles.text}>History</div>
                        </div>
                    </div>
                </div>
            </motion.div>
    )
}