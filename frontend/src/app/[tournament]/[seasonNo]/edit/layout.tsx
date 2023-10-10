import { ReactNode, Fragment } from 'react'
import CustomToaster from '@/components/CustomToaster'

export default function TournamentInfoEditLayout(props: { children: ReactNode }) {
    return (
        <Fragment>
            <CustomToaster />
            {props.children}
        </Fragment>
    )
}
