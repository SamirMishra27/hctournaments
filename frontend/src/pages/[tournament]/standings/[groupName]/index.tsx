import { Fragment } from 'react'
import { GetStaticProps, GetStaticPaths } from 'next'
import Link from 'next/link'

import Header from '@/components/header'
import Footer from '@/components/footer'
import { axiosApi, getTournamentInfoData } from '@/api'
import { GroupsApiPayloadData, GroupInfo, GroupStandings, Params } from '@/types'

export default function standingsOfAGroupPage(props: {
    tournamentFullName: string
    tournament: string
    season: string
    serverLink: string
    embedImageUrl: string
    groupId: string
    groupFullName: string
    groupStandings: Array<GroupStandings>
    availableGroups: Array<GroupInfo>
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
                        <span className="text-lime-100">{props.season}</span>
                        <span> - GROUP STANDINGS</span>
                    </h3>
                </section>
                <hr className="w-[80rem] border-slate-400" />

                <section className="container max-w-[96rem] flex flex-col items-center justify-center py-7 my-5">
                    <h3 className="text-slate-50 uppercase font-semibold text-3xl my-4">
                        {props.groupFullName}
                    </h3>
                    <div
                        className={
                            'w-[50rem] flex flex-col items-center text-center text-slate-50 font-semibold text-lg ' +
                            'px-2 py-4 rounded-xl bg-gradient-to-br from-[#19376D] via-[#0B2447] to-[#19376D] ' +
                            'border-4 border-solid border-[#21315B]'
                        }>
                        {props.groupStandings.map((row, index) => (
                            <div
                                className={
                                    'w-3/4 group-standings-bg-gradient flex items-center justify-around ' +
                                    'rounded-xl px-3 py-3 my-2'
                                }
                                key={index}>
                                <p>{index + 1}. </p>
                                <p className="uppercase w-56 break-words text-left">
                                    {row.team_name}
                                </p>
                                <p>{row.matches_played}</p>
                                <p>{row.matches_won}</p>
                                <p>{row.matches_lost}</p>
                                <p className="w-20 flex items-center justify-evenly">
                                    <span>{row.points}</span>
                                    <span className="font-medium text-xs"> Points</span>
                                </p>
                            </div>
                        ))}
                    </div>
                    <h1 className="text-center text-slate-50 font-semibold text-2xl mt-10">
                        See Other Group&apos; Standings
                    </h1>
                    <div className="flex items-center justify-evenly py-2 px-3 space-x-6 mt-3 mb-10">
                        {props.availableGroups.map((groupInfo) => (
                            <button
                                disabled={groupInfo.id === props.groupId}
                                className={
                                    'bg-gradient-to-br from-[#D47120] to-[#B63A1F] font-semibold ' +
                                    'w-28 h-12 my-4 rounded-lg text-center text-slate-50 ' +
                                    'hover:from-[#FD841F] hover:to-[#E14D2A] active:from-[#D47120] active:to-[#B63A1F] ' +
                                    'disabled:from-slate-300 disabled:to-slate-500'
                                }
                                id={props.groupId}>
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
    const { tournament, groupName } = context.params as Params
    const groupId = groupName
    // TODO: Fix this bad code

    const tournamentInfoData = await getTournamentInfoData('bots')
    const { season, server_link, tournament_full_name } = tournamentInfoData.data

    const availableGroups = tournamentInfoData.data.groups as Array<GroupInfo>
    const queriedGroup = availableGroups.filter((group) => group.id === groupId)[0]

    const response = await axiosApi.get('/groups/' + tournament + '/' + groupId)
    const groupData = response.data as GroupsApiPayloadData

    const embedImageUrl = groupData.cloudinary_url
    const groupStandings = groupData.data

    return {
        props: {
            tournamentFullName: tournament_full_name,
            tournament: tournament,
            season: season,
            serverLink: server_link,
            embedImageUrl: embedImageUrl,
            groupId: groupId,
            groupFullName: queriedGroup.name,
            groupStandings: groupStandings,
            availableGroups: availableGroups
        }
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    const tournamentInfoData = await getTournamentInfoData('bots')

    const groups = tournamentInfoData.data.groups as Array<GroupInfo>

    const paramsArray = groups.map((group) => ({
        params: { tournament: 'bots', groupName: group.id }
    }))

    return {
        paths: paramsArray,
        fallback: false
    }
}
