'use client'
import styles from './DynamicHeader.module.css'
import SearchBar from './SearchBar'
import { useStateContext, useDispatchContext } from "utils/ReducerContext"
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import ProfileButton from './ProfileButton'


export default function DynamicHeader({ font, artistData }) {
    const state = useStateContext();
    const dispatch = useDispatchContext();
    const { data: session } = useSession();

    return (
        <div
            className={styles.outerWrapper + ' ' + font}
        >
            <header
                className={styles.dynamicHeader}
                >


                <motion.div
                    className={styles.background}
                    
                    animate={{ opacity: state.scrollYPosition != 0 ? 1 : 0 }}
                    transition={{ duration: 0.35 }}
                    
                    >
                </motion.div>
                <div className={styles.profileContainer}>
                    {session && <ProfileButton />}
                    {!session && 
                        <div
                            className={styles.signInOut}
                            onClick={()=>signIn()}
                        >Sign In</div>
                    }
                </div>
                {/* <ProfileButton /> */}
                <div
                    className={styles.centeringWrapper}
                    >
                        <AnimatePresence>
                            {state.scrollYPosition> 799 && 
                                <motion.div 
                                className={styles.artistNameContainer}
                                initial={{opacity: 0, originX: 0, translateX: -50}}
                                animate={{opacity: 1, originX: 0, translateX:  0}}
                                transition={{opacity: {duration: 0.4, delay: 0.2}, translateX: {duration: 0.2, delay: 0.2}}}
                                exit={{opacity: 0, originX: 0, translateX: -50, transition:{opacity: {delay: 0}}}}
                                >
                                    <h2
                                        className={styles.artistName}
                                    >
                                        {artistData?.artistInfo.name}
                                    </h2>
                                </motion.div>
                            }
                        </AnimatePresence>
                        <AnimatePresence>
                            {state.scrollYPosition> 799 &&
                                <motion.span
                                    className={styles.lineSeperator}
                                    initial={{opacity:0}}
                                    animate={{opacity: 1}}
                                    exit={{opacity: 0, transition: {delay: 0.2}}}
                                    transition={{duration: 0.2}}
                                >

                                </motion.span>
                            }
                        </AnimatePresence>
                    <h1
                        className={styles.appName}
                    >
                        {/* {artistData?.artistInfo.name} */}
                        Aria
                    </h1>
                    <nav className={styles.navigation}>
                    </nav>
                </div>
                <SearchBar />
            </header>
        </div>
    )
}