
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { RecoilRoot } from 'recoil'

import Sidebar from '../components/Sidebar'
import Player from '../components/Player'

import { APP_TITLE } from '../constants/constants'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../styles/globals.css'

function MyApp({ Component, pageProps: {session, ...pageProps} }: AppProps) {

    const router = useRouter()

    return router.pathname !== "/login" 
    ? (
        <SessionProvider session={session}>
            <RecoilRoot>  
                <Head>
                    <title>{ APP_TITLE }</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>                
                <div className='bg-black h-screen overflow-hidden'>
                    <main className='flex'>
                        <Sidebar />
                        <Component {...pageProps} />
                    </main>

                    <div className="sticky bottom-0">
                        <Player />
                    </div>    
                </div>
                <ToastContainer />
            </RecoilRoot>
        </SessionProvider> 
    ) 
    : 
    (
        <SessionProvider session={session}>
            <RecoilRoot>  
                <Head>
                    <title></title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>                
                <Component {...pageProps} />
                <ToastContainer />
            </RecoilRoot>
        </SessionProvider>        
    )
}

export default MyApp
