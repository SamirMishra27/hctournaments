'use client'

import Image from 'next/image'
import { TournamentState } from '@/types/states'
import { TournamentStage } from '@/types/constants'
import Link from 'next/link'
import { useState } from 'react'

function TournamentCard(props: { tournament: TournamentState }) {
    const { tournamentName, slugName, seasonNo, stage, bannerLink } = props.tournament
    const tournamentLink = `/${slugName}/${seasonNo}`

    function getStatusColour(stage: TournamentStage) {
        switch (stage) {
            case 'UPCOMING':
                return 'deepskyblue'
            case 'REGISTRATION':
                return 'orange'
            case 'ONGOING':
                return 'limegreen'
            case 'KNOCKOUTS':
                return 'crimson'
            case 'CONCLUDED':
                return 'cadetblue'
        }
    }

    return (
        <div className=" card w-full sm:w-96 h-36 bg-white shadow-md overflow-hidden dark:bg-bright-navy dark:shadow-slate-500 transition">
            <Link
                href={tournamentLink}
                className=" w-full h-full flex flex-row items-start justify-between uppercase p-4 gap-x-4">
                <div className=" h-full flex flex-col text-gray-800 dark:text-slate-100 transition">
                    <p className=" font-semibold text-xl">{tournamentName}</p>
                    <p className=" font-normal text-base">Season {seasonNo}</p>
                    <div className=" normal-case mt-6 flex items-center">
                        <span>Status: </span>
                        <span className=" mx-2">{stage}</span>
                        <span
                            className=" loading-pulse inline-block w-4 h-4 rounded-full mb-0.5"
                            style={{ backgroundColor: getStatusColour(stage) }}
                            data-stage={stage}
                        />
                    </div>
                </div>
                <figure className=" relative mb-2">
                    <Image
                        src={bannerLink}
                        alt={tournamentName + ' banner'}
                        className=" rounded-full object-cover w-12 h-12"
                        quality={100}
                        width={1024}
                        height={1024}
                    />
                </figure>
            </Link>
        </div>
    )
}

export default function TournamentsPage(props: {
    tournaments: TournamentState[]
    isAdmin: boolean
}) {
    const { tournaments, isAdmin } = props
    const [searchText, setSearchText] = useState('')

    function subTextOf(string: string, text: string): boolean {
        return string.toLowerCase().includes(text.toLowerCase().trim())
    }

    return (
        <main className=" w-full flex flex-col items-center justify-start bg-dim-white min-h-[100vh] dark:bg-dark-navy transition">
            <div className=" w-full sm:w-auto flex flex-col items-center justify-start pt-4">
                <section className=" w-full flex items-center justify-evenly px-3 sm:px-6 md:px-10 py-2 gap-x-2">
                    <input
                        type="text"
                        placeholder="Search for a Tournament"
                        className=" input w-full h-10 bg-white dark:bg-bright-navy dark:text-slate-100 dark:placeholder:text-gray-300 transition"
                        onChange={(e) => {
                            if (!e.currentTarget.value.length) setSearchText('')
                            if (!e.currentTarget.value.trim().length) return
                            setSearchText(e.currentTarget.value)
                        }}
                    />
                    {isAdmin && (
                        <button
                            className={
                                ' btn no-animation min-h-0 h-full rounded-lg text-center text-white p-0' +
                                ' bg-gradient-to-br from-orange-gold/80 to-orange-gold' +
                                ' hover:from-orange-gold/70 hover:to-orange-gold/90' +
                                ' shadow-sm hover:shadow-md overflow-hidden border-none' +
                                ' dark:text-black transition text-xs sm:text-base'
                            }>
                            <Link
                                href="/tournaments/create"
                                className=" w-full full flex items-center justify-center px-2 py-3">
                                Create New
                            </Link>
                        </button>
                    )}
                </section>
                <section
                    className={
                        ' w-full max-w-full 2xl:max-w-[96rem] grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' +
                        ' grid-rows-[auto] px-3 sm:px-6 md:px-10 py-10 gap-8'
                    }>
                    {tournaments
                        .filter(
                            (tournament) =>
                                subTextOf(tournament.tournamentName, searchText) ||
                                subTextOf(tournament.slugName, searchText)
                        )
                        .map((tournament) => (
                            <TournamentCard tournament={tournament} key={tournament.tournamentId} />
                        ))}
                </section>
            </div>
        </main>
    )
}
