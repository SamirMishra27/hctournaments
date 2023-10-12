import { ReactNode, Fragment } from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Redirecting...',
    description: ''
}

export default function VerifyLoginLayout(props: { children: ReactNode }) {
    return <Fragment>{props.children}</Fragment>
}
