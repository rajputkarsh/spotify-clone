import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { RecoilRoot } from 'recoil'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps: {session, ...pageProps} }: AppProps) {
    return <SessionProvider session={session}>
        <RecoilRoot>  
            <Component {...pageProps} />
            <ToastContainer />
        </RecoilRoot>
    </SessionProvider>
}

export default MyApp
