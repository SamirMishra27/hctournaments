'use client'

export default function FormControls(props: {
    saveButtonClassName?: string
    cancelButtonClassName?: string
    onCancelClick: () => void
}) {
    const { saveButtonClassName = '', cancelButtonClassName = '', onCancelClick } = props

    return (
        <div className=" join w-full flex items-center justify-end space-x-2 pt-4">
            <button
                className={
                    ' btn no-animation uppercase h-8 px-3 text-xs min-h-0 min-w-[4rem] ' +
                    'bg-white hover:text-full-white hover:font-semibold ' +
                    'hover:bg-green-500 active:bg-green-500/80 rounded-md shadow-sm ' +
                    ' dark:bg-bright-navy dark:text-slate-100 dark:border-bright-navy' +
                    ' dark:hover:bg-green-500 dark:active:bg-green-500/80 dark:shadow-slate-400' +
                    saveButtonClassName
                }
                type="submit">
                Save
            </button>
            <button
                className={
                    ' btn no-animation uppercase h-8 px-3 text-xs min-h-0 min-w-[4rem] ' +
                    'bg-white hover:text-full-white hover:font-semibold ' +
                    'hover:bg-red-500 active:bg-red-500/80 rounded-md shadow-sm ' +
                    ' dark:bg-bright-navy dark:text-slate-100 dark:border-bright-navy' +
                    ' dark:hover:bg-red-500 dark:active:bg-red-500/80 dark:shadow-slate-400' +
                    cancelButtonClassName
                }
                onClick={onCancelClick}>
                Cancel
            </button>
        </div>
    )
}
