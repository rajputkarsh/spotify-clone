

import Playlist from '../components/Playlist'
import { getSession } from 'next-auth/react'

const PlaylistPage = () => {

    return (
        <Playlist />
    )
}

export default PlaylistPage


export async function getServerSideProps(context) {
    const session = await getSession(context)

    return {
        props: {
            session
        }
    }
}