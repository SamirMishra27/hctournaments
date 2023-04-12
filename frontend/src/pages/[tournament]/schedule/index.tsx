import { useRouter } from 'next/router'

export default function schedulePage() {
    const router = useRouter()
    const tournamentName = router.query.tournament

    return <p>The Schedule page for {tournamentName}!</p>
}
