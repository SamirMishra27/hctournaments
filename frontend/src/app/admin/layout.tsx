import { ReactNode, Fragment } from 'react'

export default function AdminLayout(props: { children: ReactNode }) {
    return <Fragment>{props.children}</Fragment>
}
