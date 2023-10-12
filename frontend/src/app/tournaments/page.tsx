import { getAllTournamentsData } from '@/api'
import Header from '@/components/Header'
import TournamentsPage from './tournaments'
import { getDiscordUser, isSiteAdmin } from '@/serverActions'

export default async function Page() {
    const allTournaments = await getAllTournamentsData()

    const [loggedIn, discordUser] = await getDiscordUser()
    const isAdmin = loggedIn && discordUser ? await isSiteAdmin(discordUser.id) : false

    return (
        <>
            <Header pathways={[['Tournaments', '/tournaments']]} />
            <TournamentsPage tournaments={allTournaments} isAdmin={isAdmin} />
        </>
    )
}
