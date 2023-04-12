import styles from './IntervalTrack.module.css'
import { useEffect, useState } from 'react';

export default function IntervalTrack ({tracks, index, setIndex}) {
    const [currentDot, setCurrentDot] = useState(null);
    
    const handleClick = (e)=>{
        if(e.target.dataset.dir === 'right'){
            setIndex((prevIndex)=> prevIndex+=1)
        }
        if(e.target.dataset.dir === 'left'){
            setIndex((prevIndex)=> prevIndex-=1)
        }
    }

    useEffect(()=>{
        console.log(index)
    },[index])
    return (
        <div className={styles.container}>
            <div 
                className={styles.arrow}
                onClick={handleClick}
                data-dir= 'left'
            >
            
            </div>
            {tracks.map((track,i)=>{
                return <span key={i} className={styles.dot + ' ' + (index  == i ? styles.current : '')}></span>
            })}
            <div 
                className={styles.arrow + ' ' + styles.right }
                onClick={handleClick}
                data-dir= 'right'
            >   
            </div>
        </div>
    )
}