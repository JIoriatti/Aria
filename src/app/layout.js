'use client'
import './globals.css'
import ReducerProvider from 'utils/ReducerContext'

import { League_Spartan } from '@next/font/google'
import SongProvider, { useSongStateContext } from 'utils/SongContext'
import SongPlayerBar from '@/components/SongPlayerBar'
import { AnimatePresence } from 'framer-motion'
import { useStateContext, useDispatchContext } from 'utils/ReducerContext'
import { useState, useEffect } from 'react'

const font = League_Spartan({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  const state = useStateContext();
  const dispatch = useDispatchContext();

  const songState = useSongStateContext();


  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
      <SongProvider>
        <ReducerProvider >
          {/* <SongProvider> */}
            {children}
          {/* </SongProvider> */}
        </ReducerProvider>
        <SongPlayerBar font={font.className}/>
      </SongProvider>
      </body>
    </html>
  )
}
