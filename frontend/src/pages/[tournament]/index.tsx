import { Fragment, MouseEvent } from 'react'
import { GetStaticProps, GetStaticPaths } from 'next'

import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'

import Header from '@/components/header'
import Footer from '@/components/footer'

import { getTournamentInfoData } from '@/api'
import { Params, TournamentInfo } from '@/types'
import { DefaultMetaData } from '@/utils'

import sandclock from '../../../public/assets/sandclock.svg'
import avatar from '../../../public/assets/avatar.png'

export default function TournamentPage(props: {
    tournament: string
    tournamentInfo: TournamentInfo
    embedImageUrl: string
}) {
    const { tournament, tournamentInfo, embedImageUrl } = props
    const metaTitle = `${tournamentInfo.tournament_full_name} | ${DefaultMetaData.OG_MAIN_TITLE}`

    const rtf = new Intl.RelativeTimeFormat('en', { style: 'short' })
    const parsedDate = new Date(tournamentInfo.start_date)

    const currentTimeDiff = parsedDate.getTime() - Date.now()
    const relativeDate = rtf.format(Math.floor(currentTimeDiff / 1000 / 60 / 60 / 24), 'day')

    function copyMentionToClipboard(event: MouseEvent<HTMLSpanElement>) {
        if (!(event.target instanceof HTMLElement)) return
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        navigator.clipboard.writeText(event.target.dataset.mention!)
    }

    return (
        <Fragment>
            <Head>
                <title className="capitalize">{metaTitle}</title>
                <meta property="og:title" content={metaTitle} />
                <meta property="og:site_name" content={DefaultMetaData.OG_SITE_NAME} />

                <meta property="og:description" content={DefaultMetaData.OG_DESCRIPTION} />
                <meta name="description" content={DefaultMetaData.OG_DESCRIPTION} />

                <meta property="og:image:type" content="image/jpg" />
                <meta property="og:image" content={embedImageUrl} />
                <meta property="og:image:alt" content={DefaultMetaData.OG_DESCRIPTION} />

                <meta property="twitter:description" content={DefaultMetaData.OG_DESCRIPTION} />
                <meta name="twitter:title" content={metaTitle} />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:image:src" content={embedImageUrl} />
            </Head>
            <Header />
            <main className="w-full flex flex-col items-center justify-center bg-page-primary">
                <section className="container max-w-[96rem] flex flex-col items-center justify-center py-7 my-5 px-3">
                    <h1 className="text-slate-50 font-bold text-3xl xs:text-4xl md:text-5xl my-3 text-center">
                        {tournamentInfo.tournament_full_name}
                    </h1>
                    <h3 className="text-slate-50 uppercase font-semibold text-2xl xs:text-3xl md:text-4xl my-3">
                        {tournamentInfo.season}
                    </h3>
                </section>
                <hr className="w-4/5 xl:w-[80rem] border-slate-400" />

                <section className="container max-w-[96rem] flex flex-col items-center justify-center py-7 my-5 space-y-16 text-center text-slate-50">
                    <Image
                        src={tournamentInfo.banner_link}
                        width={512}
                        height={512}
                        alt="icc trophy"
                        quality={100}
                        className="w-[90%] sm:w-auto"
                    />
                    {currentTimeDiff > 0 ? (
                        <div className="text-3xl font-bold flex items-center justify-evenly space-x-2">
                            <p>{`Season starts ${relativeDate}`}</p>
                            <Image src={sandclock} alt="timer sand clock" className="w-6 h-6" />
                        </div>
                    ) : (
                        <p className="text-3xl font-bold">Season In Progress</p>
                    )}

                    <hr className="w-4/5 xl:w-[80rem] border-slate-400" />

                    <div className="w-full max-w-3xl grid grid-rows-[auto] grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-24">
                        <div className="flex flex-col items-center justify-evenly px-4 font-semibold">
                            <p className="mb-3 font-bold text-5xl xs:text-6xl">
                                {tournamentInfo.participants}
                            </p>
                            <p className="text-xl">Participants</p>
                            <p className="text-base">Registered</p>
                        </div>
                        <div className="flex flex-col items-center justify-evenly px-4 font-semibold">
                            <p className="mb-3 font-bold text-5xl xs:text-6xl">
                                {tournamentInfo.total_teams}
                            </p>
                            <p className="text-xl">Teams</p>
                            <p className="text-base">Clash</p>
                        </div>
                        <div className="flex flex-col items-center justify-evenly px-4 font-semibold">
                            <p className="mb-3 font-bold text-5xl xs:text-6xl">
                                {tournamentInfo.total_matches}
                            </p>
                            <p className="text-xl">Total</p>
                            <p className="text-base">Matches</p>
                        </div>
                        <div className="flex flex-col items-center justify-evenly px-4 font-semibold">
                            <p className="mb-3 font-bold text-5xl xs:text-6xl">
                                {tournamentInfo.matches_done}
                            </p>
                            <p className="text-xl">Matches</p>
                            <p className="text-base">Finished</p>
                        </div>
                    </div>

                    <h1 className="text-3xl xs:text-4xl font-bold">Group Standings</h1>
                    <div
                        className={
                            'w-11/12 sm:w-auto flex flex-wrap sm:flex-nowrap items-center justify-evenly px-4 py-2 ' +
                            'sm:space-x-6 bg-white/10 rounded-xl backdrop-blur gap-x-2'
                        }>
                        {tournamentInfo.groups.map((group) => (
                            <button
                                className={
                                    'bg-gradient-to-br from-[#D47120] to-[#B63A1F] font-semibold ' +
                                    'w-28 h-12 my-4 rounded-lg text-center text-slate-50 ' +
                                    'hover:from-[#FD841F] hover:to-[#E14D2A] active:from-[#D47120] active:to-[#B63A1F] ' +
                                    'disabled:from-slate-300 disabled:to-slate-500'
                                }
                                id={group.id}>
                                <Link
                                    href={'/' + tournament + '/standings/' + group.id}
                                    className="w-full h-full uppercase flex items-center justify-center">
                                    {group.name}
                                </Link>
                            </button>
                        ))}
                    </div>

                    <div className="space-y-3">
                        <h1 className="text-3xl xs:text-4xl font-bold max-w-xl">Event Hosts</h1>
                        <p className="px-8 sm:px-2 text-justify sm:text-center">
                            Quick glance at those who make {tournamentInfo.tournament_full_name}
                            &nbsp;possible!
                        </p>
                    </div>
                    <div
                        className={
                            'max-w-3xl flex flex-col sm:flex-row items-center justify-evenly p-2 sm:p-6 ' +
                            'sm:space-x-8 space-y-4 sm:space-y-0'
                        }>
                        {tournamentInfo.host.map((host) => (
                            <div className="inline-block px-4 py-6 sm:p-10 bg-white/5 backdrop-blur-sm rounded-2xl">
                                <div className="flex items-center justify-start p-2 pl-0 space-x-4 my-4">
                                    <Image
                                        src={avatar}
                                        alt="user avatar"
                                        className="w-8 sm:w-12 h-auto sm:h-12"
                                    />
                                    <h3 className="text-2xl xs:text-3xl sm:text-5xl font-medium">
                                        {host.name}
                                    </h3>
                                </div>
                                <p className="text-sm xs:text-base my-4">
                                    <span>Discord Mention: </span>
                                    <span
                                        className="p-1 bg-fuchsia-800/50 rounded-md cursor-pointer"
                                        data-mention={host.mention}
                                        onClick={copyMentionToClipboard}>
                                        {host.mention}
                                    </span>
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="pl-3 pr-2 sm:px-0 text-left xs:text-center">
                        <h1 className="text-3xl sm:text-4xl font-bold my-3">
                            What are you waiting for?
                        </h1>
                        <p>
                            Join the Server right now to participate in&nbsp;
                            {tournamentInfo.tournament_full_name}!
                        </p>
                        <p>Be a part of our new vibe of Cricket! 🏏</p>
                    </div>
                    <button
                        className={
                            'bg-gradient-to-br from-[#19376D] to-[#0B2447] font-semibold ' +
                            'w-3/4 sm:w-[22rem] h-[3.6rem] my-4 rounded-lg text-center text-slate-50 ' +
                            'hover:from-[#29519a] hover:to-[#13396d] active:to-[#0B2447] ' +
                            'active:from-[#19376D] disabled:from-slate-300 disabled:to-slate-500 ' +
                            'rounded-3xl overflow-hidden'
                        }>
                        <Link
                            href={tournamentInfo.server_link}
                            className="w-full h-full text-base xs:text-xl flex items-center justify-center"
                            target="_blank">
                            Tournament Server
                        </Link>
                    </button>
                </section>
            </main>
            <Footer />
        </Fragment>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {
    const { tournament } = context.params as Params
    const tournamentInfoData = await getTournamentInfoData(tournament)
    if (!tournamentInfoData) {
        return {
            notFound: true,
            revalidate: 60 * 60 * 6
        }
    }

    const tournamentInfo = tournamentInfoData.data as TournamentInfo
    const embedImageUrl = tournamentInfoData.cloudinary_url

    return {
        props: {
            tournament: tournament,
            tournamentInfo: tournamentInfo,
            embedImageUrl: embedImageUrl
        },
        revalidate: 60 * 60 * 6
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [{ params: { tournament: 'bots' } }, { params: { tournament: 'superleague' } }],
        fallback: 'blocking'
    }
}
