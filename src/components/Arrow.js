import { useEffect, useRef, useState } from 'react';
import styles from './Arrow.module.css'
import {motion, AnimatePresence} from 'framer-motion'


export default function Arrow ({songContainer, isRowHovered}){
    const [screenWidth, setScreenWidth] = useState(null);
    const handleClickLeft=(e)=>{
        e.preventDefault()
        songContainer.current.scrollBy({
            left: -1550 ,
            behavior: 'smooth'
        })
    }
    const handleClickRight=(e)=>{
        e.preventDefault()
        songContainer.current.scrollBy({
            left: 1550 ,
            behavior: 'smooth'
        })
    }

    const handleWindowResize = () =>{
        setScreenWidth(document.querySelector('html').clientWidth);
    }

    useEffect(()=>{
        window.addEventListener('resize', handleWindowResize)
        setScreenWidth(document.querySelector('html').clientWidth)

        return ()=> window.removeEventListener('resize', handleWindowResize)
    },[screenWidth])

    return (
        <>
            <AnimatePresence>
                {songContainer?.current?.scrollLeft !== 0 && isRowHovered &&
                    <motion.div
                        className={styles.leftArrow}
                        onClick={handleClickLeft}
                        initial={{opacity:0}}
                        animate={{opacity: 1}}
                        transition={{duration: 0.2, ease: 'easeInOut'}}
                        exit={{opacity: 0}}
                    >
                        <div className={styles.leftArrowImage}></div>
                    </motion.div>
                }
            </AnimatePresence>
            <AnimatePresence>
                {songContainer?.current?.scrollLeft !== songContainer?.current?.scrollWidth - songContainer?.current?.clientWidth &&
                    isRowHovered &&
                    <motion.div
                        className={styles.rightArrow}
                        // style={{right: (screenWidthRef.current + 17)}}

                        //********* */
                        style={{left: (screenWidth - 70) -75}}
                        //***** */
                        onClick={handleClickRight}
                        initial={{opacity:0}}
                        animate={{opacity: 1}}
                        transition={{duration: 0.2, ease: 'easeInOut'}}
                        exit={{opacity: 0}}
                    >
                        <div className={styles.rightArrowImage}></div>
                    </motion.div>
                }
            </AnimatePresence>
        </>
    )
}