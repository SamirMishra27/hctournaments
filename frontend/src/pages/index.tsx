import { Fragment, MutableRefObject, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'

import Header from '@/components/header'
import Footer from '@/components/footer'
import { DefaultMetaData } from '@/utils'

import botslogo from '../../public/assets/bots-logo.png'
import superlogo from '../../public/assets/superleague-logo.jpg'
import homeimage from '../../public/assets/home-image.jpg'

export default function HomePage() {
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
                    toggleClasses(entry.target, ['bottom-6'], ['-bottom-16', 'opacity-0'])

                    if (entry.target.id === 'section-1') {
                        toggleClasses(imageRefOne.current, ['top-0'], ['top-8', 'opacity-0'])
                    }
                    if (entry.target.id === 'section-2') {
                        toggleClasses(
                            imageRefTwo.current,
                            ['-top-0', 'md:-top-40'],
                            ['top-32', 'md:top-0', 'opacity-0']
                        )
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
            <Head>
                <title>{DefaultMetaData.OG_MAIN_TITLE}</title>
                <meta property="og:title" content={DefaultMetaData.OG_MAIN_TITLE} />
                <meta property="og:site_name" content={DefaultMetaData.OG_SITE_NAME} />

                <meta property="og:description" content={DefaultMetaData.OG_DESCRIPTION} />
                <meta name="description" content={DefaultMetaData.OG_DESCRIPTION} />

                <meta property="og:image:type" content="image/jpg" />
                <meta property="og:image" content={homeimage.src} />
                <meta property="og:image:alt" content={DefaultMetaData.OG_DESCRIPTION} />

                <meta property="twitter:description" content={DefaultMetaData.OG_DESCRIPTION} />
                <meta name="twitter:title" content={DefaultMetaData.OG_MAIN_TITLE} />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:image:src" content={homeimage.src} />
            </Head>
            <Header />
            <main className="w-full flex flex-col items-center justify-center">
                <section className="hero-section bg-page-primary w-full flex items-center justify-center h-[40rem]">
                    <div className="container max-w-[96rem] flex flex-col items-center justify-center space-y-10">
                        <div className="headline text-slate-50 font-extrabold text-center px-3 md:px-2">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl">
                                Taking Cricket Tournaments
                            </h1>
                            <h1 className="text-2xl sm:text-4xl -tracking-normal sm:tracking-widest font-medium md:font-extrabold">
                                to the next level
                            </h1>
                        </div>
                        <p className="text-slate-50 max-w-lg text-justify sm:text-center text-lg px-6 md:px-0">
                            See all the latest updates, schedule and results of official
                            <b> HandCricket Tournaments</b> at one place and stay up-to-date with
                            what is happening!
                        </p>
                    </div>
                </section>

                <section className="w-full flex items-center justify-center h-[40rem] bg-slate-800 relative overflow-hidden">
                    <Image
                        src={botslogo}
                        alt="icc trophy"
                        className="w-full lg:w-auto h-auto lg:h-[150%] z-0 absolute left-0 top-8 opacity-0 transition-all duration-700"
                        ref={imageRefOne}
                    />
                    <div className="w-full h-full absolute z-10 overlay-gradient-one" />
                    <div
                        className={
                            'container max-w-md text-slate-50 z-20 absolute -bottom-16 lg:right-6 text-center ' +
                            'opacity-0 transition-all duration-700 ease-out pr-3 pl-2 md:px-0'
                        }
                        ref={containerRefOne}
                        id="section-1">
                        <h1 className="font-bold text-2xl md:text-3xl text-right md:text-center">
                            BATTLE OF THE SERVERS
                        </h1>
                        <p className="text-lg text-right md:text-center">
                            {/* Season 12 is coming soon... */}
                            Season 12 is Ongoing!
                        </p>
                        <button
                            className={
                                'view-button w-48 h-12 my-6 uppercase text-base font-medium rounded-full ' +
                                'transition-all overflow-hidden relative hover:scale-105 float-right md:float-none'
                            }>
                            <div
                                className={
                                    'w-64 h-8 bg-slate-50 opacity-50 absolute top-[-2.75rem] left-[-1.5rem] ' +
                                    'rotate-[-5deg] transition-[top] duration-300 blur-md'
                                }
                            />
                            <Link
                                href="/bots"
                                className="w-full h-full flex items-center justify-center">
                                View Tournament
                            </Link>
                        </button>
                    </div>
                </section>

                <section className="w-full flex items-center justify-center h-[40rem] bg-slate-800 relative overflow-hidden">
                    <Image
                        src={superlogo}
                        alt="super league logo"
                        className="w-full lg:w-auto h-auto lg:h-[150%] z-0 absolute right-0 top-32 md:top-0 opacity-0 transition-all duration-700"
                        ref={imageRefTwo}
                    />
                    <div className="w-full h-full absolute z-10 overlay-gradient-two" />
                    <div
                        className={
                            'container max-w-lg text-slate-50 z-20 absolute -bottom-16 lg:left-6 text-center ' +
                            'opacity-0 transition-all duration-700 ease-out pl-3 pr-2 md:px-0'
                        }
                        ref={containerRefTwo}
                        id="section-2">
                        <h1 className="font-bold text-2xl md:text-3xl text-left md:text-center">
                            SUPER LEAGUE - HAND CRICKET
                        </h1>
                        <p className="text-lg text-left md:text-center">
                            Season 1 Champions 〉 Team Malgudi Capitals
                        </p>
                        <button
                            className={
                                'view-button w-48 h-12 my-6 uppercase text-base font-medium rounded-full ' +
                                'transition-all overflow-hidden relative hover:scale-105 float-left md:float-none'
                            }>
                            <div
                                className={
                                    'w-64 h-8 bg-slate-50 opacity-50 absolute top-[-2.75rem] left-[-1.5rem] ' +
                                    'rotate-[-5deg] transition-[top] duration-300 blur-md'
                                }
                            />
                            <Link
                                href="/superleague"
                                className="w-full h-full flex items-center justify-center">
                                View Tournament
                            </Link>
                        </button>
                    </div>
                </section>

                <section className="w-full flex items-center justify-center bg-soothing-blue">
                    <div className="my-16 text-slate-50 text-center flex flex-col items-center justify-evenly space-y-2 pl-3 pr-2 md:px-0">
                        <h3 className="font-bold text-3xl md:text-4xl">
                            What are you waiting for?
                        </h3>
                        <p className="w-[95%] md:w-[25rem] text-base md:text-lg">
                            Gather your friends, and participate in Hand Cricket tournaments, NOW!
                        </p>
                    </div>
                </section>
            </main>
            <Footer />
        </Fragment>
    )
}
