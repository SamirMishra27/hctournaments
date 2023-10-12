import { revalidateTag } from 'next/cache'
import AdminEditPage from './edit-admins'
import { AdminState } from '@/types/states'
import { getAdminsData, putAdminsData } from '@/api'
import { getDiscordUser, isSiteAdmin } from '@/serverActions'
import { redirect } from 'next/navigation'
import Header from '@/components/Header'

export default async function Page() {
    const [loggedIn, discordUser] = await getDiscordUser()
    if (!loggedIn || !discordUser) redirect('/login')

    const isAdmin = await isSiteAdmin(discordUser.id)
    if (!isAdmin) redirect('/')

    // First thing to check if the admin edit page has not been disabled in the .env
    if (process.env.DISABLE_ADMIN_MANAGE_PANEL === 'true')
        return (
            <main className=" w-full flex flex-col items-center justify-center bg-full-white text-center py-48 capitalize">
                <h1 className=" px-3 text-5xl font-medium text-gray-800 max-w-2xl">
                    The Admin management panel is disabled
                </h1>
                <p className=" px-2 text-base font-normal text-gray-500">
                    Site Admins cannot be managed right now
                </p>
            </main>
        )

    async function sendDataForUpdate(
        state: AdminState[],
        deleted: AdminState[]
    ): Promise<AdminState[]> {
        'use server'
        await putAdminsData(state, deleted)

        revalidateTag('admins')
        const updatedState = await getAdminsData()

        return updatedState
    }

    const adminState = await getAdminsData()
    const pathways = [
        ['Admin', '/admin'],
        ['Dashboard', '/admin/dashboard'],
        ['Edit', '/admin/dashboard/edit']
    ]

    return (
        <>
            <Header pathways={pathways} />
            <AdminEditPage admins={adminState} sendData={sendDataForUpdate} />
        </>
    )
}
