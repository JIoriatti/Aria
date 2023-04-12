import styles from './SideBar.module.css'
import { motion} from 'framer-motion'
import { useState } from 'react';
import { useStateContext } from 'utils/ReducerContext'

export default function SideBar(){
    const state = useStateContext();
    const [isHovered, setIsHovered] = useState(false);

    return (
            <motion.div 
                className={styles.container}
                initial={{scaleX: 1, originX: 0}}
                animate={{scaleX: isHovered? 4 : 1, originX: 0}}
                transition={{duration: 0.2, delay: isHovered? 0.4 : 0}}
                onMouseEnter={()=>setIsHovered(true)}
                onMouseLeave={()=>setIsHovered(false)}
            >
                <div className={styles.sideBar}>
                    <motion.div 
                        className={styles.background}
                        animate={{ opacity: state.scrollYPosition != 0 ? 1 : 0 }}
                        style={{boxShadow: state.scrollYPosition !=0 ? ' 0 0 10px 0 var(--themeColorLight)' : 'none'}}
                        transition={{ duration: 0.35 }}
                    >
                    </motion.div>
                </div>
            </motion.div>
    )
}