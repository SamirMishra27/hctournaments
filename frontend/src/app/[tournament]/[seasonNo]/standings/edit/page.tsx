import { revalidateTag } from 'next/cache'
import StandingsEditPage from './edit-standings'
import Header from '@/components/Header'
import TournamentNav from '@/components/TournamentNav'
import { TeamStandingState } from '@/types/states'
import { getTeamStandingsData, getTournamentData, putTeamStandingsData } from '@/api'
import { getDiscordUser, isSiteAdmin } from '@/serverActions'
import { redirect } from 'next/navigation'

export default async function Page(props: { params: { tournament: string; seasonNo: number } }) {
    const { tournament, seasonNo } = props.params

    const [loggedIn, discordUser] = await getDiscordUser()
    if (!loggedIn || !discordUser) redirect('/login')

    const isAdmin = await isSiteAdmin(discordUser.id)
    if (!isAdmin) redirect('/')

    async function sendDataForUpdate(
        state: TeamStandingState[],
        deleted: TeamStandingState[]
    ): Promise<TeamStandingState[]> {
        'use server'
        await putTeamStandingsData(tournament, seasonNo, state, deleted)

        revalidateTag('standings')
        const [updatedState, ..._] = await getTeamStandingsData(tournament, seasonNo)

        return updatedState
    }

    const tournamentInfo = await getTournamentData(tournament, seasonNo)
    const { tournamentName: name, slugName: slug, seasonNo: season } = tournamentInfo

    const pathways = [
        [name, `/${slug}`],
        [`Season ${season}`, `/${slug}/${season}`],
        ['Standings', `/${slug}/${season}/standings/edit`],
        ['Edit', `/${slug}/${season}/standings/edit`]
    ]

    const [teamStandingsState, _, tournamentId] = await getTeamStandingsData(tournament, seasonNo)

    return (
        <>
            <Header pathways={pathways} />
            <TournamentNav
                tournamentSlug={slug}
                seasonNo={season}
                currentPath="/standings/edit"
                isAdmin={isAdmin}
            />
            <StandingsEditPage
                standings={teamStandingsState}
                tournamentId={tournamentId}
                tournamentInfo={tournamentInfo}
                sendData={sendDataForUpdate}
            />
        </>
    )
}
