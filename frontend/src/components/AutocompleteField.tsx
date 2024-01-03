'use client'

import { useState, useEffect, KeyboardEvent } from 'react'
import { Field } from 'formik'
import ErrorBox from './ErrorBox'

export default function AutocompleteField(props: {
    keyName: string
    extraClassNames?: string
    errorMessage?: string
    options: string[]
    setFieldValue: (field: string, value: string) => void
    transformer?: (value: string) => string
}) {
    const {
        keyName,
        extraClassNames = '',
        errorMessage,
        options,
        setFieldValue,
        transformer
    } = props

    const [showOptions, setShowOptions] = useState(false)
    const [currIndex, setCurrIndex] = useState(0)

    function insertValue(value: string) {
        setFieldValue(keyName, transformer ? transformer(value) : value)
        setShowOptions(false)
    }

    useEffect(() => {
        const onKeyDown = (e: globalThis.KeyboardEvent) => {
            if (!showOptions) return

            if (e.code === 'ArrowDown') {
                if (currIndex === options.length - 1 || currIndex >= options.length) setCurrIndex(0)
                else setCurrIndex(currIndex + 1)
                e.preventDefault()
            }
            //
            else if (e.code === 'ArrowUp') {
                if (currIndex === 0 || currIndex >= options.length) setCurrIndex(options.length - 1)
                else setCurrIndex(currIndex - 1)
                e.preventDefault()
            }
            //
            else if (e.code === 'Enter') {
                insertValue(options[currIndex])
                e.preventDefault()
            }
        }

        document.addEventListener('keydown', onKeyDown)

        return () => document.removeEventListener('keydown', onKeyDown)
    }, [showOptions, currIndex])

    return (
        <>
            {showOptions && (
                <ul className=" w-full absolute top-16 flex flex-col items-center bg-zinc-200 dark:bg-zinc-700 rounded join join-vertical z-10 normal-case">
                    {options.map((option, index) => (
                        <li
                            key={option}
                            data-option={option}
                            className={
                                ' w-full join-item text-left p-1 cursor-pointer' +
                                (index === currIndex ? ' bg-zinc-300 dark:bg-bright-navy' : '')
                            }
                            onFocus={(e) => e.currentTarget.scrollIntoView()}
                            onMouseDown={(e) =>
                                insertValue(e.currentTarget.dataset.option as string)
                            }
                            onMouseEnter={() => setCurrIndex(index)}
                            onMouseLeave={() => setCurrIndex(0)}>
                            {option}
                        </li>
                    ))}
                </ul>
            )}
            <Field
                name={keyName}
                className={
                    ' w-full border-2 border-dim-white rounded p-1 transition uppercase' +
                    ' dark:bg-bright-navy/25 dark:border-bright-navy' +
                    extraClassNames
                }
                onFocus={() => setShowOptions(true)}
                onBlur={() => setShowOptions(false)}
                onChange={(e: KeyboardEvent<HTMLInputElement>) => {
                    const value = e.currentTarget.value
                    setFieldValue(keyName, transformer ? transformer(value) : value)
                    if (!showOptions) setShowOptions(true)
                }}
            />
            <ErrorBox message={errorMessage} />
        </>
    )
}
