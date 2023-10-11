import { ReactNode, Fragment } from 'react'

export default function MatchesLayout(props: { children: ReactNode }) {
    return <Fragment>{props.children}</Fragment>
}
