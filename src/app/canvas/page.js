'use client'
import ColorSchemer from "@/components/ColorSchemer";
import getArtistData from "lib/getArtistData";
import { useEffect, useRef, useState } from "react";
import styles from './test.module.css'
import { v4 as uuidv4 } from 'uuid';
import React from "react";
import { motion } from 'framer-motion'



export default function TestPage(){
    const [data, setData] = useState();
    const [translate, setTranslate] = useState('none');
    const [width, setWidth] = useState(0);
    const [pageWidth, setPageWidth] = useState(0);
    const [count, setCount] = useState(1);
    const [clickCount, setClickCount] = useState(0);
    const [transition, setTransition] = useState('none')
    const [isAnimating, setIsAnimating] = useState(false);
    const rowSectionRefs = useRef([])
    const itemHolderRef = useRef();
    
    useEffect(()=>{
        const page = document.querySelector('html');
        const rect = page.getBoundingClientRect();
        setPageWidth(rect.width)
        const imageWidth = (rect.width - 75)/10
        setWidth(imageWidth);
    },[])
    useEffect(()=>{
        // rowSectionRefs.current =[];
        const getData = async()=>{
            const data = await getArtistData('jason ross');
            setData(data);
        }
        getData();

    },[])


    return(
        <>
            {/* <ColorSchemer image={'https://i.scdn.co/image/ab67616d00001e0248e6dd9fe5f0d10f7323fd72'}/>
             <ColorSchemer image={'https://i.scdn.co/image/ab67616d00001e0264514444eef0d9fcbdd53e7c'}/>
            <ColorSchemer image={'https://i.scdn.co/image/ab67616d00001e02336ef25459d1b97577398518'}/> */}



            {/**Reworked carousel functionality, need to integrate into Carousel component */}
            <div 
                className={styles.slider}
                
            >
                <div
                    className={styles.itemHolder}
                    id="itemHolder"
                    ref={itemHolderRef}
                    style={{left: -pageWidth+75}}
                >
                    {data?.albums?.map((album, i, array) => {
                        
                            return <>
                            {i===0 && 
                                    <motion.div
                                        className={styles.rowSection}
                                        ref={rowSection=> rowSectionRefs.current.push(rowSection)}
                                        style={{transform: translate, transition: transition}}
                                        onTransitionEnd={()=>{
                                            if(count ===1){
                                                setTimeout(()=>{
                                                    itemHolderRef.current.prepend(rowSectionRefs.current[rowSectionRefs.current.length-1])
                                                    let next = rowSectionRefs.current.pop()
                                                    rowSectionRefs.current.unshift(next)
                                                })
                                            }
                                            else{
                                                setTimeout(()=>{
                                                    itemHolderRef.current.appendChild(rowSectionRefs.current[0])
                                                    let next = rowSectionRefs.current.shift()
                                                    rowSectionRefs.current.push(next)
                                                })
                                            }
                                            setTransition('none')
                                            setTranslate('none')
                                            
                                        }}
                                        >
                                        {data?.albums?.map((album, i, array)=>{
                                            return <React.Fragment key={uuidv4()}>
                                                {i<=9 &&
                                                        <div
                                                            className={styles.item}
                                                            style={{ width: `${width}px` }}
                                                        >
                                                            <img src={album.images[1].url} alt='whatever' className={styles.image} />
                                                        </div>
                                                    }
                                            </React.Fragment>
                                        })}
                                    </motion.div>
                            }
                            {i===10 && 
                                    <motion.div
                                        className={styles.rowSection}
                                        ref={rowSection=> rowSectionRefs.current.push(rowSection)}
                                        style={{transform: translate, transition: transition}}
                                        >
                                        {data?.albums?.map((album, i, array)=>{
                                            return <React.Fragment key={uuidv4()}>
                                                {(i>=10 && i<=19) &&     
                                                        <div
                                                            className={styles.item}
                                                            style={{ width: `${width}px` }}
                                                        >
                                                            <img src={album.images[1].url} alt='whatever' className={styles.image} />
                                                        </div>
                                                    }
                                            </React.Fragment>
                                        })}
                                    </motion.div>
                            }
                            {i===20 && 
                                    <motion.div
                                        className={styles.rowSection}
                                        ref={rowSection=> rowSectionRefs.current.push(rowSection)}
                                        style={{transform: translate, transition: transition}}
                                        >
                                        {data?.albums?.map((album, i, array)=>{
                                            return <React.Fragment key={uuidv4()}>
                                                {(i>=20 && i<=29) &&      
                                                        <div
                                                            className={styles.item}
                                                            style={{ width: `${width}px` }}
                                                        >
                                                            <img src={album.images[1].url} alt='whatever' className={styles.image} />
                                                        </div>
                                                    }
                                            </React.Fragment>
                                        })}
                                    </motion.div>
                            }        
                            </>

                        
                    })}
                </div>
                <button
                    onClick={()=> {
                        itemHolderRef.current.style.justifyContent = 'flex-end'
                        setTransition('transform 0.5s ease')
                        setTranslate(`translate3d(${(pageWidth-75)}px, 0px, 0px)`)
                        setCount(1)
                       
                        setIsAnimating(true);
                    }}
                >Left</button>
                <button
                onClick={()=> {
                    itemHolderRef.current.style.justifyContent = 'flex-start'
                    setTransition( 'transform 0.5s ease')
                    setTranslate( `translate3d(-${(pageWidth-75)}px, 0px, 0px)`)
                    setCount(-1)
                    if(clickCount<rowSectionRefs.current.length){
                        setClickCount((prevCount)=> prevCount+=1)
                    }
                    if(clickCount=== rowSectionRefs.current.length){
                        setClickCount(0);
                    }
                    setIsAnimating(true);
                }}
                >Right</button>

            </div>
        
        </>
    )
}