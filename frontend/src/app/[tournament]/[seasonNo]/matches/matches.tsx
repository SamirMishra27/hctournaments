'use client'

import { MatchState } from '@/types/states'
import { MatchStatus } from '@/types/constants'

export default function MatchesPage(props: { matches: MatchState[]; imageUrl: string }) {
    const getColour = (teamName: string, winnerName: string, matchStatus: MatchStatus): string => {
        if (matchStatus === 'PENDING') return ' from-stone-300 to-stone-400'

        if (teamName === winnerName) return ' from-green-500 to-green-600'
        else return ' from-red-400 to-red-500'
    }

    return (
        <main className=" w-full min-h-[80vh] flex flex-col items-center justify-center bg-full-white dark:bg-dark-navy transition">
            {/* <div className=" divider-horizontal" /> */}
            <section className=" w-full overflow-x-auto my-4 px-2 flex flex-col items-center">
                {props.matches.map((match, index) => (
                    <article
                        className=" w-full lg:w-[60rem] flex flex-col my-4 rounded-xl border-2 border-dim-white dark:border-bright-navy"
                        key={index}>
                        <div className=" w-full px-4 py-1 border-b-2 border-b-dim-white rounded-t-xl text-gray-800 text-base md:text-lg font-normal md:font-medium bg-gray-100 dark:bg-bright-navy dark:text-slate-100 transition dark:border-b-bright-navy">
                            Match {index + 1}
                        </div>
                        <div className=" w-full flex items-center justify-evenly overflow-y-hidden h-24 max-h-24 overflow-x-hidden rounded-b-[10px]">
                            <div className=" flex flex-1 flex-col md:flex-row items-center justify-evenly h-full text-gray-800 dark:text-slate-100">
                                <div
                                    className={
                                        ' w-[110%] md:w-5/6 h-full text-sm xs:text-base sm:text-xl md:text-2xl text-white text-center' +
                                        ' uppercase font-normal xs:font-medium md:font-bold md:pl-6 -skew-x-8 ' +
                                        ' flex items-center justify-center relative md:-left-6 border-r-2 border-r-dim-white bg-gradient-to-br' +
                                        ' dark:border-r-bright-navy dark:text-slate-100 transition' +
                                        getColour(match.teamAName, match.winnerName, match.status)
                                    }>
                                    {match.teamAName}
                                </div>
                                {match.status === 'DONE' ? (
                                    <div className="w-full md:w-4/12 flex flex-col items-start justify-center pl-2 md:py-4">
                                        <div className=" text-sm xs:text-base md:text-xl font-normal md:font-semibold">
                                            {match.teamARuns} / {match.teamAWickets}
                                        </div>
                                        <div className=" uppercase italic text-10 md:text-base">
                                            {match.teamAOvers} Overs
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full md:w-4/12 flex items-center justify-center py-1 md:py-4">
                                        <p
                                            className=" text-10 xs:text-base md:text-2xl font-semibold md:mr-5"
                                            aria-label="To be decided"
                                            title="To be decided">
                                            TBD
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className=" w-6 md:w-10 bg-stone-500 text-full-white py-12 text-center -skew-x-8 text-base md:text-xl font-medium dark:text-slate-100 transition z-10">
                                VS
                            </div>
                            <div className=" flex flex-1 flex-col-reverse md:flex-row items-center justify-evenly h-full text-gray-800 dark:text-slate-100">
                                {match.status === 'DONE' ? (
                                    <div className="w-full md:w-4/12 flex flex-col items-end justify-center pr-2 md:py-4">
                                        <div className=" text-sm xs:text-base md:text-xl font-normal md:font-semibold">
                                            {match.teamBRuns} / {match.teamBWickets}
                                        </div>
                                        <div className=" uppercase italic text-10 md:text-base">
                                            {match.teamBOvers} Overs
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full md:w-4/12 flex items-center justify-center py-1 md:py-4">
                                        <p
                                            className=" text-10 xs:text-base md:text-2xl font-semibold md:ml-5"
                                            aria-label="To be decided"
                                            title="To be decided">
                                            TBD
                                        </p>
                                    </div>
                                )}
                                <div
                                    className={
                                        ' w-[110%] md:w-5/6 h-full text-sm xs:text-base sm:text-xl md:text-2xl text-white text-center' +
                                        ' uppercase font-normal xs:font-medium md:font-bold md:pr-6 -skew-x-8 ' +
                                        ' flex items-center justify-center relative md:-right-6 border-l border-l-dim-white bg-gradient-to-br' +
                                        ' dark:border-l-bright-navy dark:text-slate-100 transition' +
                                        getColour(match.teamBName, match.winnerName, match.status)
                                    }>
                                    {match.teamBName}
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </section>
        </main>
    )
}
