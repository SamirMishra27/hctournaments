import { revalidateTag } from 'next/cache'
import HostsEditPage from './edit-hosts'
import Header from '@/components/Header'
import TournamentNav from '@/components/TournamentNav'
import { HostState } from '@/types/states'
import { getHostsData, getTournamentData, putHostsData } from '@/api'
import { redirect } from 'next/navigation'
import { getDiscordUser, isSiteAdmin } from '@/serverActions'

export default async function Page(props: { params: { tournament: string; seasonNo: number } }) {
    const { tournament, seasonNo } = props.params

    const [loggedIn, discordUser] = await getDiscordUser()
    if (!loggedIn || !discordUser) redirect('/login')

    const isAdmin = await isSiteAdmin(discordUser.id)
    if (!isAdmin) redirect('/')

    async function sendDataForUpdate(
        state: HostState[],
        deleted: HostState[]
    ): Promise<HostState[]> {
        'use server'

        await putHostsData(tournament, seasonNo, state, deleted)

        revalidateTag('hosts')
        const [updatedState, ..._] = await getHostsData(tournament, seasonNo)

        return updatedState
    }

    const tournamentInfo = await getTournamentData(tournament, seasonNo)
    const { tournamentName: name, slugName: slug, seasonNo: season } = tournamentInfo

    const pathways = [
        [name, `/${slug}`],
        [`Season ${season}`, `/${slug}/${season}`],
        ['Hosts', `/${slug}/${season}/hosts/edit`],
        ['Edit', `/${slug}/${season}/hosts/edit`]
    ]

    const [hostsState, tournamentId] = await getHostsData(tournament, seasonNo)

    return (
        <>
            <Header pathways={pathways} />
            <TournamentNav
                tournamentSlug={slug}
                seasonNo={season}
                currentPath="/hosts/edit"
                isAdmin={isAdmin}
            />
            <HostsEditPage
                hosts={hostsState}
                tournamentId={tournamentId}
                tournamentInfo={tournamentInfo}
                sendData={sendDataForUpdate}
            />
        </>
    )
}
