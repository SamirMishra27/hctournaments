import { ReactNode, Fragment } from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'login to hctournaments',
    description: ''
}

export default function LoginLayout(props: { children: ReactNode }) {
    return <Fragment>{props.children}</Fragment>
}
