'use client'

import { League_Spartan } from '@next/font/google'
import styles from './page.module.css'
import { useCallback, useEffect, useRef, useState } from 'react'
import {motion, AnimatePresence, useAnimationControls} from 'framer-motion'
import { useStateContext, useDispatchContext } from 'utils/ReducerContext'
import SongPlayerBar from '@/components/SongPlayerBar'
import getArtistData from 'lib/getArtistData'
import Carosel from '@/components/Carosel'
import DynamicHeader from '@/components/DynamicHeader'
import { ACTIONS } from 'utils/actions'
import Hero from '@/components/Hero'
import ArtistInfo from '@/components/ArtistInfo'
import FeaturedTracks from '@/components/FeaturedTracks'
import { useSearchParams } from 'next/navigation'
import HeroNoVideo from '@/components/HeroNoVideo'
import { useSongDispatchContext, useSongStateContext } from 'utils/SongContext'

const font = League_Spartan({ subsets: ['latin'] })


export default function ArtistLandingPage() {
 
  const searchParams = useSearchParams();
  const artistName = searchParams.get('name')
  const [timerHit, setTimerHit] = useState(false);
  const [artistData, setArtistData] = useState(null);
  const [albums, setAlbums] = useState(null);
  const [singles, setSingles] = useState(null);
  const [tracks, setTracks] = useState(null);
  const [topTracks, setTopTracks] = useState(null);
  const [compilations, setCompilations] = useState(null);
  const [areRowsInView, setAreRowsInView] = useState(false)
  const [isFeaturedTrackInView, setIsFeaturedTrackInView] = useState(false)
  const videoRef = useRef();

  const [loading, setLoading] = useState(true);
//   const [isRowHovered, setIsRowHovered] = useState(false);
 

  const controls = useAnimationControls();
//   const songContainer = useRef();
  const state = useStateContext();
  const dispatch = useDispatchContext();
  const mainRef = useRef(null);

  const songState = useSongStateContext();
  const songDispatch = useSongDispatchContext();

  const handleScroll = (e) => {
    dispatch({ type: ACTIONS.SET_SCROLL_Y_POSITION, payload: e.currentTarget.pageYOffset })
  }

  useEffect(()=>{
    controls.set({opacity: 0})
    controls.start({opacity : 1})
  },[])

  useEffect(()=>{
    if(songState.hasSongEnded===true){
        const timer = setTimeout(()=>{
            setTimerHit(true);
            songDispatch({type: ACTIONS.IS_TIMER_HIT, payload: true})
        },1000)

        return ()=> clearInterval(timer);
    }
  },[songState.hasSongEnded])

useEffect(()=>{
  getArtistData(artistName).then((artistData)=>{
    console.log(artistData)
    const albums = artistData.albums.filter((album)=>{
      return album.album_type === 'album'
    })
    const uniqueAlbums = [...new Map(albums.map((album)=>[album.name, album])).values()]

    const singles = artistData.albums.filter((album)=>{
      return album.album_type === 'single'
    })
    const uniqueSingles = [...new Map(singles.slice(0,30).map((single)=>[single.name, single])).values()];

    const compilations = artistData.albums.filter((album)=>{
      return album.album_type === 'compilation'
    })
    const uniqueCompilations = [...new Map(compilations.map((comp)=>[comp.name, comp])).values()]
    
    const tracks = artistData.albums.map((track)=>{
        return track;
    })
    const uniqueTracks = [...new Map(tracks.map((track)=>[track.name, track])).values()]

    setAlbums(uniqueAlbums);
    setSingles(uniqueSingles);
    setTracks(uniqueTracks);
    setTopTracks(artistData.topTracks);
    setCompilations(uniqueCompilations);
    setArtistData(artistData);
    return
  }).then(()=>{
    setLoading(false);
  });
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll);
},[])

useEffect(()=>{
  if(state.scrollYPosition> 200){
      setIsFeaturedTrackInView(true)
  }

  if(state.scrollYPosition > 700){
    setAreRowsInView(true)
  }

},[state.scrollYPosition])
return (
    <>
        <DynamicHeader
          font={font.className}
          artistData={artistData} 
        />
    {!loading &&
      <>
        {artistData.isJR ?
          <Hero font={font.className} artistData={artistData} videoRef={videoRef} />
          :
          <HeroNoVideo font={font.className} artistData={artistData}/>
        }
      </>
    }
      <motion.main
        id='main'
        ref={mainRef}
        className={styles.main + ' ' + font.className}
        // style={{ backgroundImage: `url(${artistData?.artistInfo.images[0].url}` }}
        initial={{opacity: 0}}
        animate={controls}
      >
        <motion.div 
          className={styles.mainWrapper}
          initial={{opacity: 0}}
          animate={controls}
        >
          <AnimatePresence>
            {(isFeaturedTrackInView && !loading) &&
              <motion.div
                initial={{opacity: 0}}
                transition={{duration: 0.8}}
                animate={{opacity: 1}}
                exit={{opacity: 1}}
              >
                {artistData?.isJR?
                <FeaturedTracks tracks={tracks.slice(45, 56)} loading={loading}/>
                :
                <FeaturedTracks tracks={tracks.slice(10, 20)} loading={loading}/>
              }
              </motion.div>
            }
          </AnimatePresence>
          <AnimatePresence>
            {!loading && areRowsInView &&
              <motion.div
                initial={{opacity: 0}}
                transition={{duration: 0.8}}
                animate={{opacity: 1}}
                exit={{opacity: 1}}
              >
                <Carosel setTimerHit={setTimerHit} data={topTracks} loading={loading} videoRef={videoRef} mainRef={mainRef}/>
                <Carosel setTimerHit={setTimerHit} data={albums} loading={loading} videoRef={videoRef} mainRef={mainRef}/>
                <Carosel setTimerHit={setTimerHit} data={singles} loading={loading} videoRef={videoRef} mainRef={mainRef}/>
                <ArtistInfo artistData={artistData} loading={loading}/>
              </motion.div>
            }
          </AnimatePresence>
            
        </motion.div>

          
      </motion.main>
    </>
  )
}