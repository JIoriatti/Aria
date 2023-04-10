'use client'
import { useEffect } from "react"

export default function HomePage(){
    //todo: make a homepage
    useEffect(()=>{
        document.location.replace('/artists?name=Jason%20Ross')
    },[])
    return(
        <div></div>
    )
}