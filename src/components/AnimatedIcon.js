import styles from './AnimatedIcon.module.css'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react';
import { useStateContext, useDispatchContext } from 'utils/ReducerContext';

export default function AnimatedIcon({mp3, forHero}){
const state = useStateContext();
const dispatch = useDispatchContext();
// useEffect(()=>{
//     class Dictionary{
//         constructor(wordsArray){
//             this.dict = wordsArray
//         }
//         isInDict(word){
//           let includesWord = false;
//             const splitWord = word.split('');
//             this.dict.forEach((dictWord)=>{
//                 const wildcard = '*';
                
//                 let splitDictWord = dictWord.split('');
//                 let indexOfWildcard = splitDictWord.indexOf(wildcard);
    
//                 if(indexOfWildcard !== -1){
//                     splitDictWord.splice(indexOfWildcard, 1);
//                 }
//                 if(splitDictWord.every((letter)=> splitWord.includes(letter))){
//                   includesWord = true;
//                 }
//             })
//             return includesWord;
//         }
//     }

//     const dictionaryOne = new Dictionary(['hello', 'c*t', '*at', 'ca*', 'john', 'runni*g']);
//     console.log(dictionaryOne.isInDict('running'))
//     console.log(dictionaryOne.isInDict('cat'))
//     console.log(dictionaryOne.isInDict('cal'))
//     console.log(dictionaryOne.isInDict('cut'))
//     console.log(dictionaryOne.isInDict('cil'))
//     console.log(dictionaryOne.isInDict('c*t'))
// },[])
    

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
                    <div className={styles.container}>
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

                        <p className={styles.currentlyPlaying}>Currently playing...</p>
                    </div>
                    
                }
            </>
        )
    }
}