import PlayerStatsPage from './player-stats'
import Header from '@/components/Header'
import { getPlayerStatsData, getTournamentData } from '@/api'
import TournamentNav from '@/components/TournamentNav'
import { getDiscordUser, isSiteAdmin } from '@/serverActions'
import { Metadata, ResolvingMetadata } from 'next'

export async function generateMetadata(
    props: {
        params: { tournament: string; seasonNo: number }
    },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { tournament, seasonNo } = props.params

    const tournamentData = await getTournamentData(tournament, seasonNo)
    const { tournamentName: name, seasonNo: season } = tournamentData

    const [_, imageUrl] = await getPlayerStatsData(tournament, seasonNo)

    const title = `Player Stats | ${name} - Season ${season}`
    const description = 'Orange cap & Purple cap rankings in ' + `${name}, Season ${season}`

    return {
        title: title,
        description: description,
        openGraph: {
            siteName: (await parent).openGraph?.siteName,
            title: title,
            images: imageUrl,
            description: description
        },
        twitter: {
            title: title,
            images: imageUrl,
            description: description
        }
    }
}

export default async function Page(props: { params: { tournament: string; seasonNo: number } }) {
    const { tournament, seasonNo } = props.params
    const [playerStats, imageUrl] = await getPlayerStatsData(tournament, seasonNo)

    const [loggedIn, discordUser] = await getDiscordUser()
    const isAdmin = loggedIn && discordUser ? await isSiteAdmin(discordUser.id) : false

    const {
        tournamentName: name,
        slugName: slug,
        seasonNo: season
    } = await getTournamentData(tournament, seasonNo)

    const pathways = [
        [name, `/${slug}`],
        [`Season ${season}`, `/${slug}/${season}`],
        ['Player Stats', `/${slug}/${season}/playerstats`]
    ]

    return (
        <>
            <Header pathways={pathways} />
            <TournamentNav
                tournamentSlug={slug}
                seasonNo={season}
                currentPath="/playerstats"
                isAdmin={isAdmin}
            />
            <PlayerStatsPage playerStats={playerStats} imageUrl={imageUrl} />
        </>
    )
}
