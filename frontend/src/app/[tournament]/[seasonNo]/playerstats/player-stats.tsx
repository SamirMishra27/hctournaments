'use client'

import { useState } from 'react'
import Image from 'next/image'
import { PlayerStatisticState } from '@/types/states'

import arrowLeft from '@assets/arrow-left.svg'
import arrowRight from '@assets/arrow-right.svg'

export default function PlayerStatsPage(props: {
    playerStats: PlayerStatisticState[]
    imageUrl: string
}) {
    const { playerStats, imageUrl } = props

    const PAGE_SIZE = 10
    const LAST_PAGE_INDEX = Math.floor(playerStats.length / PAGE_SIZE)

    const sortedBatsmen = playerStats.toSorted((a, b) => b.runs - a.runs || a.balls - b.balls)
    const [indexBatsmen, setIndexBatsmen] = useState(0)

    playerStats.sort(
        (a, b) => b.wickets - a.wickets || a.runsGiven - b.runsGiven || a.ballsGiven - b.ballsGiven
    )

    const sortedBowlers = playerStats
    const [indexBowlers, setIndexBowlers] = useState(0)

    function BatterDetails(props: { player: PlayerStatisticState; index: number }) {
        const { player, index } = props

        return (
            <tr className=" border-b-2 border-b-dim-white dark:border-b-bright-navy transition dark:text-slate-100">
                <td className=" capitalize text-center">
                    {indexBatsmen === 0
                        ? index + 1 + indexBatsmen
                        : index + 1 + indexBatsmen * PAGE_SIZE}
                </td>
                <td className=" w-[28rem] capitalize">{player.playerName}</td>
                <td className=" uppercase text-center pl-2">
                    <span className=" w-11 inline-block">{player.runs}</span>
                    <span className=" w-10 inline-block text-xs"> Runs</span>
                </td>
            </tr>
        )
    }

    function BowlerDetails(props: { player: PlayerStatisticState; index: number }) {
        const { player, index } = props

        return (
            <tr className=" border-b-2 border-b-dim-white dark:border-b-bright-navy transition dark:text-slate-100">
                <td className=" capitalize text-center">
                    {indexBowlers === 0
                        ? index + 1 + indexBowlers
                        : index + 1 + indexBowlers + PAGE_SIZE}
                </td>
                <td className=" w-[28rem] capitalize">{player.playerName}</td>
                <td className=" uppercase text-center pl-2">
                    <span className=" w-9 inline-block">{player.wickets}</span>
                    <span className=" w-10 inline-block text-xs"> Wkts</span>
                </td>
            </tr>
        )
    }

    function Navigation(props: {
        navigationLeft: () => void
        navigationRight: () => void
        currentIndex: number
    }) {
        const { navigationLeft, navigationRight, currentIndex } = props

        return (
            <>
                <button
                    className={
                        ' join-item btn no-animation text-xl border-dim-white border' +
                        ' border-2 border-r-0 dark:bg-black/20 dark:text-white dark:hover:bg-white/10' +
                        ' dark:disabled:opacity-50 transition dark:border-bright-navy'
                    }
                    onClick={() => navigationLeft()}
                    disabled={currentIndex === 0}>
                    <Image
                        src={arrowLeft}
                        alt="Arrow left"
                        className=" w-6 h-auto"
                        quality={100}
                        width={128}
                        height={128}
                    />
                </button>
                <button
                    className={
                        ' join-item btn no-animation uppercase px-8 border' +
                        ' dark:bg-black/20 border-dim-white dark:border-bright-navy' +
                        ' dark:text-white min-w-[8rem] dark:hover:bg-white/10 transition'
                    }>
                    Page {currentIndex + 1}
                </button>
                <button
                    className={
                        ' join-item btn no-animation text-xl border-dim-white' +
                        ' border-2 border-l-0 dark:bg-black/20 dark:text-white dark:hover:bg-white/10' +
                        ' dark:disabled:opacity-50 transition dark:border-bright-navy'
                    }
                    onClick={() => navigationRight()}
                    disabled={currentIndex === LAST_PAGE_INDEX}>
                    <Image
                        src={arrowRight}
                        alt="Arrow right"
                        className=" w-6 h-auto"
                        quality={100}
                        width={128}
                        height={128}
                    />
                </button>
            </>
        )
    }

    return (
        <main className=" w-full min-h-[80vh] flex flex-col items-center justify-center bg-full-white dark:bg-dark-navy transition">
            <section className=" w-full overflow-x-auto my-20 px-2 flex flex-col items-center">
                <div className=" overflow-hidden rounded-2xl border-2 border-dim-white [border-bottom:none] dark:border-bright-navy transition dark:bg-black/20">
                    <div
                        className={
                            ' flex flex-1 flex-col items-start justify-center py-3 pl-4' +
                            ' border-b-2 border-b-dim-white bg-gradient-to-br' +
                            ' from-orange-gold/40 to-orange-gold font-sans font-medium' +
                            ' dark:border-b-bright-navy transition dark:text-slate-100'
                        }>
                        <span className=" text-3xl uppercase font-semibold">Most Run Scorers</span>
                        <span className=" text-base capitalize">Orange Cap</span>
                    </div>
                    <table className=" table text-lg">
                        <thead>
                            <tr className=" border-b-2 border-b-dim-white text-base dark:border-b-bright-navy transition dark:text-slate-100">
                                <th>Rank</th>
                                <th>Name</th>
                                <th>Runs</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedBatsmen
                                .slice(
                                    indexBatsmen * PAGE_SIZE,
                                    indexBatsmen * PAGE_SIZE + PAGE_SIZE
                                )
                                .map((player, index) => (
                                    <BatterDetails
                                        player={player}
                                        index={index}
                                        key={player.rowId}
                                    />
                                ))}
                        </tbody>
                    </table>
                </div>
                <div className=" join w-full flex items-center justify-center py-4 dark:text-slate-100">
                    <Navigation
                        navigationLeft={() => setIndexBatsmen(indexBatsmen - 1)}
                        navigationRight={() => setIndexBatsmen(indexBatsmen + 1)}
                        currentIndex={indexBatsmen}
                    />
                </div>
            </section>
            <section className=" w-full overflow-x-auto my-4 px-2 flex flex-col items-center">
                <div className=" overflow-hidden rounded-2xl border-2 border-dim-white [border-bottom:none] dark:border-bright-navy transition dark:bg-black/20">
                    <div
                        className={
                            ' flex flex-1 flex-col items-start justify-center py-3 pl-4' +
                            ' border-b-2 border-b-dim-white bg-gradient-to-br' +
                            ' from-purple-400/40 to-purple-400/80 font-sans font-medium' +
                            ' dark:border-b-bright-navy transition dark:text-slate-100'
                        }>
                        <span className=" text-3xl uppercase font-semibold">
                            Most Wicket Takers
                        </span>
                        <span className=" text-base capitalize">Purple Cap</span>
                    </div>
                    <table className=" table text-lg">
                        <thead>
                            <tr className=" border-b-2 border-b-dim-white text-base dark:border-b-bright-navy transition dark:text-slate-100">
                                <th>Rank</th>
                                <th>Name</th>
                                <th>Wickets</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedBowlers
                                .slice(
                                    indexBowlers * PAGE_SIZE,
                                    indexBowlers * PAGE_SIZE + PAGE_SIZE
                                )
                                .map((player, index) => (
                                    <BowlerDetails
                                        player={player}
                                        index={index}
                                        key={player.rowId}
                                    />
                                ))}
                        </tbody>
                    </table>
                </div>
                <div className=" join w-full flex items-center justify-center py-4 dark:text-slate-100">
                    <Navigation
                        navigationLeft={() => setIndexBowlers(indexBowlers - 1)}
                        navigationRight={() => setIndexBowlers(indexBowlers + 1)}
                        currentIndex={indexBowlers}
                    />
                </div>
            </section>
        </main>
    )
}
