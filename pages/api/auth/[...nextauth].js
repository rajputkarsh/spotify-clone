import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify"

console.log(LOGIN_URL)

async function refreshAccessToken(token){
  try{
    spotifyApi.setAccessToken(token.accessToken)
    spotifyApi.setRefreshToken(token.refreshToken)

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken()

    console.log("New Refreshed Token : ", refreshedToken)

    return {
      ...token,
      accessToken       : refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in*1000,
      refreshToken      : refreshedToken.refresh_token ?? token.refreshToken
    }

  }
  catch(error){
    console.log(error)
    return {
      ...token,
      error: 'RefreshAccessTokenError'
    }
  }
}


export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId     : process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret : process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL,
      httpOptions: {
        timeout: 40000,
      },
    }),
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/login'
  },
  callbacks:{
    async jwt({ token, account, user }){

      // check for initial signin
      if(account && user){
        return {
          ...token,
          accessToken : account.access_token,
          refreshToken: account.refresh_token,
          username    : account.providerAccountId,
          accessTokenExpires: account.expires_at * 1000  // converted to ms
        }
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        return token
      }

      // Access token has expired, get new refreshed token
      return await refreshAccessToken(token)
    },
    async session({ session, token }){
      session.user.accessToken  = token.accessToken
      session.user.refreshToken = token.refreshToken
      session.user.username     = token.username

      return session
    }
  }
})