import { revalidateTag } from 'next/cache'
import TournamentInfoCreatePage from './create-tournament'
import { TournamentState } from '@/types/states'
import { postTournamentData } from '@/api'
import { redirect } from 'next/navigation'
import { getDiscordUser, isSiteAdmin } from '@/serverActions'
import Header from '@/components/Header'

export default async function Page() {
    const [loggedIn, discordUser] = await getDiscordUser()
    if (!loggedIn || !discordUser) redirect('/login')

    const isAdmin = await isSiteAdmin(discordUser.id)
    if (!isAdmin) redirect('/')

    async function sendDataForCreation(state: TournamentState): Promise<TournamentState> {
        'use server'

        const responseState = await postTournamentData(state.slugName, state.seasonNo, state)
        console.log(responseState)
        revalidateTag('tournament')

        return responseState
    }

    const pathways = [
        ['Tournaments', '/tournaments'],
        ['Create', '/tournaments/create']
    ]

    return (
        <>
            <Header pathways={pathways} />
            <TournamentInfoCreatePage createData={sendDataForCreation} />
        </>
    )
}
