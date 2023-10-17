import MatchesPage from './matches'
import Header from '@/components/Header'
import { getMatchesData, getTournamentData } from '@/api'
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

    const [_, imageUrl] = await getMatchesData(tournament, seasonNo)

    const title = `Matches | ${name} - Season ${season}`
    const description = 'Upcoming matches & results of ' + `${name}, Season ${season}`

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
    const [matchesState, imageUrl] = await getMatchesData(tournament, seasonNo)

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
        ['Matches', `/${slug}/${season}/matches`]
    ]

    return (
        <>
            <Header pathways={pathways} />
            <TournamentNav
                tournamentSlug={slug}
                seasonNo={season}
                currentPath="/matches"
                isAdmin={isAdmin}
            />
            <MatchesPage matches={matchesState} imageUrl={imageUrl} />
        </>
    )
}
