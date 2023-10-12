'use client'

import { Tabs, TabList, TabPanels, Tab, TabPanel, TabIndicator } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TeamStandingState } from '@/types/states'
import { ImageUrls } from '@/types/payloads'

export default function StandingsPage(props: {
    standings: TeamStandingState[]
    imageUrls: ImageUrls
    groupId?: string
    currentPath: string
}) {
    const { standings, imageUrls } = props

    const distinctGroupIds = Array.from(new Set(standings.map((row) => row.groupId)))
    const defaultGroupIndex = distinctGroupIds.indexOf(props.groupId || '')

    const [groupIndex, setGroupIndex] = useState(defaultGroupIndex === -1 ? 0 : defaultGroupIndex)
    const router = useRouter()

    const groups = distinctGroupIds.map((groupId) =>
        standings.filter((row) => row.groupId == groupId)
    )

    useEffect(() => {
        const groupId = distinctGroupIds[groupIndex]
        router.replace(props.currentPath + '?group_id=' + groupId)
    }, [groupIndex])

    const colorPaletteTab = [
        ' from-[#40F8FF]/70 to-[#279EFF]/100',
        ' from-fuchsia-400/50 to-fuchsia-600/70',
        ' from-[#FBEEAC]/70 to-[#F4D160]/100',
        ' from-[#93B1A6]/70 to-[#5C8374]/100',
        ' from-[#FCAEAE]/70 to-[#FF8989]/100'
    ]

    const colorPaletteTable = [
        ' from-[#40F8FF]/20 to-[#279EFF]/50',
        ' from-fuchsia-400/20 to-fuchsia-600/40',
        ' from-[#FBEEAC]/20 to-[#F4D160]/50',
        ' from-[#93B1A6]/20 to-[#5C8374]/50',
        ' from-[#FCAEAE]/20 to-[#FF8989]/50'
    ]

    function changeGroup(index: string) {
        setGroupIndex(parseInt(index))
    }

    const getTabColour = (index: number): string => {
        return colorPaletteTab.at(index % colorPaletteTab.length) as string
    }

    const getTableColour = (index: number): string => {
        return colorPaletteTable.at(index % colorPaletteTable.length) as string
    }

    function TeamRow({ team, index }: { team: TeamStandingState; index: number }) {
        return (
            <tr className=" border-b-2 border-b-dim-white text-center text-gray-800 dark:border-b-bright-navy transition">
                <td>{index + 1}</td>
                <td className=" w-[28rem] capitalize text-left font-semibold text-base md:text-lg">
                    {team.teamName}
                </td>
                <td className=" px-8">{team.matchesPlayed}</td>
                <td className=" px-8">{team.matchesWon}</td>
                <td className=" px-8">{team.matchesLost}</td>
                <td className=" px-8">{team.points}</td>
            </tr>
        )
    }

    function GroupTab(props: { group: TeamStandingState[]; index: number }) {
        return (
            <TabPanel className=" bg-transparent dark:bg-stone-200 transition overflow-x-auto">
                <table
                    className={
                        ' table text-lg bg-gradient-to-br rounded-t-none ' +
                        getTableColour(props.index)
                    }>
                    <thead>
                        <tr className=" border-b-2 border-b-dim-white text-base text-center text-gray-600 dark:border-b-bright-navy transition">
                            <th>Rank</th>
                            <th className=" text-left">Team Name</th>
                            <th>Played</th>
                            <th>Won</th>
                            <th>Lost</th>
                            <th>Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.group.map((team, index) => (
                            <TeamRow team={team} index={index} key={team.rowId} />
                        ))}
                    </tbody>
                </table>
            </TabPanel>
        )
    }

    return (
        <main className=" w-full min-h-[80vh] flex flex-col items-center justify-center bg-full-white dark:bg-dark-navy transition">
            <section className=" w-full my-20 px-4 flex items-center justify-center">
                <Tabs
                    className=" rounded-2xl border-2 text-gray-800 border-dim-white border-b-0 dark:border-bright-navy transition overflow-hidden max-w-[50rem]"
                    index={groupIndex}>
                    <TabList className=" inline-block bg-transparent dark:bg-stone-200 transition">
                        {groups.map((group, index) => (
                            <Tab
                                className={
                                    'flex flex-1 justify-center px-2 py-3 uppercase text-base sm:text-xl' +
                                    ' md:text-2xl font-semibold bg-gradient-to-br' +
                                    getTabColour(index)
                                }
                                key={group[0].rowId}
                                onClick={(event) =>
                                    changeGroup(event.currentTarget.dataset.index as string)
                                }>
                                {group[0].groupName}
                            </Tab>
                        ))}
                    </TabList>
                    <TabIndicator className=" h-1 bg-slate-600 -mt-1" />
                    <TabPanels>
                        {groups.map((group, index) => (
                            <GroupTab group={group} index={index} key={group[0].rowId} />
                        ))}
                    </TabPanels>
                </Tabs>
            </section>
        </main>
    )
}
