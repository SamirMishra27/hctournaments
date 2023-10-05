'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

import useDarkMode from '@/hooks/useDarkMode'
import { getDiscordUser, setCookies } from '@/serverActions'
import { DiscordUserPayload } from '@/types/payloads'

import { INVITE_BOT_LINK, pathAsId } from '../utils'

import logoGold from '@assets/trophy-gold.svg'
import moon from '@assets/moon.svg'
import sun from '@assets/sun.svg'
import discordLogo from '@assets/discord-logo.svg'

export default function Header(props: { isHomepage?: boolean; pathways: string[][] }) {
    const { isHomepage = false, pathways } = props

    const [discordUser, setDiscordUser] = useState<DiscordUserPayload | null>(null)
    const [darkMode, setDarkMode] = useDarkMode()

    const router = useRouter()
    const pathName = usePathname()

    useEffect(() => {
        getDiscordUser().then((response) => setDiscordUser(response[1]))
    }, [])

    function getAvatarUrl(discordUser: DiscordUserPayload) {
        const { id, avatar } = discordUser

        return `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`
    }

    function login() {
        setCookies({ name: 'REDIRECT_AFTER_LOGIN', value: pathName || '/' }).then(() =>
            router.push('/login')
        )
    }

    return (
        <header className=" w-screen h-24 md:h-20 bg-night-blue-primary flex items-center justify-evenly">
            <div className=" max-w-[96rem] w-full flex items-center justify-evenly space-x-2 md:space-x-6 px-2 md:px-6">
                {isHomepage ? (
                    <Link
                        href="/"
                        className=" w-full xs:w-auto h-full px-2 flex items-center justify-start flex-[3]">
                        <Image src={logoGold} alt="cricket trophy logo" className=" w-auto h-10" />
                        <span className=" hidden sm:contents text-xl md:text-2xl font-semibold text-slate-100 [text-shadow:1px_1px_1px_#000000]">
                            hctournaments
                        </span>
                    </Link>
                ) : (
                    <nav className=" w-full breadcrumbs flex-[3]">
                        <ul>
                            <li>
                                <Link
                                    href="/"
                                    className=" btn no-animation min-h-0 h-10 bg-transparent hover:bg-transparent active:bg-transparent text-sm border-none block hover:no-underline">
                                    <Image
                                        src={logoGold}
                                        alt="cricket trophy logo"
                                        className=" w-full h-full"
                                    />
                                </Link>
                            </li>
                            {pathways.map(([pathName, pathLink]) => (
                                <li key={pathAsId(pathName)} className=" !hidden md:flex">
                                    <Link
                                        href={pathLink}
                                        className={
                                            ' btn no-animation normal-case min-h-0 h-auto block border-none font-medium py-2 px-4 ' +
                                            'text-sm bg-transparent hover:bg-stone-50/75 active:bg-stone-50/90 ' +
                                            'text-dim-white hover:text-black active:text-black hover:no-underline'
                                        }>
                                        {pathName}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                )}
                <nav className=" hidden md:flex items-center justify-evenly gap-x-1 md:gap-x-4 px-1 md:px-4">
                    <Link
                        href="/tournaments"
                        className={
                            ' btn no-animation normal-case min-h-0 h-auto block border-none font-medium py-2 px-4 ' +
                            'text-sm bg-transparent hover:underline hover:bg-transparent active:bg-transparent ' +
                            'hover:no-underline text-dim-white'
                        }>
                        Tournaments
                    </Link>
                    <Link
                        href={INVITE_BOT_LINK}
                        target="_blank"
                        className={
                            ' btn no-animation normal-case min-h-0 h-auto block border-none font-medium py-2 px-4 ' +
                            'text-sm bg-transparent hover:underline hover:bg-transparent active:bg-transparent ' +
                            'hover:no-underline text-dim-white'
                        }>
                        Invite Bot
                    </Link>
                </nav>
                {discordUser ? (
                    <div className=" flex items-center justify-evenly px-2 gap-x-2">
                        <h3 className=" text-sm md:text-lg text-dim-white font-semibold">
                            {discordUser.username}
                        </h3>
                        <figure className=" relative">
                            <Image
                                src={getAvatarUrl(discordUser)}
                                alt="Discord user avatar"
                                className=" rounded-full object-cover w-8 md:w-12 h-8 md:h-12"
                                quality={100}
                                width={1024}
                                height={1024}
                            />
                        </figure>
                    </div>
                ) : (
                    <button
                        className={
                            ' btn no-animation min-h-0 h-auto bg-transparent hover:bg-transparent' +
                            ' flex items-center justify-center p-1.5 md:p-2 rounded-md' +
                            ' bg-night-blue-primary glass'
                        }
                        onClick={() => login()}>
                        <figure className=" relative">
                            <Image
                                src={discordLogo}
                                alt="Discord logo login"
                                className=" object-cover w-auto h-5 md:h-6"
                                quality={100}
                                width={128}
                                height={97.012}
                            />
                        </figure>
                    </button>
                )}
                <button
                    className={
                        ' btn no-animation min-h-0 h-auto bg-transparent hover:bg-transparent' +
                        ' flex items-center justify-center p-1 rounded-md' +
                        ' bg-night-blue-primary glass'
                    }
                    onClick={setDarkMode.toggle}>
                    <Image
                        src={darkMode === 'dark' ? moon : sun}
                        alt={darkMode === 'dark' ? 'Moon' : 'Sun'}
                        className=" w-6 h-6 md:w-8 md:h-8"
                        quality={100}
                        width={512}
                        height={512}
                    />
                </button>
            </div>
        </header>
    )
}
