'use client'

import { HostState, TournamentState } from '@/types/states'
import Image from 'next/image'
import Link from 'next/link'
import { useClipboard } from '@chakra-ui/react'
import { getRelativeTimeFrom } from '@/utils'
import PlainDivider from '@/components/PlainDivider'

function TournamentStatistic(props: { number: number; noun: string; verb: string }) {
    return (
        <div className=" card flex flex-col items-center justify-evenly uppercase text-black font-semibold p-10 dark:text-slate-100 transition">
            <p className=" font-bold mb-3 text-3xl xs:text-5xl sm:text-6xl">{props.number}</p>
            <p className=" text-lg xs:text-xl">{props.noun}</p>
            <p className=" text-sm xs:text-base">{props.verb}</p>
        </div>
    )
}

function HostCard(props: { host: HostState }) {
    const { value, hasCopied, onCopy } = useClipboard('@' + props.host.username)

    return (
        <div className=" card flex flex-col items-start justify-evenly px-6 py-12 gap-y-4 border-2 border-dim-white bg-gradient-to-br from-white via-dim-white to-white dark:from-dark-navy dark:via-bright-navy/50 dark:to-dark-navy dark:text-slate-100 dark:border-none dark:shadow-md dark:shadow-bright-navy transition">
            <div className=" flex items-center justify-start">
                <Image
                    src={props.host.avatarUrl}
                    alt="profile picture"
                    className=" rounded-full object-cover w-12 h-12 ring-slate-300 ring-1 dark:ring-black transition"
                    quality={100}
                    width={1024}
                    height={1024}
                />
                <p className=" font-semibold text-2xl ml-2">{props.host.name}</p>
            </div>
            <div>
                mention:
                <span
                    className={
                        ' cursor-pointer p-1 rounded-md ml-2 transition-colors' +
                        (hasCopied ? ' bg-green-400/75' : ' bg-orange-gold/75')
                    }
                    onClick={onCopy}>
                    {hasCopied ? 'Copied!' : '@' + props.host.username}
                </span>
            </div>
        </div>
    )
}

export default function TournamentOverviewPage(props: {
    tournament: TournamentState
    hosts: HostState[]
}) {
    const { tournament, hosts } = props

    const keyMetrics: [number, string, string][] = [
        [tournament.participants, 'Participants', 'Registered'],
        [tournament.totalTeams, 'Teams', 'Clash'],
        [tournament.totalMatches, 'Total', 'Matches'],
        [tournament.matchesDone, 'Matches', 'Finished']
    ]

    function getTournamentStatusText() {
        switch (tournament.stage) {
            case 'UPCOMING': {
                const relativeTime = getRelativeTimeFrom(tournament.startDate)

                return `Season starts in ${relativeTime}`
            }
            case 'REGISTRATION':
                return 'Registrations have opened! Register your team now'
            case 'ONGOING':
                return 'Season in progress 🔥'
            case 'KNOCKOUTS':
                return 'Knockouts are in progress! It is do or die for teams'
            case 'CONCLUDED':
                return 'Season is over!'
        }
    }

    const statusText = getTournamentStatusText()

    return (
        <main className=" w-full flex flex-col items-center justify-center bg-white text-black py-10 dark:bg-dark-navy dark:text-slate-100 transition">
            <section className=" max-w-[120rem] flex flex-col items-center justify-evenly">
                <h1 className=" uppercase font-bold text-3xl xs:text-4xl md:text-5xl my-3 text-center">
                    {tournament.tournamentName}
                </h1>
                <h3 className=" uppercase font-medium text-2xl xs:text-3xl md:text-4xl my-3">
                    Season {tournament.seasonNo}
                </h3>
            </section>
            <PlainDivider />

            <section className=" max-w-[120rem] flex flex-col items-center justify-evenly px-2 py-2 my-8 gap-y-16 text-center">
                <figure>
                    <Image
                        src={tournament.bannerLink}
                        width={2048}
                        height={2048}
                        alt={tournament.tournamentName + ' banner'}
                        quality={100}
                        className=" object-cover w-96 h-96"
                        priority={true}
                    />
                </figure>
                <h3 className=" text-2xl font-semibold">{statusText}</h3>
            </section>
            <PlainDivider />

            <section className=" max-w-[120rem] flex flex-col items-center justify-evenly py-2 my-8 gap-y-16 text-center">
                <div className=" grid grid-rows-[auto] grid-cols-1 sm:grid-cols-2 gap-x-56 gap-y-12 sm:gap-y-20 md:gap-y-28">
                    {keyMetrics.map((metric, index) => (
                        <TournamentStatistic
                            number={metric[0]}
                            noun={metric[1]}
                            verb={metric[2]}
                            key={'metric-' + index}
                        />
                    ))}
                </div>

                <div className=" w-full flex flex-col items-center justify-evenly gap-y-16">
                    <h1 className="text-3xl xs:text-4xl font-bold px-2">
                        Upcoming Matches And Results
                    </h1>
                    <button
                        className={
                            ' btn no-animation min-h-0 rounded-md text-center text-white text-lg p-0 border-none' +
                            ' bg-gradient-to-br from-orange-gold/80 to-orange-gold' +
                            ' hover:from-orange-gold/70 hover:to-orange-gold/90' +
                            ' shadow-sm hover:shadow-md dark:text-black transition'
                        }>
                        <Link
                            href={`/${tournament.slugName}/${tournament.seasonNo}/matches`}
                            className=" w-full h-full uppercase flex items-center justify-center px-14 py-5">
                            See The Schedule
                        </Link>
                    </button>
                </div>

                <div className=" w-full flex flex-col items-center justify-evenly gap-y-16">
                    <h1 className="text-3xl xs:text-4xl font-bold px-2">Top Performing Players</h1>
                    <button
                        className={
                            ' btn no-animation min-h-0 rounded-md text-center text-white text-lg p-0 border-none' +
                            ' bg-gradient-to-br from-orange-gold/80 to-orange-gold' +
                            ' hover:from-orange-gold/70 hover:to-orange-gold/90' +
                            ' shadow-sm hover:shadow-md dark:text-black transition'
                        }>
                        <Link
                            href={`/${tournament.slugName}/${tournament.seasonNo}/playerstats`}
                            className=" w-full h-full uppercase flex items-center justify-center px-14 py-5">
                            See The Players
                        </Link>
                    </button>
                </div>

                <div className=" w-full flex flex-col items-center justify-evenly gap-y-16">
                    <div>
                        <h1 className="text-3xl xs:text-4xl font-bold max-w-xl">Event Hosts</h1>
                        <p className="px-8 sm:px-2 text-justify sm:text-center text-[18px]">
                            Who Made This Season Of
                            <span className=" font-semibold"> {tournament.tournamentName} </span>
                            Possible!
                        </p>
                    </div>
                    <div className=" grid grid-rows-[auto] grid-cols-1 sm:grid-cols-2 gap-28">
                        {hosts.map((host) => (
                            <HostCard host={host} key={host.rowId} />
                        ))}
                    </div>
                </div>

                <div className=" w-full flex flex-col items-center justify-evenly gap-y-16 text-[18px]">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold my-3">
                            What are you waiting for?
                        </h1>
                        <p>
                            Join the Server right now to participate in
                            <span className=" font-semibold">
                                {' ' + tournament.tournamentName + '!'}
                            </span>
                        </p>
                        <p>Be a part of our new vibe of Cricket! 🏏</p>
                    </div>

                    <button
                        className={
                            ' btn no-animation min-h-0 rounded-md text-center text-white text-lg p-0 border-none' +
                            ' bg-gradient-to-br from-orange-gold/80 to-orange-gold' +
                            ' hover:from-orange-gold/70 hover:to-orange-gold/90' +
                            ' shadow-sm hover:shadow-md dark:text-black transition'
                        }>
                        <Link
                            href={tournament.serverLink}
                            target="_blank"
                            className=" w-full h-full uppercase flex items-center justify-center px-14 py-5">
                            Tournament Server
                        </Link>
                    </button>
                </div>
            </section>
        </main>
    )
}
