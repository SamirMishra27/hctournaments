import PlayerStatsEditPage from './edit-playerstats'
import { PlayerStatisticState } from '@/types/states'
import Header from '@/components/Header'
import TournamentNav from '@/components/TournamentNav'
import { revalidateTag } from 'next/cache'
import { getPlayerStatsData, getTournamentData, putPlayerStatsData } from '@/api'
import { getDiscordUser, isSiteAdmin } from '@/serverActions'
import { redirect } from 'next/navigation'

export default async function Page(props: { params: { tournament: string; seasonNo: number } }) {
    const { tournament, seasonNo } = props.params

    const [loggedIn, discordUser] = await getDiscordUser()
    if (!loggedIn || !discordUser) redirect('/login')

    const isAdmin = await isSiteAdmin(discordUser.id)
    if (!isAdmin) redirect('/')

    async function sendDataForUpdate(
        state: PlayerStatisticState[],
        deleted: PlayerStatisticState[]
    ): Promise<PlayerStatisticState[]> {
        'use server'
        await putPlayerStatsData(tournament, seasonNo, state, deleted)

        revalidateTag('playerstats')
        const [updatedState, ..._] = await getPlayerStatsData(tournament, seasonNo)

        return updatedState
    }

    const tournamentInfo = await getTournamentData(tournament, seasonNo)
    const { tournamentName: name, slugName: slug, seasonNo: season } = tournamentInfo

    const pathways = [
        [name, `/${slug}`],
        [`Season ${season}`, `/${slug}/${season}`],
        ['Player Stats', `/${slug}/${season}/playerstats/edit`],
        ['Edit', `/${slug}/${season}/playerstats/edit`]
    ]

    const [playerStatsState, _, tournamentId] = await getPlayerStatsData(tournament, seasonNo)

    return (
        <>
            <Header pathways={pathways} />
            <TournamentNav
                tournamentSlug={slug}
                seasonNo={season}
                currentPath="/playerstats/edit"
                isAdmin={isAdmin}
            />
            <PlayerStatsEditPage
                playerStats={playerStatsState}
                tournamentId={tournamentId}
                tournamentInfo={tournamentInfo}
                sendData={sendDataForUpdate}
            />
        </>
    )
}
