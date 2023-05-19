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
import { fadeOutAnimation, fadeInAnimation } from 'utils/backgroundAnimation'
import { useSession } from 'next-auth/react'

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
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(true)

  const videoRef = useRef();

  const {data: session, status} = useSession();

  const [loading, setLoading] = useState(true);

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
    let fadeOutId;
    let fadeInId;
    let timeout;
    if(state.colorObj && !songState.hasSongEnded && state.isSongPlaying){
      fadeOutId = fadeOutAnimation(dispatch, state, mainRef)
      timeout = setTimeout(()=>{
        fadeInId = fadeInAnimation(dispatch, state, mainRef)
      },1500)
    }

    if(songState.hasSongEnded || (state.colorObj && !state.isSongPlaying)){
      fadeOutId = fadeOutAnimation(dispatch,state,mainRef)
    }
    
    
    return () => {
      clearInterval(fadeInId)
      clearInterval(fadeOutId);
      clearTimeout(timeout)
      }
  },[state.selectedMp3, state.colorObj, state.isSongPlaying])

  useEffect(()=>{
    controls.set({opacity:1})
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


    //get users favorites to render icons/inset shadow accordingly
    useEffect(()=>{
      const getUserFavorites = async()=>{
          const response = await fetch(`/api/favorites/${session.user.id}`,{
              method: 'GET',
              headers: {
                  'content-type' : 'application/json'
              }
          })
          const user = await response.json();
          return user.favorites;
      }
      if(status === 'authenticated'){
        getUserFavorites().then((favorites)=> {
          dispatch({type: ACTIONS.SET_USER_FAVORITES, payload: favorites})
          // setUserFavorites(favorites);
          setIsFavoritesLoading(false);
        })
      }
      if(!session){
        setIsFavoritesLoading(false);
      }
  },[status])

//add artist to recent artists for user
  useEffect(()=>{
    const addToRecentArtists =async()=>{
      const userId = session.user.id;
      const response = await fetch(`/api/artists/${artistData.artistId}`,{
        method: 'POST',
        body: JSON.stringify({artistData, userId})
      })
      const resToJson = await response.json();
    }
    if(artistData && status ==='authenticated'){
      addToRecentArtists();
    }
  },[artistData, status])

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
        initial={{opacity: 1}}
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
            {!loading && !isFavoritesLoading &&
              <motion.div
                initial={{opacity: 0}}
                transition={{duration: 0.8}}
                animate={{opacity: areRowsInView? 1 : 0}}
                exit={{opacity: 1}}
              >
                <Carosel setTimerHit={setTimerHit} data={topTracks} loading={loading} videoRef={videoRef} mainRef={mainRef}/>
                <Carosel setTimerHit={setTimerHit} data={albums} loading={loading} videoRef={videoRef} mainRef={mainRef} />
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