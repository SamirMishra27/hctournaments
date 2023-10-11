import MatchesEditPage from './edit-matches'
import { MatchState } from '@/types/states'
import TournamentNav from '@/components/TournamentNav'
import { revalidateTag } from 'next/cache'
import { getMatchesData, getTournamentData, putMatchesData } from '@/api'
import { getDiscordUser, isSiteAdmin } from '@/serverActions'
import { redirect } from 'next/navigation'
import Header from '@/components/Header'

export default async function Page(props: { params: { tournament: string; seasonNo: number } }) {
    const { tournament, seasonNo } = props.params

    const [loggedIn, discordUser] = await getDiscordUser()
    if (!loggedIn || !discordUser) redirect('/login')

    const isAdmin = await isSiteAdmin(discordUser.id)
    if (!isAdmin) redirect('/')

    async function sendDataForUpdate(
        state: MatchState[],
        deleted: MatchState[]
    ): Promise<MatchState[]> {
        'use server'
        await putMatchesData(tournament, seasonNo, state, deleted)

        revalidateTag('matches')
        const [updatedState, ..._] = await getMatchesData(tournament, seasonNo)

        return updatedState
    }

    const tournamentInfo = await getTournamentData(tournament, seasonNo)
    const { tournamentName: name, slugName: slug, seasonNo: season } = tournamentInfo

    const pathways = [
        [name, `/${slug}`],
        [`Season ${season}`, `/${slug}/${season}`],
        ['Matches', `/${slug}/${season}/matches/edit`],
        ['Edit', `/${slug}/${season}/matches/edit`]
    ]

    const [matchesState, _, tournamentId] = await getMatchesData(tournament, seasonNo)

    return (
        <>
            <Header pathways={pathways} />
            <TournamentNav
                tournamentSlug={slug}
                seasonNo={season}
                currentPath="/matches/edit"
                isAdmin={isAdmin}
            />
            <MatchesEditPage
                matches={matchesState}
                tournamentId={tournamentId}
                tournamentInfo={tournamentInfo}
                sendData={sendDataForUpdate}
            />
        </>
    )
}
