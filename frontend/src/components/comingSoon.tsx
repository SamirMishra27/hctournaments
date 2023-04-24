import { Fragment } from 'react'
import Image from 'next/image'

import Header from './header'
import Footer from './footer'
import sandclock from '../../public/assets/sandclock.svg'

export default function ComingSoonPage(props: {
    tournamentFullName: string
    season: string
    relativeDate: string
}) {
    const { tournamentFullName, season, relativeDate } = props

    return (
        <Fragment>
            <Header />
            <main className="w-full flex flex-col items-center justify-center bg-page-primary py-32">
                <section className="container max-w-[96rem] flex flex-col items-center justify-center py-7 text-center text-slate-50 px-2">
                    <h1 className="font-bold text-3xl xs:text-4xl md:text-5xl my-6">
                        {tournamentFullName}
                    </h1>
                    <h3 className="uppercase font-semibold text-xl xs:text-2xl my-6">
                        <span className="text-lime-100">{season}</span>
                        <span> Starts {relativeDate} </span>
                        <Image
                            src={sandclock}
                            alt="timer sand clock"
                            className="w-6 h-6 inline-block"
                        />
                    </h3>
                    <p className="text-base xs:text-lg md:text-xl">Check Back Later!</p>
                </section>
            </main>
            <Footer />
        </Fragment>
    )
}
