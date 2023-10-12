import { ReactNode, Fragment } from 'react'
import { Metadata } from 'next'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
    title: 'Browse hctournaments',
    description: 'See all upcoming and past tournaments ever happened'
}

export default function TournamentsLayout(props: { children: ReactNode }) {
    return (
        <Fragment>
            {props.children}
            <Footer />
        </Fragment>
    )
}
