import styles from './ArtistInfo.module.css'
import { useState, useEffect, memo } from 'react'
import Image from 'next/image'


export default function ArtistInfo ({artistData, loading}){
    return (
        <div 
            className={styles.container}
        >
            {/* <Image
                src={'/JRLogo.png'}
                alt='Jason Ross Logo'
                height={20}
                width={20}
                className={styles.logo}
            /> */}
            <h3 className={styles.header}> About </h3>
            <div className={styles.infoWrapper}>
                <div className={styles.imageContainer}>
                    {!loading && 
                        <img
                            src={artistData.artistInfo.images[2].url}
                            loading='lazy'
                            alt={artistData?.artistInfo.name}
                        />
                    }
                </div>
                <div className={styles.followersContainer}>
                    <h4
                        style={{position: 'relative'}}
                    >{artistData.artistInfo.name} 
                    {artistData.artistInfo.name === 'Jason Ross' && 
                        <Image
                            src={'/JRLogo.png'}
                            alt='Jason Ross Logo'
                            style={{position: 'absolute', bottom: '0', marginLeft: '1rem'}}
                            height={35}
                            width={40}
                            className={styles.logo}
                        />
                    }
                    </h4>
                    <p>Followers : {artistData?.artistInfo?.followers.total}</p>
                </div>
            </div>
        </div>
    )
}
