import StandingsPage from './standings'
import Header from '@/components/Header'
import { getTeamStandingsData, getTournamentData } from '@/api'
import TournamentNav from '@/components/TournamentNav'
import { getDiscordUser, isSiteAdmin } from '@/serverActions'
import { Metadata } from 'next'

export async function generateMetadata(props: {
    params: { tournament: string; seasonNo: number }
    searchParams: { [key: string]: string | undefined }
}): Promise<Metadata> {
    const { tournament, seasonNo } = props.params
    const { group_id } = props.searchParams

    const tournamentData = await getTournamentData(tournament, seasonNo)
    const { tournamentName: name, seasonNo: season } = tournamentData

    const [teamStandings, imageUrls] = await getTeamStandingsData(tournament, seasonNo)
    const groupName =
        teamStandings.find((standing) => standing.groupId === group_id)?.groupName ||
        teamStandings[0].groupName

    const title = `Standings | ${name} - Season ${season}`
    const description =
        'Current standings ' +
        (groupName ? `for ${groupName} ` : '& top teams ') +
        `in ${name}, Season ${season}`
    const image = group_id ? imageUrls[group_id] : Object.values(imageUrls)[0]

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            images: image
        },
        twitter: {
            title: title,
            images: image
        }
    }
}

export default async function Page(props: {
    params: { tournament: string; seasonNo: number }
    searchParams: { [key: string]: string | undefined }
}) {
    const { tournament, seasonNo } = props.params
    const groupId = props.searchParams.group_id
    const [teamStandingsState, imageUrls] = await getTeamStandingsData(tournament, seasonNo)

    const [loggedIn, discordUser] = await getDiscordUser()
    const isAdmin = loggedIn && discordUser ? await isSiteAdmin(discordUser.id) : false

    const {
        tournamentName: name,
        slugName: slug,
        seasonNo: season
    } = await getTournamentData(tournament, seasonNo)

    const currentPath = `/${slug}/${season}/standings`
    const pathways = [
        [name, `/${slug}`],
        [`Season ${season}`, `/${slug}/${season}`],
        ['Standings', currentPath]
    ]

    return (
        <>
            <Header pathways={pathways} />
            <TournamentNav
                tournamentSlug={slug}
                seasonNo={season}
                currentPath="/standings"
                isAdmin={isAdmin}
            />
            <StandingsPage
                standings={teamStandingsState}
                imageUrls={imageUrls}
                groupId={groupId}
                currentPath={currentPath}
            />
        </>
    )
}
