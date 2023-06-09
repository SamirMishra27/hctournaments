import { Fragment } from 'react'
import { GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'

import { AxiosResponse, isAxiosError } from 'axios'

import Header from '@/components/header'
import Footer from '@/components/footer'
import ComingSoonPage from '@/components/comingSoon'

import { axiosApi, getTournamentInfoData } from '@/api'
import { ScheduleApiPayloadData, MatchInfo, Params } from '@/types'
import { DefaultMetaData, hasTournamentStarted } from '@/utils'

export default function SchedulePage(props: {
    tournamentFullName: string
    season: string
    tournamentStartDate: string
    serverLink: string
    embedImageUrl: string
    schedule: Array<MatchInfo>
    results: Array<MatchInfo>
}) {
    function textColor(teamARuns: number, teamBRuns: number) {
        if (teamARuns > teamBRuns) return 'text-green-100'
        else if (teamARuns < teamBRuns) return 'text-red-100'
        else return 'text-slate-200'
    }

    const { tournamentFullName, embedImageUrl } = props
    const metaTitle = `${tournamentFullName} | ${DefaultMetaData.OG_MAIN_TITLE}`
    const metaDescription = 'Upcoming matches, schedule and results for ' + tournamentFullName

    const [tournamentStarted, relativeDate] = hasTournamentStarted(props.tournamentStartDate)
    if (!tournamentStarted) {
        return (
            <ComingSoonPage
                tournamentFullName={tournamentFullName}
                season={props.season}
                relativeDate={relativeDate}
            />
        )
    }

    return (
        <Fragment>
            <Head>
                <title>{metaTitle}</title>
                <meta property="og:title" content={metaTitle} />
                <meta property="og:site_name" content={DefaultMetaData.OG_SITE_NAME} />

                <meta property="og:description" content={metaDescription} />
                <meta name="description" content={metaDescription} />

                <meta property="og:image:type" content="image/jpg" />
                <meta property="og:image" content={embedImageUrl} />
                <meta property="og:image:alt" content={metaDescription} />

                <meta property="twitter:description" content={metaDescription} />
                <meta name="twitter:title" content={metaTitle} />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:image:src" content={embedImageUrl} />
            </Head>
            <Header />
            <main className="w-full flex flex-col items-center justify-center bg-page-primary">
                <section className="container max-w-[96rem] flex flex-col items-center justify-center py-7 my-5 text-center">
                    <h1 className="text-slate-50 font-bold text-3xl xs:text-4xl md:text-5xl my-3 px-4">
                        {tournamentFullName}
                    </h1>
                    <h3 className="text-slate-50 uppercase font-semibold text-xl xs:text-2xl my-3 px-4">
                        <span className="text-lime-100">{props.season}</span>
                        <span> - SCHEDULE AND RESULTS</span>
                    </h3>
                </section>
                <hr className="w-4/5 xl:w-[80rem] border-slate-400" />

                <section className="container max-w-[96rem] flex flex-col items-center justify-center py-7 my-5">
                    <h3 className="text-slate-50 uppercase font-semibold text-2xl sm:text-3xl my-4">
                        Upcoming Matches
                    </h3>
                    <div
                        className={
                            'schedule-list w-[95%] lg:w-[50rem] flex flex-col items-center text-center text-base sm:text-lg ' +
                            'px-2 py-4 rounded-xl bg-gradient-to-br from-[#19376D] via-[#0B2447] to-[#19376D] ' +
                            'transition-colors border-4 border-solid border-[#21315B] text-slate-50 font-medium sm:font-semibold ' +
                            (props.schedule.length
                                ? 'h-[50rem] overflow-y-scroll '
                                : 'overflow-y-hidden ')
                        }>
                        {props.schedule.length ? (
                            props.schedule.map((match) => (
                                <div
                                    className="w-[95%] md:w-3/4 bg-bright-orange flex items-center justify-evenly rounded-xl px-3 py-3 my-2"
                                    key={match.MatchNo}>
                                    <p className="w-4 xs:w-6 text-sm xs:text-base">
                                        {match.MatchNo}.
                                    </p>
                                    <p
                                        className={
                                            'w-24 xs:w-32 sm:w-56 text-ellipsis ' +
                                            'break-words whitespace-nowrap sm:whitespace-normal overflow-x-hidden'
                                        }>
                                        {match.TeamAName}
                                    </p>
                                    <p className="w-4 sm:w-8 text-xs sm:text-base">VS</p>
                                    <p
                                        className={
                                            'w-24 xs:w-32 sm:w-56 text-ellipsis ' +
                                            'break-words whitespace-nowrap sm:whitespace-normal overflow-x-hidden'
                                        }>
                                        {match.TeamBName}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <h3 className="text-2xl my-4">
                                Looks like there are not any upcoming matches
                            </h3>
                        )}
                    </div>
                </section>
                <hr className="w-4/5 xl:w-[80rem] border-slate-400" />

                <section className="container max-w-[96rem] flex flex-col items-center justify-center py-7 mt-5 mb-24">
                    <h3 className="text-slate-50 uppercase font-semibold text-2xl sm:text-3xl my-4">
                        Results
                    </h3>
                    <div
                        className={
                            'schedule-list w-[95%] lg:w-[50rem] flex flex-col items-center text-center text-base sm:text-lg ' +
                            'px-2 py-4 rounded-xl bg-gradient-to-br from-[#19376D] via-[#0B2447] to-[#19376D] ' +
                            'transition-colors border-4 border-solid border-[#21315B] text-slate-50 font-medium sm:font-semibold ' +
                            (props.results.length
                                ? 'h-[50rem] overflow-y-scroll '
                                : 'overflow-y-hidden ')
                        }>
                        {props.results.length ? (
                            props.results.map((match) => (
                                <div
                                    className="w-[95%] md:w-3/4 bg-bright-orange flex items-center justify-evenly rounded-xl px-3 py-3 my-2"
                                    key={match.MatchNo}>
                                    <p className="w-4 xs:w-6 text-sm xs:text-base">
                                        {match.MatchNo}.
                                    </p>
                                    <div>
                                        <p
                                            className={
                                                'w-24 xs:w-32 sm:w-56 text-ellipsis ' +
                                                'break-words whitespace-nowrap sm:whitespace-normal overflow-x-hidden ' +
                                                textColor(match.TeamARuns, match.TeamBRuns)
                                            }>
                                            {match.TeamAName}
                                        </p>
                                        <div className="w-24 xs:w-32 sm:w-56 text-xs flex items-center justify-evenly">
                                            <p>
                                                {match.TeamARuns} / {match.TeamAWickets}
                                            </p>
                                            <p>{match.TeamAOvers} OVERS</p>
                                        </div>
                                    </div>
                                    <p className="w-4 sm:w-8 text-xs sm:text-base">VS</p>
                                    <div>
                                        <p
                                            className={
                                                'w-24 xs:w-32 sm:w-56 text-ellipsis ' +
                                                'break-words whitespace-nowrap sm:whitespace-normal overflow-x-hidden ' +
                                                textColor(match.TeamBRuns, match.TeamARuns)
                                            }>
                                            {match.TeamBName}
                                        </p>
                                        <div className="w-24 xs:w-32 sm:w-56 text-xs flex items-center justify-evenly">
                                            <p>
                                                {match.TeamBRuns} / {match.TeamBWickets}
                                            </p>
                                            <p>{match.TeamBOvers} OVERS</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <h3 className="text-2xl my-4">
                                No matches have finished yet! Check back later
                            </h3>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </Fragment>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {
    const REVALIDATE_TIME = 60 * 5
    const { tournament } = context.params as Params

    const tournamentInfoData = await getTournamentInfoData(tournament)
    if (!tournamentInfoData) {
        return {
            notFound: true,
            revalidate: REVALIDATE_TIME
        }
    }
    const { season, server_link, tournament_full_name, start_date } = tournamentInfoData.data

    let response: AxiosResponse | undefined
    try {
        response = await axiosApi.get('/schedule/' + tournament)
    } catch (error) {
        if (isAxiosError(error)) response = error.response
        else throw error
    }

    if (!response || response.status === 404 || !response.data.success) {
        return {
            notFound: true,
            revalidate: REVALIDATE_TIME
        }
    }
    const scheduleData = response.data as ScheduleApiPayloadData

    const embedImageUrl = scheduleData.cloudinary_url
    const scheduleAndResults = scheduleData.data

    return {
        props: {
            tournamentFullName: tournament_full_name,
            season: season,
            tournamentStartDate: start_date,
            serverLink: server_link,
            embedImageUrl: embedImageUrl,
            schedule: scheduleAndResults.filter((match) => !match.MatchStatus),
            results: scheduleAndResults.filter((match) => match.MatchStatus)
        },
        revalidate: REVALIDATE_TIME
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [{ params: { tournament: 'bots' } }, { params: { tournament: 'superleague' } }],
        fallback: 'blocking'
    }
}
