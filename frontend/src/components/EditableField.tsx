'use client'

import ErrorBox from './ErrorBox'
import { Field } from 'formik'

export default function EditableField(props: {
    labelName: string
    keyName: string
    canEdit?: boolean
    extraClassNames?: string
    errorMessage?: string
    type?: string
}) {
    const {
        labelName,
        keyName,
        canEdit = true,
        extraClassNames = '',
        errorMessage = '',
        type = 'text'
    } = props

    return (
        <div className=" w-full flex items-center justify-evenly pl-1 md:pl-4 pr-1 md:pr-2 py-2 my-2 text-sm md:text-base transition">
            <strong aria-label={labelName} className=" w-1/2 md:w-[22rem]">
                {labelName}
            </strong>
            <div className=" w-1/2 md:w-80 h-auto flex-1 break-all relative">
                <Field
                    type={type}
                    readOnly={!canEdit}
                    name={keyName}
                    className={
                        ' w-full h-full pl-2 py-1 mb-1 border-dim-white rounded dark:border-bright-navy transition' +
                        extraClassNames +
                        (!canEdit
                            ? ' bg-gray-100 cursor-not-allowed text-black/50 dark:bg-bright-navy dark:text-white/50'
                            : ' text-gray-800 border-2 dark:bg-bright-navy/25 dark:text-slate-100')
                    }
                />
                <ErrorBox message={errorMessage} />
            </div>
        </div>
    )
}
