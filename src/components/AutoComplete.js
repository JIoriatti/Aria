import { useEffect, useRef, useState } from 'react';
import styles from './AutoComplete.module.css'
import { useStateContext } from 'utils/ReducerContext';


export default function AutoComplete({artistInfo, searchResultsRef}){
    const [searchResult, setSearchResult] = useState(artistInfo?.name)

    useEffect(()=>{
        setSearchResult(artistInfo?.name)
    },[artistInfo])
    return (
        <>
        {searchResult && 
            <div
                className={styles.container}
                ref={searchResultsRef}
            >
                <a 
                    className={styles.result}
                    href={`/artists?name=${encodeURIComponent(searchResult)}`}
                >
                    {searchResult}
                </a>
            </div>
        }
        </>
    )
}