import { useRouter } from 'next/router'

export default function standingsOfAGroupPage() {
    const router = useRouter()
    // console.log(router)

    const tournamentName = router.query.tournament
    const groupName = router.query.groupName

    return (
        <p>
            The Standings of {groupName} for the tournament {tournamentName}!
        </p>
    )
}
