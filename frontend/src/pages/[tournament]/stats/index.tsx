import { Fragment, MouseEvent, useState } from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'

import { AxiosResponse, isAxiosError } from 'axios'

import Header from '@/components/header'
import Footer from '@/components/footer'

import { axiosApi, getTournamentInfoData } from '@/api'
import { Params, StatsApiPayloadData, PlayerStatistics } from '@/types'
import { DefaultMetaData } from '@/utils'

function InteractiveButton(props: {
    name: string
    onClick: (event: MouseEvent<HTMLButtonElement>) => void
    disabled: boolean
}) {
    return (
        <button
            disabled={props.disabled}
            className={
                'bg-gradient-to-br from-[#D47120] to-[#B63A1F] font-semibold ' +
                'py-3 px-5 my-4 rounded-lg text-center text-slate-50 ' +
                'hover:from-[#FD841F] hover:to-[#E14D2A] active:from-[#D47120] active:to-[#B63A1F] ' +
                'disabled:from-slate-300 disabled:to-slate-500'
            }
            onClick={(event) => props.onClick(event)}>
            {props.name}
        </button>
    )
}

function PlayerRowComponentBatting(props: { player: PlayerStatistics; index: number }) {
    const { player, index } = props

    return (
        <div
            className="w-3/4 bg-bright-orange flex items-center justify-between rounded-xl px-3 py-2 my-1"
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
    )
}

function PlayerRowComponentBowling(props: { player: PlayerStatistics; index: number }) {
    const { player, index } = props

    return (
        <div
            className="w-3/4 bg-bright-purple flex items-center justify-between rounded-xl px-3 py-2 my-1"
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
    )
}

export default function StatsPage(props: {
    tournamentFullName: string
    season: string
    serverLink: string
    embedImageUrl: string
    topTenBatsmen: Array<PlayerStatistics>
    topTenBowlers: Array<PlayerStatistics>
    allPlayerStats: Array<PlayerStatistics>
}) {
    const { allPlayerStats, tournamentFullName, embedImageUrl } = props
    const metaTitle = `${tournamentFullName} | ${DefaultMetaData.OG_MAIN_TITLE}`
    const metaDescription =
        'Individual player stats, Orange cap, Purple cap of ' + tournamentFullName

    const PAGE_SIZE = 10
    const LAST_PAGE_INDEX = Math.floor(allPlayerStats.length / PAGE_SIZE)

    const [playersSortedByRuns, setSortedByRuns] = useState<Array<PlayerStatistics>>([])
    const [indexOfAllByRuns, setIndexRuns] = useState<number>(0)

    const [playersSortedByWickets, setSortedByWickets] = useState<Array<PlayerStatistics>>([])
    const [indexOfAllByWickets, setIndexWickets] = useState<number>(0)

    function showAllPlayersByRuns() {
        allPlayerStats.sort((a, b) => b.runs - a.runs || a.balls - b.balls)
        setSortedByRuns(allPlayerStats)
    }

    function showAllPlayersByWickets() {
        allPlayerStats.sort(
            (a, b) =>
                b.wickets - a.wickets ||
                a.runs_given - b.runs_given ||
                a.balls_given - b.balls_given
        )
        setSortedByWickets(allPlayerStats)
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
                <section className="container max-w-[96rem] flex flex-col items-center justify-center py-7 my-5">
                    <h1 className="text-slate-50 font-bold text-5xl my-3">{tournamentFullName}</h1>
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
                            'bg-gradient-to-br from-night-blue-primary via-night-blue-accent ' +
                            'to-night-blue-primary border-4 border-solid border-[#21315B]'
                        }>
                        {playersSortedByRuns.length
                            ? playersSortedByRuns
                                  .slice(
                                      indexOfAllByRuns * PAGE_SIZE,
                                      indexOfAllByRuns * PAGE_SIZE + PAGE_SIZE
                                  )
                                  .map((player, index) => (
                                      <PlayerRowComponentBatting
                                          player={player}
                                          index={
                                              indexOfAllByRuns === 0
                                                  ? index + indexOfAllByRuns
                                                  : index + indexOfAllByRuns * PAGE_SIZE
                                          }
                                          key={player.id}
                                      />
                                  ))
                            : props.topTenBatsmen.map((player, index) => (
                                  <PlayerRowComponentBatting
                                      player={player}
                                      index={index}
                                      key={player.id}
                                  />
                              ))}
                    </div>
                    <div className="flex items-center justify-evenly py-1 px-3 space-x-6">
                        {playersSortedByRuns.length ? (
                            false
                        ) : (
                            <InteractiveButton
                                name="SHOW ALL"
                                onClick={showAllPlayersByRuns}
                                disabled={false}
                            />
                        )}
                        {!!playersSortedByRuns.length && (
                            <InteractiveButton
                                name="LAST"
                                onClick={() => {
                                    setIndexRuns(indexOfAllByRuns - 1)
                                }}
                                disabled={indexOfAllByRuns === 0}
                            />
                        )}
                        {!!playersSortedByRuns.length && (
                            <InteractiveButton
                                name="NEXT"
                                onClick={() => {
                                    setIndexRuns(indexOfAllByRuns + 1)
                                }}
                                disabled={indexOfAllByRuns === LAST_PAGE_INDEX}
                            />
                        )}
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
                            'bg-gradient-to-br from-night-blue-primary via-night-blue-accent ' +
                            'to-night-blue-primary border-4 border-solid border-[#21315B]'
                        }>
                        {playersSortedByWickets.length
                            ? playersSortedByWickets
                                  .slice(
                                      indexOfAllByWickets * PAGE_SIZE,
                                      indexOfAllByWickets * PAGE_SIZE + PAGE_SIZE
                                  )
                                  .map((player, index) => (
                                      <PlayerRowComponentBowling
                                          player={player}
                                          index={
                                              indexOfAllByWickets === 0
                                                  ? index + indexOfAllByWickets
                                                  : index + indexOfAllByWickets * PAGE_SIZE
                                          }
                                          key={player.id}
                                      />
                                  ))
                            : props.topTenBowlers.map((player, index) => (
                                  <PlayerRowComponentBowling
                                      player={player}
                                      index={index}
                                      key={player.id}
                                  />
                              ))}
                    </div>
                    <div className="flex items-center justify-evenly py-1 px-3 space-x-6">
                        {playersSortedByWickets.length ? (
                            false
                        ) : (
                            <InteractiveButton
                                name="SHOW ALL"
                                onClick={showAllPlayersByWickets}
                                disabled={false}
                            />
                        )}
                        {!!playersSortedByWickets.length && (
                            <InteractiveButton
                                name="LAST"
                                onClick={() => {
                                    setIndexWickets(indexOfAllByWickets - 1)
                                }}
                                disabled={indexOfAllByWickets === 0}
                            />
                        )}
                        {!!playersSortedByWickets.length && (
                            <InteractiveButton
                                name="NEXT"
                                onClick={() => setIndexWickets(indexOfAllByWickets + 1)}
                                disabled={indexOfAllByWickets === LAST_PAGE_INDEX}
                            />
                        )}
                    </div>
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
    const { season, server_link, tournament_full_name } = tournamentInfoData.data

    let response: AxiosResponse | undefined
    try {
        response = await axiosApi.get('/playerstats/' + tournament)
    } catch (error) {
        if (isAxiosError(error)) response = error.response
        else throw error
    }

    if (!response || response.status === 404 || !response.data.success) {
        return {
            notFound: true,
            revalidate: 60 * 60 * 6
        }
    }
    const playerStatsData = response.data as StatsApiPayloadData

    const embedImageUrl = playerStatsData.cloudinary_url
    const allPlayerStats = playerStatsData.full_data

    const topTenBatsmen = playerStatsData.top_ten_batting
    const topTenBowlers = playerStatsData.top_ten_bowling

    topTenBatsmen.sort((a, b) => b.runs - a.runs || a.balls - b.balls)
    topTenBowlers.sort(
        (a, b) =>
            b.wickets - a.wickets || a.runs_given - b.runs_given || a.balls_given - b.balls_given
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
