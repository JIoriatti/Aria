import styles from './IntervalTrack.module.css'
import { useEffect, useState } from 'react';

export default function IntervalTrack ({tracks, intervalRef}) {
    const [currentDot, setCurrentDot] = useState(null);
    
    const handleClick = ()=>{

    }

    useEffect(()=>{
        console.log(tracks?.slice(44,10))
    },[])
    return (
        <div className={styles.container}>
            <div 
                className={styles.arrow}
                onClick={handleClick}
            >
            
            </div>
            {tracks.map((track,i)=>{
                return <span key={i} className={styles.dot + ' ' + (intervalRef.current  == i ? styles.current : '')}></span>
            })}
            <div 
                className={styles.arrow + ' ' + styles.right }
                onClick={handleClick}
            >   
            </div>
        </div>
    )
}