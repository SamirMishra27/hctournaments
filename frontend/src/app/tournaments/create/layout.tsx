import { ReactNode, Fragment } from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Create New Tournament | hctournaments'
}

export default function CreateTournamentLayout(props: { children: ReactNode }) {
    return <Fragment>{props.children}</Fragment>
}
