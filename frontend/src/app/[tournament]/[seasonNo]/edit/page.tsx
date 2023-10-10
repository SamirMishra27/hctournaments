import { revalidateTag } from 'next/cache'
import TournamentInfoEditPage from './edit-tournament'
import Header from '@/components/Header'
import { TournamentState } from '@/types/states'
import { getTournamentData, putTournamentData } from '@/api'
import { redirect } from 'next/navigation'
import TournamentNav from '@/components/TournamentNav'
import { getDiscordUser, isSiteAdmin } from '@/serverActions'

export default async function Page(props: { params: { tournament: string; seasonNo: number } }) {
    const { tournament, seasonNo } = props.params

    const [loggedIn, discordUser] = await getDiscordUser()
    if (!loggedIn || !discordUser) redirect('/login')

    const isAdmin = await isSiteAdmin(discordUser.id)
    if (!isAdmin) redirect('/')

    async function sendDataForUpdate(state: TournamentState): Promise<TournamentState> {
        'use server'

        await putTournamentData(tournament, seasonNo, state)

        revalidateTag('tournament')
        const updatedState = await getTournamentData(tournament, seasonNo)

        return updatedState
    }

    const tournamentInfoState = await getTournamentData(tournament, seasonNo)
    const { tournamentName: name, slugName: slug, seasonNo: season } = tournamentInfoState

    const pathways = [
        [name, `/${slug}`],
        [`Season ${season}`, `/${slug}/${season}`],
        ['Edit', `/${slug}/${season}/edit`]
    ]

    return (
        <>
            <Header isHomepage={false} pathways={pathways} />
            <TournamentNav
                tournamentSlug={slug}
                seasonNo={season}
                currentPath="/edit"
                isAdmin={isAdmin}
            />
            <TournamentInfoEditPage tournament={tournamentInfoState} sendData={sendDataForUpdate} />
        </>
    )
}
