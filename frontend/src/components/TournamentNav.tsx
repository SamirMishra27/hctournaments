'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { pathAsId } from '@/utils'

function FloatingHover() {
    return (
        <motion.div
            className=" w-full h-full bg-stone-400/25 absolute bottom-0 left-0 rounded-md"
            transition={{ duration: 0.2 }}
            layoutId="tournament-navigation"
        />
    )
}

export default function TournamentNav(props: {
    tournamentSlug: string
    seasonNo: number
    currentPath: string
    isAdmin: boolean
}) {
    const { tournamentSlug, seasonNo, currentPath, isAdmin } = props
    const basePath = `/${tournamentSlug}/${seasonNo}`

    const allowedPaths = [
        ['Overview', ''],
        ['Matches', '/matches'],
        ['Standings', '/standings'],
        ['Player Stats', '/playerstats']
    ].map((pathDetails) => ({ pathName: pathDetails[0], pathUrl: basePath + pathDetails[1] }))

    const adminPaths = [
        ['Overview', '/edit'],
        ['Hosts', '/hosts/edit'],
        ['Matches', '/matches/edit'],
        ['Standings', '/standings/edit'],
        ['Player Stats', '/playerstats/edit']
    ].map((pathDetails) => ({ pathName: pathDetails[0], pathUrl: basePath + pathDetails[1] }))

    const [hoveredPath, setHoveredPath] = useState(basePath + currentPath)

    return (
        <div
            id="tournament-navigation"
            className={
                ' w-full bg-white flex items-center justify-evenly overflow-x-auto' +
                ' relative [box-shadow:0px_6px_12px_-8px_rgba(0,0,0,0.1)] dark:bg-dark-navy' +
                ' dark:[box-shadow:0px_6px_12px_-4px_rgba(255,255,255,0.1)] transition'
            }>
            <div className=" w-screen max-w-[96rem] flex items-center justify-start px-2 sm:px-4 md:px-6 py-4 gap-x-1">
                <nav className=" flex items-center justify-start join">
                    {allowedPaths.map(({ pathName, pathUrl }) => (
                        <button
                            className={
                                ' btn no-animation join-item min-h-0 h-auto border-none relative normal-case' +
                                ' bg-transparent hover:bg-transparent p-0 m-0 rounded-md text-gray-800 font-medium' +
                                ' dark:text-slate-100 transition shrink' +
                                (pathUrl === hoveredPath ? ' border-b-2 border-b-orange-gold' : '')
                            }
                            onMouseOver={() => setHoveredPath(pathUrl)}
                            onMouseLeave={() => setHoveredPath(basePath + currentPath)}
                            key={pathAsId(pathName)}>
                            <Link href={pathUrl} className=" px-4 py-2">
                                {pathUrl === hoveredPath && <FloatingHover />}
                                <span>{pathName}</span>
                            </Link>
                        </button>
                    ))}
                </nav>
                {isAdmin && (
                    <nav className=" flex items-center justify-start join relative border border-orange-gold">
                        <p className=" bg-white text-10 px-2 absolute -top-2 left-8 -translate-x-1/2 dark:bg-dark-navy dark:text-slate-100 transition">
                            Admin
                        </p>
                        {adminPaths.map(({ pathName, pathUrl }) => (
                            <button
                                className={
                                    ' btn no-animation join-item min-h-0 h-auto border-none relative normal-case' +
                                    ' bg-transparent hover:bg-transparent p-0 m-0 rounded-md text-gray-800 font-medium' +
                                    ' dark:text-slate-100 transition shrink' +
                                    (pathUrl === hoveredPath
                                        ? ' border-b-2 border-b-orange-gold'
                                        : '')
                                }
                                onMouseOver={() => setHoveredPath(pathUrl)}
                                onMouseLeave={() => setHoveredPath(basePath + currentPath)}
                                key={pathAsId(pathName)}>
                                <Link href={pathUrl} className=" px-4 py-2">
                                    {pathUrl === hoveredPath && <FloatingHover />}
                                    <span>{pathName}</span>
                                </Link>
                            </button>
                        ))}
                    </nav>
                )}
            </div>
        </div>
    )
}
