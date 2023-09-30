'use server'

import { DiscordUserPayload } from '@/types/payloads'
import { decrypt, seconds } from '@/utils'
import { cookies } from 'next/headers'
import { getAdminsData } from './api'
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'

/**
 * Gets discord user data if the user is currently logged in and an access token
 * is found in the cookies.
 * @returns Returns an array of 2 values:
 * - First is a `Boolean` indicating if user is still logged in or not
 * - Second is the data that was fetched from discord's API.
 * Will be `null` if first value is `false`
 */
export async function getDiscordUser(): Promise<[boolean, DiscordUserPayload | null]> {
    // Get access token from cookies
    const accessToken = cookies().get('D_ACCESS')
    if (!accessToken) return [false, null]

    // Get access token decrypted
    const accessTokenDec = decrypt(accessToken.value)

    // Make request to discord's API
    const response = await fetch('https://discord.com/api/v10/oauth2/@me', {
        headers: { Authorization: `Bearer ${accessTokenDec}` },
        next: { revalidate: seconds(600), tags: ['discord'] }
    })

    // If the request returned a 401 that means
    // The access token has expired or is invalid
    // Which means user is currently 'not logged in'
    // From their browser
    if (response.status > 210) return [false, null]

    const data = await response.json()

    return [true, data.user as DiscordUserPayload]
}

export async function isSiteAdmin(userId: string): Promise<boolean> {
    const admins = await getAdminsData()

    const matchingAdmin = admins.filter((admin) => admin.userId === userId)

    if (!matchingAdmin.length) return false
    else return true
}

export async function setCookies(options: ResponseCookie) {
    return cookies().set(options)
}

export async function getCookies(name: string): Promise<string | undefined> {
    const cookie = cookies().get(name)

    return cookie ? cookie.value : undefined
}
