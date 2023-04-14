// import { useRouter } from 'next/router'
import { Fragment } from 'react'

import Header from '@/components/header'
import Footer from '@/components/footer'
import { axiosApi } from '@/api'
import { GetStaticPaths, GetStaticProps } from 'next'
import { ParsedUrlQuery } from 'querystring'

export default function statsPage(props: {
    tournamentFullName: string
    season: string
    serverLink: string
    embedImageUrl: string
    topTenBatsmen: Array<PlayerStatistics>
    topTenBowlers: Array<PlayerStatistics>
    allPlayerStats: Array<PlayerStatistics>
}) {
    return (
        <Fragment>
            <Header />
            <main className="w-full flex flex-col items-center justify-center player-stats-page-gradient">
                <section className="container max-w-[96rem] flex flex-col items-center justify-center py-7 my-5">
                    <h1 className="text-slate-50 font-bold text-5xl my-3">
                        {props.tournamentFullName}
                    </h1>
                    <h3 className="text-slate-50 uppercase font-semibold text-2xl my-3">
                        <span className="text-lime-100">{props.season + ' - '}</span>
                        <span>Player Rankings</span>
                    </h3>
                </section>
                <hr className="w-[80rem] border-slate-400" />
                <section className="container max-w-[96rem] flex flex-col items-center justify-center py-7 my-5">
                    <h3 className="text-slate-50 uppercase font-semibold text-3xl my-4">
                        Orange Cap
                    </h3>
                    <div
                        className={
                            'w-[50rem] flex flex-col items-center text-center text-slate-50 px-2 py-4 rounded-xl ' +
                            'bg-gradient-to-br from-[#19376D] via-[#0B2447] to-[#19376D] ' +
                            'border-4 border-solid border-[#21315B]'
                        }>
                        {props.topTenBatsmen.map((player, index) => (
                            <div
                                className={
                                    'w-3/4 player-stats-bg-gradient-batting flex items-center justify-between ' +
                                    'rounded-xl px-3 py-2 my-1'
                                }
                                key={player.id}>
                                <p className="font-semibold text-lg">
                                    {index + 1}. {player.name}
                                </p>
                                <p className="player-key-stat-box relative">
                                    <span
                                        className={
                                            'tooltip absolute bg-gradient-to-br from-[#FD841F] to-[#E14D2A] ' +
                                            'text-sm right-[-7.5rem] top-[-1rem] opacity-0 transition-opacity ' +
                                            'rounded-xl px-4 py-2 my-1 '
                                        }>
                                        Runs: {player.runs}
                                        <br />
                                        Balls: {player.balls}
                                    </span>
                                    <span className="font-semibold text-lg">{player.runs}</span>
                                    <span className="font-medium text-xs"> Runs</span>
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
                <hr className="w-[80rem] border-slate-400" />
                <section className="container max-w-[96rem] flex flex-col items-center justify-center py-7 mt-5 mb-24">
                    <h3 className="text-slate-50 uppercase font-semibold text-3xl my-4">
                        Purple Cap
                    </h3>
                    <div
                        className={
                            'w-[50rem] flex flex-col items-center text-center text-slate-50 px-2 py-4 rounded-xl ' +
                            'bg-gradient-to-br from-[#19376D] via-[#0B2447] to-[#19376D] ' +
                            'border-4 border-solid border-[#21315B]'
                        }>
                        {props.topTenBowlers.map((player, index) => (
                            <div
                                className={
                                    'w-3/4 player-stats-bg-gradient-bowling flex items-center justify-between ' +
                                    'rounded-xl px-3 py-2 my-1'
                                }
                                key={player.id}>
                                <p className="font-semibold text-lg">
                                    {index + 1}. {player.name}
                                </p>
                                <p className="player-key-stat-box relative">
                                    <span
                                        className={
                                            'tooltip absolute bg-gradient-to-br from-[#CF4EA8] to-[#8846A9] ' +
                                            'text-sm right-[-9.5rem] top-[-1.5rem] opacity-0 transition-opacity ' +
                                            'rounded-xl px-3 py-2 my-1 '
                                        }>
                                        <span>Wickets: {player.wickets}</span>
                                        <br />
                                        <span>Runs Given: {player.runs_given}</span>
                                        <br />
                                        <span>Balls Given: {player.balls_given}</span>
                                    </span>
                                    <span className="font-semibold text-lg">{player.wickets}</span>
                                    <span className="font-medium text-xs"> Wickets</span>
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
        </Fragment>
    )
}

async function getTournamentInfoData(tournament: string) {
    const path = '/tournaments/' + tournament

    const response = await axiosApi.get(path)
    const data = response.data as ApiResponseData

    return data
}

export const getStaticProps: GetStaticProps = async (context) => {
    const { tournament } = context.params as Params

    const tournamentInfoData = await getTournamentInfoData(tournament)
    const { season, server_link, tournament_full_name } = tournamentInfoData.data

    const response = await axiosApi.get('/playerstats/' + tournament)
    const playerStatsData = response.data as StatsApiResponseData

    const embedImageUrl = playerStatsData.cloudinary_url
    const allPlayerStats = playerStatsData.full_data

    const topTenBatsmen = playerStatsData.top_ten_batting
    const topTenBowlers = playerStatsData.top_ten_bowling

    topTenBatsmen.sort((a, b) => b.runs - a.runs || a.balls - b.balls)
    topTenBowlers.sort(
        (a, b) =>
            b.wickets - a.wickets || a.runs_given - b.runs_given || a.balls_given || b.balls_given
    )

    return {
        props: {
            tournamentFullName: tournament_full_name,
            season: season,
            serverLink: server_link,
            embedImageUrl: embedImageUrl,
            topTenBatsmen: topTenBatsmen,
            topTenBowlers: topTenBowlers,
            allPlayerStats: allPlayerStats
        }
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [{ params: { tournament: 'bots' } }, { params: { tournament: 'superleague' } }],
        fallback: false
    }
}

interface Params extends ParsedUrlQuery {
    tournament: string
}

interface ApiResponseData {
    cloudinary_url: string
    data: { [key: string]: unknown }
    message: string
    success: boolean
}

interface StatsApiResponseData extends ApiResponseData {
    full_data: Array<PlayerStatistics>
    top_ten_batting: Array<PlayerStatistics>
    top_ten_bowling: Array<PlayerStatistics>
}

interface PlayerStatistics {
    name: string
    id: number
    runs: number
    balls: number
    runs_given: number
    balls_given: number
    wickets: number
}
