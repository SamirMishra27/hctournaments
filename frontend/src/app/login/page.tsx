import { redirect } from 'next/navigation'
import { getDiscordUser } from '@/serverActions'

export default async function Page(props: { searchParams: { redirect_to: string } }) {
    const { redirect_to } = props.searchParams
    const [loggedIn, discordUser] = await getDiscordUser()

    if (loggedIn && discordUser) {
        if (!redirect_to) redirect('/')
        else redirect(redirect_to)
    }

    redirect(process.env.DISCORD_OAUTH_URL as string)
}
