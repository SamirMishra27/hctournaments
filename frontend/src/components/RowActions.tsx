'use client'

import Image from 'next/image'
import editIcon from '@assets/edit-pen.svg'
import deleteIcon from '@assets/delete-trash.svg'

export default function RowActions(props: { onEditClick: () => void; onDeleteClick: () => void }) {
    return (
        <div className=" w-16 h-full flex items-center justify-center text-sm font-medium text-white gap-x-1 m-auto">
            <button
                className=" transition-all rounded-full"
                aria-label="Edit"
                onClick={props.onEditClick}>
                <Image
                    src={editIcon}
                    alt="edit"
                    className=" w-8 h-auto flex p-1.5"
                    quality={100}
                    width={128}
                    height={128}
                />
            </button>
            <button
                className=" transition-all rounded-full"
                aria-label="Delete"
                onClick={props.onDeleteClick}>
                <Image
                    src={deleteIcon}
                    alt="delete"
                    className=" w-8 h-auto flex p-1.5"
                    quality={100}
                    width={128}
                    height={128}
                />
            </button>
        </div>
    )
}
