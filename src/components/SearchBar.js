import styles from './SearchBar.module.css'
import {motion, AnimatePresence} from 'framer-motion'
import { useStateContext, useDispatchContext } from 'utils/ReducerContext';
import { ACTIONS } from 'utils/actions';
import useDebounce from 'utils/useDebounce';
import { getAccessToken, getArtistId, getArtistInfo } from 'lib/getArtistData';
import { useState, useEffect, useRef, useCallback } from 'react';
import AutoComplete from './AutoComplete';


export default function SearchBar () {
    const state = useStateContext();
    const dispatch = useDispatchContext();
    const [searchResult, setSearchResult] = useState('');
    const token = useRef();
    const artistId = useRef();
    const [artistInfo, setArtistInfo] = useState(null);
    const debouncedSearch = useDebounce(state.searchInput, 500);

    const searchResultsRef = useRef();
   
    
    const fetchUserInput = useCallback(async (userInput) =>{
        try{
            token.current = await getAccessToken();
            artistId.current = await getArtistId(token.current, userInput)
            const artistData = await getArtistInfo(token.current, artistId.current)
            setArtistInfo(artistData);
        }catch(err){
            console.log(err)
        }
    },[])   

    useEffect(()=>{
        if(debouncedSearch){
            fetchUserInput(debouncedSearch);
        }
    },[debouncedSearch])




    return( 
        <>
            <div className={styles.container}>
                <AnimatePresence>
                    {state.isSearchExpanded && 
                        <motion.div 
                        className={styles.searchWrapper}
                        initial={{scaleX: 0, originX: 1}}
                        animate={{scaleX: 1, originX: 1}}
                        transition={{duration: 0.2}}
                        >
                            <input
                                type="search"
                                id='searchInput'
                                className={styles.searchInput}
                                placeholder='Search Artists'
                                autoFocus={true}
                                autoComplete='off'
                                onBlur={()=> {
                                    if(!state.searchInput){
                                        dispatch({type: ACTIONS.IS_SEARCH_EXPANDED})
                                        dispatch({type: ACTIONS.SEARCH_INPUT, payload: ''})
                                        dispatch({type: ACTIONS.IS_NO_SEARCH_RESULT, payload: false})
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Escape') {
                                        e.preventDefault();
                                    }
                                }}
                                onKeyUp={(e)=>{
                                    if(e.key === 'Enter'){
                                        console.log('working')
                                        if(searchResultsRef.current){
                                            document.location.replace(`/artists?name=${artistInfo.name}`)
                                        }
                                    }
                                }}
                                onChange={(e) => {
                                    dispatch({type: ACTIONS.SEARCH_INPUT, payload: e.target.value})
                                }}
                                value={state.searchInput}
                            />
                            <div
                                className={styles.searchBarIcon2}
                            >
                            </div>
                            <AutoComplete artistInfo={artistInfo} searchResultsRef={searchResultsRef}/>
                        </motion.div>
                    }
                
                {!state.isSearchExpanded && 
                    <button
                        className={styles.searchBarIconContainer}
                        title='Search'
                        type='submit'
                        onClick={()=> 
                            dispatch({type: ACTIONS.IS_SEARCH_EXPANDED})
                        }
                    >
                        <div
                            className={styles.searchBarIcon}
                        >
                        </div>
                    </button>
                }
                </AnimatePresence>

            </div>
        </>    
    )
}