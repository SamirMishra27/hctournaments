'use server'

import { encrypt } from '@/utils'
import VerifyLoginPage from './verify-login'
import { redirect } from 'next/navigation'
import { revalidateTag } from 'next/cache'

export default async function Page(props: {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    if (props.searchParams.error || props.searchParams.error_description) redirect('/')

    const API_URL = 'https://discord.com/api/v10/oauth2/token'

    const response = await fetch(API_URL, {
        body: new URLSearchParams({
            client_id: process.env.CLIENT_ID as string,
            client_secret: process.env.CLIENT_SECRET as string,

            code: props.searchParams.code as string,
            scope: 'identify',

            grant_type: 'authorization_code',
            redirect_uri: process.env.OAUTH_REDIRECT_URI as string
        }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        method: 'POST'
    })

    revalidateTag('discord')
    const oauthData = await response.json()

    const accessToken = encrypt(oauthData.access_token)
    const expiresIn = oauthData.expires_in

    return <VerifyLoginPage accessToken={accessToken} expiresIn={expiresIn} />
}
