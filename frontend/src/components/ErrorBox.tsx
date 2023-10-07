'use client'

export default function ErrorBox(props: { message: string | undefined }) {
    if (!props.message) return <div />

    return (
        <div
            className={
                ' absolute text-sm text-white normal-case h-auto ' +
                'overflow-clip whitespace-nowrap text-ellipsis top-0 ' +
                'py-0.5 px-1 bg-rose-500 font-medium rounded ' +
                'transition duration-200'
            }>
            {props.message}
        </div>
    )
}
