import { Fragment, MutableRefObject, useEffect, useRef } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import hclogo from '../../public/assets/handcricket.png'
import botslogo from '../../public/assets/bots-logo.png'
import superlogo from '../../public/assets/superleague-logo.jpg'

import { INVITE_BOT_LINK, HCL_SERVER_LINK, BOTS_SERVER_LINK } from '../utils'

export default function Home() {
    const imageRefOne = useRef() as MutableRefObject<HTMLImageElement>
    const imageRefTwo = useRef() as MutableRefObject<HTMLImageElement>
    const containerRefOne = useRef() as MutableRefObject<HTMLDivElement>
    const containerRefTwo = useRef() as MutableRefObject<HTMLDivElement>

    function toggleClasses(element: Element, add: string[], remove: string[]) {
        for (const className of add) element.classList.add(className)
        for (const className of remove) element.classList.remove(className)
    }

    useEffect(() => {
        const observer = new IntersectionObserver((entries) =>
            entries.forEach((entry) => {
                if (entry.isIntersecting && !entry.target.classList.contains('bottom-6')) {
                    toggleClasses(entry.target, ['bottom-6'], ['bottom-[-4rem]', 'opacity-0'])

                    if (entry.target.id === 'section-1') {
                        toggleClasses(imageRefOne.current, ['top-0'], ['top-8', 'opacity-0'])
                    }
                    if (entry.target.id === 'section-2') {
                        toggleClasses(imageRefTwo.current, ['top-[-10rem]'], ['top-0', 'opacity-0'])
                    }
                }
            })
        )
        observer.observe(containerRefOne.current)
        observer.observe(containerRefTwo.current)

        return () => observer.disconnect()
    })

    return (
        <Fragment>
            <header className="w-full h-20 bg-gradient-to-br from-slate-800 to-[#18122B] flex items-center justify-center">
                <div className="container max-w-[96rem] h-[95%] flex items-center justify-between px-4">
                    <Link href="/" className="logo h-full px-2 flex items-center justify-center">
                        <Image src={hclogo} alt="hand cricket" className="logo-img h-3/5 w-auto" />
                        <span className="logo-text text-3xl font-semibold text-slate-50 [text-shadow:1px_1px_1px_#000000]">
                            hctournaments
                        </span>
                    </Link>
                    <nav className="nav-links h-full flex items-center justify-evenly px-4 space-x-4">
                        <button
                            className={
                                'w-28 h-10 bg-[#19376D] rounded-xl text-white transition-colors ' +
                                'hover:bg-[#224587] active:bg-[#19376D]'
                            }>
                            <Link href={INVITE_BOT_LINK} target="_blank" className="w-full h-full">
                                Invite Bot
                            </Link>
                        </button>
                        <button
                            className={
                                'h-10 bg-[#19376D] rounded-xl text-white transition-colors ' +
                                'hover:bg-[#224587] active:bg-[#19376D] px-3'
                            }>
                            <Link href={HCL_SERVER_LINK} target="_blank" className="w-full h-full">
                                Super League
                            </Link>
                        </button>
                        <button
                            className={
                                'w-28 h-10 bg-[#19376D] rounded-xl text-white transition-colors ' +
                                'hover:bg-[#224587] active:bg-[#19376D]'
                            }>
                            <Link href={BOTS_SERVER_LINK} target="_blank" className="w-full h-full">
                                BOTS
                            </Link>
                        </button>
                    </nav>
                </div>
            </header>
            <main className="w-full flex flex-col items-center justify-center">
                <section className="hero-section w-full flex items-center justify-center h-[40rem]">
                    <div className="container max-w-[96rem] flex flex-col items-center justify-center space-y-10">
                        <div className="headline text-slate-50 font-extrabold text-center">
                            <h1 className="text-6xl">Taking Cricket Tournaments</h1>
                            <h1 className="text-4xl tracking-widest">to the next level</h1>
                        </div>
                        <p className="text-slate-50 max-w-lg text-center text-lg">
                            See all the latest updates, schedule and results of official
                            <b>HandCricket Tournaments</b> at one place and stay up-to-date with
                            what is happening!
                        </p>
                    </div>
                </section>

                <section className="w-full flex items-center justify-center h-[40rem] bg-slate-800 relative overflow-hidden">
                    <Image
                        src={botslogo}
                        alt="icc trophy"
                        className="w-auto h-[150%] z-0 absolute left-0 top-8 opacity-0 transition-all duration-700"
                        ref={imageRefOne}
                    />
                    <div className="w-full h-full absolute z-10 overlay-gradient-one" />
                    <div
                        className={
                            'container max-w-md text-slate-50 z-20 absolute bottom-[-4rem] right-6 text-center ' +
                            'opacity-0 transition-all duration-700 ease-out'
                        }
                        ref={containerRefOne}
                        id="section-1">
                        <h1 className="font-bold text-3xl">BATTLE OF THE SERVERS</h1>
                        <p className="text-lg">Season 12 is coming soon...</p>
                        <button
                            className={
                                'view-button w-48 h-12 my-6 p-1 uppercase text-base font-medium rounded-full ' +
                                'transition-all overflow-hidden relative hover:scale-105'
                            }>
                            <div
                                className={
                                    'w-64 h-8 bg-slate-50 opacity-50 absolute top-[-2.75rem] left-[-1.5rem] ' +
                                    'rotate-[-5deg] transition-[top] duration-300 blur-md'
                                }
                            />
                            <p>View Tournament</p>
                        </button>
                    </div>
                </section>

                <section className="w-full flex items-center justify-center h-[40rem] bg-slate-800 relative overflow-hidden">
                    <Image
                        src={superlogo}
                        alt="super league logo"
                        className="w-auto h-[150%] z-0 absolute right-0 top-0 opacity-0 transition-all duration-700"
                        ref={imageRefTwo}
                    />
                    <div className="w-full h-full absolute z-10 overlay-gradient-two" />
                    <div
                        className={
                            'container max-w-lg text-slate-50 z-20 absolute bottom-[-4rem] left-6 text-center ' +
                            'opacity-0 transition-all duration-700 ease-out'
                        }
                        ref={containerRefTwo}
                        id="section-2">
                        <h1 className="font-bold text-3xl">SUPER LEAGUE - HAND CRICKET</h1>
                        <p className="text-lg">Season 1 Champions 〉 Team Malgudi Capitals</p>
                        <button
                            className={
                                'view-button w-48 h-12 my-6 p-1 uppercase text-base font-medium rounded-full ' +
                                'transition-all overflow-hidden relative hover:scale-105'
                            }>
                            <div
                                className={
                                    'w-64 h-8 bg-slate-50 opacity-50 absolute top-[-2.75rem] left-[-1.5rem] ' +
                                    'rotate-[-5deg] transition-[top] duration-300 blur-md'
                                }
                            />
                            <p>View Tournament</p>
                        </button>
                    </div>
                </section>

                <section className="w-full flex items-center justify-center bg-soothing-blue">
                    <div className="my-16 text-slate-50 text-center flex flex-col items-center justify-evenly">
                        <h3 className="font-bold text-4xl">What are you waiting for?</h3>
                        <p className="w-[25rem] text-lg">
                            Gather your friends, and participate in Hand Cricket tournaments, NOW!
                        </p>
                    </div>
                </section>
            </main>
            <footer className="footer w-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-[#18122B]">
                <div className="container w-2/4 my-20 flex flex-col items-center justify-evenly text-center">
                    <nav className="w-full flex items-center justify-evenly px-6 text-slate-400 text-lg my-6">
                        <Link
                            href={INVITE_BOT_LINK}
                            className="hover:text-slate-300 active:text-slate-400"
                            target="_blank">
                            Invite HandCricket Bot
                        </Link>
                        <Link
                            href={BOTS_SERVER_LINK}
                            className="hover:text-slate-300 active:text-slate-400"
                            target="_blank">
                            BOTS Server
                        </Link>
                        <Link
                            href={HCL_SERVER_LINK}
                            className="hover:text-slate-300 active:text-slate-400"
                            target="_blank">
                            HandCricket Lounge
                        </Link>
                    </nav>
                    <p className="copyright text-slate-200 my-6">© SamirMishra27</p>
                </div>
            </footer>
        </Fragment>
    )
}
