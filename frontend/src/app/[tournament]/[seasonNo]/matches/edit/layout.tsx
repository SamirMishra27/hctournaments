import { ReactNode, Fragment } from 'react'
import CustomToaster from '@/components/CustomToaster'

export default function MatchesEditLayout(props: { children: ReactNode }) {
    return (
        <Fragment>
            <CustomToaster />
            {props.children}
        </Fragment>
    )
}
