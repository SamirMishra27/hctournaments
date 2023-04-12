import { useRouter } from 'next/router'

export default function tournamentPage() {
    const router = useRouter()
    const tournamentName = router.query.tournament

    return <p>The {tournamentName} Page!</p>
}
