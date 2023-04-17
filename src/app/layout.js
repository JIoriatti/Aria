'use client'
import './globals.css'
import ReducerProvider from 'utils/ReducerContext'

import { League_Spartan } from '@next/font/google'
import SongProvider, { useSongStateContext } from 'utils/SongContext'
import SongPlayerBar from '@/components/SongPlayerBar'
import { AnimatePresence } from 'framer-motion'
import { useStateContext, useDispatchContext } from 'utils/ReducerContext'
import { useState, useEffect } from 'react'
import SideBar from '@/components/SideBar'
import { SessionProvider } from 'next-auth/react'

const font = League_Spartan({ subsets: ['latin'] })

export default function RootLayout({ children, session }) {
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
        <SessionProvider session={session}>
          <SongProvider>
            <ReducerProvider >
              <SideBar font={font.className}/>
                {children}
            </ReducerProvider>
            <SongPlayerBar font={font.className}/>
          </SongProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
