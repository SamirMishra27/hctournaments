'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { seconds } from '@/utils'
import { getCookies, setCookies } from '@/serverActions'

export default function VerifyLoginPage(props: { accessToken: string; expiresIn: number }) {
    const { accessToken, expiresIn } = props
    const router = useRouter()

    useEffect(() => {
        const expiresTimestamp = new Date().getTime() + seconds(expiresIn)

        setCookies({ name: 'D_ACCESS', value: accessToken, expires: expiresTimestamp })
            .then(() => {
                setCookies({
                    name: 'D_EXPIRES',
                    value: expiresTimestamp.toString(),
                    expires: expiresTimestamp
                })
            })
            .then(() => getCookies('REDIRECT_AFTER_LOGIN'))
            .then((redirect) => router.push(redirect || '/'))
    }, [])

    return (
        <div className=" w-full h-screen bg-full-white flex items-center justify-center space-x-2">
            <h1 className=" text-2xl font-medium text-black text-center">Redirecting</h1>
            <div className=" loading loading-spinner loading-md" />
        </div>
    )
}
