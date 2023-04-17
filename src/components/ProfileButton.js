'use client'
import styles from './ProfileButton.module.css'
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfileButton(){
const {data: session, status } = useSession();
const [isProfileClicked, setIsProfileClicked] = useState(false);
const [isDropDownShown, setIsDropDownShown] = useState(false);
const dropDownRef = useRef();

    if(status === 'authenticated'){
        return(
            <div 
                className={styles.container}
                >
                <div className={styles.imageWrapper}>
                    <Image
                        onClick={()=> {
                            setIsDropDownShown(!isDropDownShown);
                           }}
                        src={session.user.image}
                        alt={session.user.name}
                        height={45}
                        width={45}                
                    ></Image>
                </div>
                <AnimatePresence>
                    {isDropDownShown && 
                        <motion.div
                            className={styles.dropdown}
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{duration: 0.2}}
                            exit={{opacity: 0}}
                            ref={dropDownRef}
                            autoFocus={true}
                            onBlur={()=>{
                                    setIsDropDownShown(!isDropDownShown)
                            }}
                        >
                            <span className={styles.topDecoration}></span>
                            <p 
                                className={styles.username}
                            >{session.user.name}</p>
                            <span className={styles.seperator}></span>
                            <p className={styles.items}>Profile</p>
                            <p className={styles.items}>My Tracks</p>
                            <span className={styles.seperator}></span>
                            <p
                                className={styles.signOut}
                                onClick={()=> signOut()}
                            >Sign Out</p>
                        </motion.div>
                    }
                </AnimatePresence>
            </div>
        )
    }
}