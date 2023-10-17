import { getHostsData, getTournamentData } from '@/api'
import Header from '@/components/Header'
import TournamentOverviewPage from './tournament-overview'
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
    const { tournamentName: name, seasonNo: season, embedThemeLink } = tournamentData

    const title = `${name} - Season ${season} | hctournaments`
    const description = 'Overview of Tournament'

    return {
        title: title,
        description: description,
        openGraph: {
            siteName: (await parent).openGraph?.siteName,
            title: title,
            images: embedThemeLink,
            description: description
        },
        twitter: {
            title: title,
            images: embedThemeLink,
            description: description
        }
    }
}

export default async function Page(props: { params: { tournament: string; seasonNo: number } }) {
    const { tournament, seasonNo } = props.params

    const tournamentData = await getTournamentData(tournament, seasonNo)
    const { tournamentName: name, slugName: slug, seasonNo: season } = tournamentData

    const [loggedIn, discordUser] = await getDiscordUser()
    const isAdmin = loggedIn && discordUser ? await isSiteAdmin(discordUser.id) : false

    const [hosts, _] = await getHostsData(tournament, seasonNo)

    const pathways = [
        [name, `/${slug}`],
        [`Season ${season}`, `/${slug}/${season}`]
    ]

    return (
        <>
            <Header pathways={pathways} />
            <TournamentNav
                tournamentSlug={slug}
                seasonNo={season}
                currentPath=""
                isAdmin={isAdmin}
            />
            <TournamentOverviewPage tournament={tournamentData} hosts={hosts} />
        </>
    )
}
