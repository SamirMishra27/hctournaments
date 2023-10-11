import { ReactNode, Fragment } from 'react'
import CustomToaster from '@/components/CustomToaster'

export default function EditHostsLayout(props: { children: ReactNode }) {
    return (
        <Fragment>
            <CustomToaster />
            {props.children}
        </Fragment>
    )
}
