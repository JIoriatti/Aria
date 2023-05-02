import styles from './Carosel.module.css'
import { AnimatePresence, motion} from 'framer-motion'
import { useState, useRef, useCallback, useEffect} from 'react'
import PlayButton from './PlayButton'
import AnimatedIcon from './AnimatedIcon'
import { useStateContext, useDispatchContext } from 'utils/ReducerContext'
import { ACTIONS } from 'utils/actions'
import Arrow from './Arrow'
import { useSongDispatchContext, useSongStateContext } from 'utils/SongContext'
import { useSession } from 'next-auth/react'
import { colorScheme} from 'utils/colorScheme'
import { handleSongChange, handleSongChangeState } from 'utils/songHandler'
import { handleFavoriteClick, createDatabaseObj } from 'utils/handleFavorite'


export default function Carosel({setTimerHit, data, loading, videoRef, mainRef}){
    const [isRowHovered, setIsRowHovered] = useState(false);
    
    const state = useStateContext();
    const dispatch = useDispatchContext();

    const songState = useSongStateContext();
    const songDispatch = useSongDispatchContext();

    const songContainer = useRef();
    const imageRefs = useRef([]);
    
    const { data: session } = useSession();

    const handleImageClick = (e) =>{
        if(e.target.dataset.mp3 == null){
            return
        }
        else{
            dispatch({type: ACTIONS.IS_HERO_PLAYING, payload: false})
            if(videoRef.current){
                videoRef.current.pause();
            }
            // dispatch({type: ACTIONS.IS_HERO_MUTED, payload: true})
            handleSongChangeState(e, state, dispatch, songDispatch, session);
            setTimerHit(false)
            handleSongChange(e, state, dispatch, songDispatch, session);
            colorScheme(e.target.dataset.image, dispatch, state)
            if(e.target.dataset.mp3 !== state.selectedMp3){
                addToHistory(e) 
            }
        }
    }

    const createImageRefs = useCallback((image)=>{
        if(image && !imageRefs.current.includes(image)){
            imageRefs.current.push(image);
        }
    },[])

    const checkIfInView = useCallback(()=>{
        imageRefs.current.forEach((image)=>{
            let rect = image.getBoundingClientRect();
            
            if(rect.right-rect.left === 1 || rect.right + rect.left === -1){
                if(rect.right + 299 > 0 && rect.left < window.innerWidth ){
                    setImageSrc(image);
                }
            }
            else if(rect.right > 0 && rect.left < window.innerWidth ){
                setImageSrc(image);
            }
            else{
                setImageSrc(image, 'hide');
            }
        })
    },[])
    const setImageSrc = (image, hide)=>{
        if(hide){
            image.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=' )
           
        }
        else{
            image.setAttribute('src', `${image.dataset.src}`)
        }
    }

    //only implementing useCallback here to try and figure out why hero image and about-section
    //image are re-rendering when hovering over song images -- remove later, unnessessary
    const updateHoveredImageState = useCallback((e)=>{
        dispatch({ type: ACTIONS.SET_HOVERED_IMAGE, payload: e.currentTarget.dataset.id })
    },[])


    const addToHistory = async(e)=>{
        try{
            const songInfo = createDatabaseObj(e.target, data)
            await fetch(`/api/history/${session.user.id}`,{
                method: 'POST',
                body: JSON.stringify({
                    songInfo,
                })
            })
        }catch(err){
            throw new Error(err)
        }
    }

    useEffect(()=>{
            const songContainerRef = songContainer.current;
            songContainer.current.addEventListener('scroll', checkIfInView)

            return () => songContainerRef.removeEventListener('scroll', checkIfInView)
    },[])

    //Clear background color animation interval when a new song is clicked
    useEffect(()=>{
        if(state.interval){
            return () => clearInterval(state.interval)
        }
    },[state.interval])

    //for checking if songState.isSongPlaying is set to false, also set state.isSongPlaying to false
    //had to implement this since songPlayerBar is seperated from global state to avoid
    //re-renders on every state change
    useEffect(()=>{
        if(songState.isSongPlaying === false){
            dispatch({type: ACTIONS.SET_IS_SONG_PLAYING, payload: false})
        }
        if(songState.isSongPlaying === true){
            dispatch({type: ACTIONS.SET_IS_SONG_PLAYING, payload: true})
        }
    },[songState.isSongPlaying])


    if (!loading) {
        return (
            <>
                <div
                    className={styles.containerWrapper}
                    onMouseEnter={(e) => {
                        setIsRowHovered(true)
                    }}
                    onMouseLeave={(e) => {
                        setIsRowHovered(false)
                    }}
                >
                    {data[0]?.album_type === 'album' && !data[0]?.isTopTrack &&
                        <h1 className={styles.newReleases}>Albums & Compilations</h1>
                    }
                    {data[0]?.album_type === 'single' && !data[0]?.isTopTrack &&
                        <h1 className={styles.newReleases}>Singles</h1>
                    }
                    {data[0]?.isTopTrack &&
                        <h1 className={styles.newReleases}>Top Tracks</h1>
                    }
                    <Arrow songContainer={songContainer} isRowHovered={isRowHovered} />
                    <div
                        className={styles.container}
                        ref={songContainer}
                    >

                        <div className={styles.mainWrapper}>
                            {data?.map((album, i) => {
                                return (
                                    <div key={i} className={styles.mainContainer}>
                                        <motion.div
                                            className={styles.wrapper}
                                            transition={{ duration: 0.1, delay: state.hoveredImage === album.id ? 0.5 : 0 }}
                                            animate={{ scale: state.hoveredImage === album.id ? 1.2 : 1 }}
                                            exit={{ scale: 1, transition: { duration: 0.1, delay: 0 } }}
                                            style={{ zIndex: state.hoveredImage === album.id ? 100 : 'initial' }}
                                        >
                                            {album?.tracks?.items[0] ?
                                                <motion.div
                                                    className={styles.imageContainer}
                                                    // style={{ backgroundImage: `url(${album.images[1].url})`}}
                                                    onMouseEnter={(e)=>{
                                                        updateHoveredImageState(e)
                                                        // dispatch({ type: ACTIONS.SET_HOVERED_IMAGE, payload: e.currentTarget.dataset.id })
                                                    }}
                                                    onMouseOut={(e) => {
                                                        dispatch({ type: ACTIONS.SET_HOVERED_IMAGE, payload: null })
                                                    }}
                                                    data-image={album.images[1].url}
                                                    data-artist={album.artists[0].name}
                                                    data-song={album.name}
                                                    data-id={album.id}
                                                    // data-color={image.color}
                                                    data-mp3={album?.tracks?.items[0]?.preview_url}
                                                    onClick={handleImageClick}
                                                    animate={state.selectedMp3 === album.tracks.items[0].preview_url && state.isSongPlaying ? { borderRadius: state.hoveredImage === album.id ? '0px' : '5px', outline: (session && state.userFavorites.some((song)=> song.songName === album.name)) ? '2px solid gold' : '2px solid white' } : { borderRadius: state.hoveredImage === album.id ? '0px' : '5px', boxShadow: state.hoveredImage === album.id ? 'none' : null }}
                                                    transition={{ duration: 0.1, delay: state.hoveredImage === album.id ? 0.5 : 0 }}

                                                >
                                                    <img
                                                        src={album.images[1].url}
                                                        alt={album.name}
                                                        data-src={album.images[1].url}
                                                        className={styles.image}
                                                        ref={createImageRefs}
                                                        // height={200}
                                                        // width={300}
                                                        // fill={true}
                                                        // sizes='300px'
                                                        style={{ objectFit: 'contain', pointerEvents: 'none' }}
                                                        loading='lazy'
                                                    />

                                                    <motion.h2
                                                        className={styles.thumbnailName}
                                                        initial={{ opacity: 1, translateY: 0, originY: 1 }}
                                                        animate={{ translateY: state.hoveredImage !== album.id ? 0 : 80 }}
                                                        transition={{ duration: 0.2, delay: state.hoveredImage !== album.id ? 0 : 0.6 }}
                                                        exit={{ opacity: 1 }}
                                                    >{album.name}
                                                    </motion.h2>

                                                    <PlayButton imageSrc={album.id} mp3={album?.tracks.items[0]?.preview_url} />
                                                    {state.isSongPlaying && <AnimatedIcon mp3={album?.tracks.items[0]?.preview_url} />}
                                                </motion.div>
                                                :
                                                <motion.div
                                                    className={styles.imageContainer}
                                                    // style={{ backgroundImage: `url(${album.images[1].url})`}}
                                                    onMouseEnter={(e) => {
                                                        updateHoveredImageState(e)
                                                        // dispatch({ type: ACTIONS.SET_HOVERED_IMAGE, payload: e.currentTarget.dataset.id })
                                                    }}
                                                    onMouseOut={(e) => {
                                                        dispatch({ type: ACTIONS.SET_HOVERED_IMAGE, payload: null })
                                                    }}
                                                    data-image={album.images[1].url}
                                                    data-artist={album.artists[0].name}
                                                    data-song={album.name}
                                                    // data-color={image.color}
                                                    data-mp3={album?.preview_url}
                                                    data-id={album.id}
                                                    onClick={handleImageClick}
                                                    animate={state.selectedMp3 === album.preview_url && state.isSongPlaying ? { borderRadius: state.hoveredImage === album.id ? '0px' : '5px', outline: (session && state.userFavorites.some((song)=> song.songName === album.name)) ? '2px solid gold':'2px solid white' } : { borderRadius: state.hoveredImage === album.id ? '0px' : '5px', boxShadow: state.hoveredImage === album.id ? 'none' : null }}
                                                    transition={{ duration: 0.1, delay: state.hoveredImage === album.id ? 0.5 : 0 }}

                                                >
                                                    {/* <Image
                                                        src={album.images[0].url}
                                                        alt={album.name}
                                                        ref={createImageRefs}
                                                        data-src={album.images[0].url}
                                                        // height={200}
                                                        // width={300}
                                                        fill={true}
                                                        sizes='300px'
                                                        style={{ objectFit: 'cover', pointerEvents: 'none' }}
                                                        loading='lazy'
                                                    /> */}
                                                    <img
                                                        src={album.images[1].url}
                                                        alt={album.name}
                                                        data-src={album.images[1].url}
                                                        className={styles.image}
                                                        ref={createImageRefs}
                                                        // height={200}
                                                        // width={300}
                                                        // fill={true}
                                                        // sizes='300px'
                                                        style={{ objectFit: 'contain', pointerEvents: 'none' }}
                                                        loading='lazy'
                                                    />
                                                    <motion.h2
                                                        className={styles.thumbnailName}
                                                        initial={{ opacity: 1, translateY: 0, originY: 1 }}
                                                        animate={{ translateY: state.hoveredImage !== album.id ? 0 : 80 }}
                                                        transition={{ duration: 0.2, delay: state.hoveredImage !== album.id ? 0 : 0.6 }}
                                                        exit={{ opacity: 1 }}
                                                    >{album.name}
                                                    </motion.h2>
                                                    <PlayButton imageSrc={album.id} mp3={album.preview_url} />
                                                    {state.isSongPlaying && <AnimatedIcon mp3={album.preview_url} />}
                                                </motion.div>
                                            }


                                            <AnimatePresence>
                                                {state.hoveredImage === album.id &&
                                                    <motion.div
                                                        className={styles.bottomInfo}
                                                        data-image={album.images[1].url}
                                                        data-id={album.id}
                                                        onMouseEnter={(e) => {
                                                            dispatch({ type: ACTIONS.SET_HOVERED_IMAGE, payload: e.target.dataset.id })
                                                        }}
                                                        onMouseLeave={() => {
                                                            dispatch({ type: ACTIONS.SET_HOVERED_IMAGE, payload: null })
                                                        }}
                                                        transition={{ duration: 0.2, delay: 0.5, ease: 'easeInOut' }}
                                                        // initial={{ opacity: state.isSongPlaying && image.mp3 === state.selectedMp3 || state.hoveredImage && image.mp3 === state.selectedMp3? 1 : 0, scaleY: 0, originY: 0 }}
                                                        initial={{ opacity: 0, scaleY: 0, originY: 0 }}
                                                        animate={{ opacity: state.hoveredImage === album.id ? 1 : 0, scaleY: state.hoveredImage === album.id ? 1 : 0, originY: 0 }}
                                                    >
                                                        <h2

                                                        >{album.name}</h2>
                                                        <h3>

                                                            {album.artists.map((artist, i, array) => {

                                                                return i + 1 !== array.length ?
                                                                    <div
                                                                        className={styles.artistWrapper}
                                                                        key={i}
                                                                    >

                                                                        {/* <a href={artist.external_urls.spotify} target='blank'> {artist.name} </a> <p> & </p> */}
                                                                        <a href={`/artists?name=${encodeURIComponent(artist.name)}`}> {artist.name} </a> <p> & </p>
                                                                    </div>



                                                                    : <a key={artist.id} href={`/artists?name=${encodeURIComponent(artist.name)}`}> {artist.name} </a>


                                                            })}
                                                        </h3>
                                                        <p >Release date: {album.release_date}</p>
                                                        <p >Number of tracks: {album.total_tracks}</p>
                                                        <div className={styles.favorites}>
                                                            <div
                                                                className={styles.plus}
                                                            ></div>
                                                            {session &&
                                                                <div
                                                                    className={state.userFavorites.some((song)=> song.songName === album.name) ? styles.favorited : styles.heart}
                                                                    data-name={album.name}
                                                                    data-id={album.id}
                                                                    onClick={(e)=>handleFavoriteClick(e, data, session, dispatch)}
                                                                ></div>
                                                            }
                                                        </div>

                                                    </motion.div>
                                                }
                                            </AnimatePresence>

                                            <AnimatePresence>
                                                {state.hoveredImage === album.id && 
                                                    <motion.div
                                                        className={styles.insetShadow}
                                                        initial={{ opacity: 0, scaleY: 0, originY: 0, height: 200 }}
                                                        transition={{ duration: 0.2, delay: 0.5 }}
                                                        animate={{ opacity: 1, scaleY: 1, height: '100%' }}
                                                        style={{boxShadow: ( session && state.userFavorites.some((song)=> song.songName === album.name)) ?'inset 0 0 20px 0 gold':'inset 0 0 20px 0 var(--accentBlue)'}}
                                                    >
                                                    </motion.div>
                                                }
                                            </AnimatePresence>
                                        </motion.div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </>
        )
    }
}