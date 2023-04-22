import styles from './SideBar.module.css'
import { AnimatePresence, motion} from 'framer-motion'
import { useState, useEffect, useRef } from 'react';
import { useStateContext } from 'utils/ReducerContext'
import { useSongStateContext } from 'utils/SongContext';
import { useSession } from 'next-auth/react';
import HistoryWindow from './HistoryWindow';


export default function SideBar({font}){
    const state = useStateContext();
    const [isHovered, setIsHovered] = useState(false);
    const [userHistory, setUserHistory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isShown, setIsShown] = useState(false);
    const [isAnimationFinished, setIsAnimationFinished] = useState(false);
    const sideBarRef = useRef();
    const iconContainerRef = useRef();
    const songState = useSongStateContext();
    const { data: session, status } = useSession();



    useEffect(()=>{
        if(!isHovered){
            console.log('shown set to false')
            setIsShown(false);
        }
    },[isHovered])

    useEffect(()=>{
        const getUserHistory = async ()=>{
          const response = await fetch(`/api/history/${session?.user?.id}`,{
            method: 'GET',
          })
          const history = await response.json();
          return history;
        }
        if(status === 'authenticated'){
            console.log(session.user.id)
            getUserHistory().then((history)=>{
                console.log(history.history);
                setUserHistory(history.history);
                setLoading(false);
            })
        }
      },[status, state.selectedMp3])

    return (
            <motion.div 
                className={styles.container + ' ' + font}
                layout={true}
                style={{boxShadow: state.scrollYPosition !=0 ? ' 8px 8px 5px -5px var(--themeColorLight)' : 'none'}}
                animate={{width: (isHovered && state.scrollYPosition !=0)? 300 : 75, originX: 0, translateX: state.scrollYPosition !=0 ? 0 : -100}}
                transition={{width: {duration: 0.2, delay: isHovered ? 0.4 : 0}, translateX:{duration: 0.2, delay: state.scrollYPosition !=0 ? 0: 0.8}}}
                onMouseEnter={()=>setIsHovered(true)}
                onMouseLeave={()=>setIsHovered(false)}
                onAnimationStart={()=> setIsAnimationFinished(false)}
                onAnimationComplete={()=> setIsAnimationFinished(true)}
            >
                <div 
                    className={styles.sideBar}
                    ref={sideBarRef}
                >
                    <motion.div 
                        className={styles.background}
                        animate={{ opacity: state.scrollYPosition != 0 ? 1 : 0 }}
                        transition={{ duration: 0.35 }}
                    >
                    </motion.div>
                    <div 
                        className={styles.iconContainer}
                        ref={iconContainerRef}
                    >
                        <div 
                            className={styles.itemWrapper}>
                            <div 
                                className={styles.icon}
                            >
                                <img 
                                    src="/favorites-star.png" 
                                    alt="Favorites" 
                                    className={styles.iconImage}
                                />
                            </div>
                            <span className={styles.seperator}></span>
                            <div className={styles.text}>Favorites</div>
                        </div>
                        <div className={styles.itemWrapper}>
                            <div 
                                className={styles.icon}
                            >
                                <img src="/eye.png" alt="Recently Viewed" className={styles.iconImage}/>
                            </div>
                            <span className={styles.seperator}></span>
                            <div className={styles.text}>Recently Viewed Artists</div>
                        </div>
                        <div 
                            className={styles.itemWrapper}
                            id='history'
                            onClick={()=>{
                                    if(isAnimationFinished){
                                        setIsShown(!isShown)
                                    }
                                }
                            }
                        >
                            <div 
                                className={styles.icon}
                            >
                                <img src="/song-history.png" alt="History" className={styles.iconImage}/>
                            </div>
                            <span className={styles.seperator}></span>
                            <div className={styles.text}>History</div>
                        </div>
                        <AnimatePresence>
                            {(status === 'authenticated' && !loading && isShown && isHovered) &&
                                <HistoryWindow history={userHistory} sideBarRef={sideBarRef} iconContainerRef={iconContainerRef}/>
                            }
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
    )
}