import { useRouter } from 'next/router'

export default function statsPage() {
    const router = useRouter()
    const tournamentName = router.query.tournament

    return <p>The Player Stats page for {tournamentName}!</p>
}
