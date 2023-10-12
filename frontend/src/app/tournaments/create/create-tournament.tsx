'use client'

import { useRouter } from 'next/navigation'
import { getUniqueId } from '@/utils'
import { TournamentState } from '@/types/states'
import { TournamentEditView } from '@/app/[tournament]/[seasonNo]/edit/edit-tournament'

export default function TournamentInfoCreatePage(props: {
    createData: (state: TournamentState) => Promise<TournamentState>
}) {
    const router = useRouter()

    const tournamentInfo: TournamentState = {
        tournamentId: getUniqueId(),
        tournamentName: '',

        slugName: '',
        seasonNo: 0,

        startDate: '',
        endDate: '',
        stage: 'REGISTRATION',

        participants: 0,
        totalTeams: 0,

        totalMatches: 0,
        matchesDone: 0,

        serverLink: '',
        bannerLink: '',
        embedThemeLink: '',
        championsTeam: ''
    }

    async function createState(tournamentInfo: TournamentState) {
        const newTournament = await props.createData(tournamentInfo)
        const { slugName, seasonNo } = newTournament

        router.push(`/${slugName}/${seasonNo}/edit`)
    }

    return (
        <main className=" w-full flex flex-col items-center justify-center bg-full-white dark:bg-dark-navy transition py-12">
            <section className=" max-w-[60rem] w-full flex items-center justify-between text-gray-800 dark:text-slate-100 transition px-6">
                <div className=" flex flex-col items-start justify-evenly">
                    <h1 className=" font-medium text-3xl">Manage Tournament</h1>
                    <h3 className=" text-xl">Settings</h3>
                </div>
                <div className=" flex flex-col items-end justify-evenly">
                    <h2 className=" text-3xl">Create New</h2>
                </div>
            </section>
            <div className=" divider-vertical w-full h-px bg-dim-white dark:bg-bright-navy transition mt-6" />
            <section>
                <TournamentEditView
                    state={tournamentInfo}
                    createState={createState}
                    key={tournamentInfo.tournamentId}
                />
            </section>
        </main>
    )
}
