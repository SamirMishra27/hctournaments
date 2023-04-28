import { Fragment } from 'react'
import { GetStaticProps, GetStaticPaths } from 'next'
import { AxiosResponse, isAxiosError } from 'axios'

import Link from 'next/link'
import Head from 'next/head'

import Header from '@/components/header'
import Footer from '@/components/footer'
import ComingSoonPage from '@/components/comingSoon'

import { axiosApi, getTournamentInfoData } from '@/api'
import { GroupsApiPayloadData, GroupInfo, GroupStandings, Params } from '@/types'
import { DefaultMetaData, hasTournamentStarted } from '@/utils'

export default function StandingsGroupPage(props: {
    tournamentFullName: string
    tournamentStartDate: string
    tournament: string
    season: string
    serverLink: string
    embedImageUrl: string
    groupId: string
    groupFullName: string
    groupStandings: Array<GroupStandings>
    availableGroups: Array<GroupInfo>
}) {
    const { tournamentFullName, embedImageUrl, groupFullName } = props
    const metaTitle = `${tournamentFullName} | ${DefaultMetaData.OG_MAIN_TITLE}`
    const metaDescription = `Points table for ${groupFullName} of ${tournamentFullName}`

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
                    <h1 className="text-slate-50 font-bold text-3xl xs:text-4xl md:text-5xl my-3">
                        {tournamentFullName}
                    </h1>
                    <h3 className="text-slate-50 uppercase font-semibold text-xl xs:text-2xl my-3">
                        <span className="text-lime-100">{props.season}</span>
                        <span> - GROUP STANDINGS</span>
                    </h3>
                </section>
                <hr className="w-4/5 xl:w-[80rem] border-slate-400" />

                <section className="container max-w-[96rem] flex flex-col items-center justify-center py-7 my-5">
                    <h3 className="text-slate-50 uppercase font-semibold text-3xl my-4">
                        {props.groupFullName}
                    </h3>
                    <div
                        className={
                            'w-[95%] lg:w-[50rem] flex flex-col items-center text-center text-slate-50 ' +
                            'px-0.5 xs:px-2 py-4 rounded-xl bg-gradient-to-br from-[#19376D] via-[#0B2447] to-[#19376D] ' +
                            'border-4 border-solid border-[#21315B] font-medium xs:font-semibold text-xs xs:text-base sm:text-lg'
                        }>
                        {props.groupStandings.map((row, index) => (
                            <div
                                className="w-[95%] sm:w-3/4 bg-bright-orange flex items-center justify-around rounded-xl px-0 sm:px-3 py-3 my-2"
                                key={index}>
                                <p>{index + 1}. </p>
                                <p className="uppercase w-24 xs:w-32 sm:w-56 break-words text-left whitespace-nowrap sm:whitespace-normal overflow-x-hidden text-ellipsis">
                                    {row.team_name}
                                </p>
                                <p>{row.matches_played}</p>
                                <p>{row.matches_won}</p>
                                <p>{row.matches_lost}</p>
                                <p className="w-16 sm:w-20 flex items-center justify-evenly">
                                    <span>{row.points}</span>
                                    <span className="font-medium text-xs"> Points</span>
                                </p>
                            </div>
                        ))}
                    </div>
                    <h1 className="text-center text-slate-50 font-semibold text-2xl mt-10 px-2">
                        See Other Group&apos;s Standings
                    </h1>
                    <div className="w-11/12 sm:w-auto flex flex-wrap sm:flex-nowrap items-center justify-evenly py-2 px-3 sm:space-x-6 mt-3 mb-10 gap-x-2">
                        {props.availableGroups.map((groupInfo) => (
                            <button
                                disabled={groupInfo.id === props.groupId}
                                className={
                                    'bg-gradient-to-br from-[#D47120] to-[#B63A1F] font-semibold ' +
                                    'w-28 h-12 my-4 rounded-lg text-center text-slate-50 ' +
                                    'hover:from-[#FD841F] hover:to-[#E14D2A] active:from-[#D47120] active:to-[#B63A1F] ' +
                                    'disabled:from-slate-300 disabled:to-slate-500 overflow-hidden'
                                }
                                key={groupInfo.id}>
                                {groupInfo.id === props.groupId ? (
                                    <div className="w-full h-full uppercase flex items-center justify-center">
                                        {groupInfo.name}
                                    </div>
                                ) : (
                                    <Link
                                        href={'/' + props.tournament + '/standings/' + groupInfo.id}
                                        className="w-full h-full uppercase flex items-center justify-center">
                                        {groupInfo.name}
                                    </Link>
                                )}
                            </button>
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
        </Fragment>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {
    const REVALIDATE_TIME = 60 * 5

    const { tournament, groupName } = context.params as Params
    const groupId = groupName
    // TODO: Fix this bad code

    const tournamentInfoData = await getTournamentInfoData(tournament)
    if (!tournamentInfoData) {
        return {
            notFound: true,
            revalidate: REVALIDATE_TIME
        }
    }
    const { season, server_link, tournament_full_name, start_date } = tournamentInfoData.data

    const availableGroups = tournamentInfoData.data.groups as Array<GroupInfo>
    const queriedGroup = availableGroups.filter((group) => group.id === groupId)[0]

    let response: AxiosResponse | undefined
    try {
        response = await axiosApi.get('/groups/' + tournament + '/' + groupId)
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
    const groupData = response.data as GroupsApiPayloadData

    const embedImageUrl = groupData.cloudinary_url
    const groupStandings = groupData.data

    return {
        props: {
            tournamentFullName: tournament_full_name,
            tournamentStartDate: start_date,
            tournament: tournament,
            season: season,
            serverLink: server_link,
            embedImageUrl: embedImageUrl,
            groupId: groupId,
            groupFullName: queriedGroup.name,
            groupStandings: groupStandings,
            availableGroups: availableGroups
        },
        revalidate: REVALIDATE_TIME
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    const paramsArray: { params: { tournament: string; groupName: string } }[] = []
    const officialTourneys = ['bots', 'superleague']

    for (const tournamentId of officialTourneys) {
        const tournamentInfoData = await getTournamentInfoData(tournamentId)

        if (!tournamentInfoData) continue

        const groups = tournamentInfoData.data.groups as Array<GroupInfo>
        groups.map((group) => {
            paramsArray.push({
                params: { tournament: tournamentId, groupName: group.id }
            })
        })
    }

    return {
        paths: paramsArray,
        fallback: 'blocking'
    }
}
