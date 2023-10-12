import { ReactNode, Fragment } from 'react'
import Footer from '@/components/Footer'

export default function TournamentOverviewLayout(props: { children: ReactNode }) {
    return (
        <Fragment>
            {props.children}
            <Footer />
        </Fragment>
    )
}
