'use client'

import { useState, useReducer } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import MotionDialog from '@/components/MotionDialog'
import ErrorBox from '@/components/ErrorBox'
import { getUniqueId } from '@/utils'
import { HostState, TournamentState } from '@/types/states'
import { AnimatePresence } from 'framer-motion'
import { hostsReducer } from '@/hooks/reducers'
import Link from 'next/link'
import FormControls from '@/components/FormActions'
import RowActions from '@/components/RowActions'
import { toast } from 'sonner'
import useEscapeKey from '@/hooks/useEscapeKey'

function HostEditView(props: {
    editingHost: HostState
    setEditingHost: (data: HostState | undefined) => void
    updateState: (data: HostState) => void
    deleteState: (data: HostState) => void
}) {
    const { editingHost, setEditingHost, updateState, deleteState } = props

    const baseStringSchema = Yup.string().required("This can't be empty")

    const nameSchema = baseStringSchema
        .max(50, 'Max length should be 50 characters')
        .matches(/^[a-zA-Z0-9._]+$/, "Don't use invalid characters")

    const userIdSchema = baseStringSchema
        .min(17, 'Enter valid ID!')
        .max(19, 'Enter valid ID!')
        .matches(/^\d{17,19}$/, 'Enter valid ID!')

    const validationSchema = Yup.object().shape({
        userId: userIdSchema,
        name: nameSchema,
        username: nameSchema,
        avatarUrl: baseStringSchema.matches(/^https?:\/\/[^\s/$.?#].[^\s]*$/, 'Must be a URL!')
    })

    useEscapeKey(() => {
        if (editingHost.created && !editingHost.userId) deleteState(editingHost)
        setEditingHost(undefined)
    })

    return (
        <MotionDialog>
            <Formik
                initialValues={editingHost}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    updateState(values)
                    setEditingHost(undefined)
                }}>
                {({ errors }) => (
                    <Form
                        className=" flex flex-col items-start justify-evenly text-sm font-normal text-gray-800 uppercase dark:text-slate-100 transition"
                        autoComplete="off">
                        <div className=" w-full py-2 relative">
                            <div className=" font-semibold normal-case">User Id</div>
                            <Field
                                name="userId"
                                className=" w-full border-2 border-dim-white rounded p-1 dark:bg-bright-navy/25 dark:border-bright-navy transition"
                            />
                            <ErrorBox message={errors.userId} />
                        </div>
                        <div className=" w-full py-2 relative">
                            <div className=" font-semibold normal-case">Name</div>
                            <Field
                                name="name"
                                className=" w-full border-2 border-dim-white rounded p-1 dark:bg-bright-navy/25 dark:border-bright-navy transition"
                            />
                            <ErrorBox message={errors.name} />
                        </div>
                        <div className=" w-full py-2 relative">
                            <div className=" font-semibold normal-case">Username</div>
                            <Field
                                name="username"
                                className=" w-full border-2 border-dim-white rounded p-1 dark:bg-bright-navy/25 dark:border-bright-navy transition"
                            />
                            <ErrorBox message={errors.username} />
                        </div>
                        <div className=" w-full py-2 relative">
                            <div className=" font-semibold normal-case">Avatar Url</div>
                            <Field
                                name="avatarUrl"
                                className=" w-full border-2 border-dim-white rounded p-1 dark:bg-bright-navy/25 dark:border-bright-navy transition"
                            />
                            <ErrorBox message={errors.avatarUrl} />
                        </div>
                        <FormControls
                            onCancelClick={() => {
                                if (editingHost.created && !editingHost.userId)
                                    deleteState(editingHost)
                                setEditingHost(undefined)
                            }}
                        />
                    </Form>
                )}
            </Formik>
        </MotionDialog>
    )
}

function HostsView(props: {
    state: HostState
    deleteState: (data: HostState) => void
    setEditingHost: (data: HostState) => void
}) {
    const { state, deleteState } = props

    return (
        <tr className=" text-sm font-normal text-gray-800 border-y-2 border-dim-white odd:bg-slate-50/20 even:bg-slate-50/40 dark:text-slate-100 dark:border-bright-navy dark:odd:bg-bright-navy/20 dark:even:bg-bright-navy/40 transition">
            <td className=" p-2">{state.userId}</td>
            <td className=" p-2 uppercase">{state.name}</td>
            <td className=" p-2">{state.username}</td>
            <td className=" p-2 w-80">
                {state.avatarUrl.length ? (
                    <Link
                        href={state.avatarUrl}
                        className=" text-blue-500 hover:underline break-all"
                        target="_blank">
                        {state.avatarUrl}
                    </Link>
                ) : (
                    ''
                )}
            </td>
            <td className=" bg-night-blue">
                <RowActions
                    onEditClick={() => props.setEditingHost(state)}
                    onDeleteClick={() => deleteState(state)}
                />
            </td>
        </tr>
    )
}

export default function HostsEditPage(props: {
    hosts: HostState[]
    tournamentId: string
    tournamentInfo: TournamentState
    sendData: (state: HostState[], deleted: HostState[]) => Promise<HostState[]>
}) {
    let hostsOriginal = props.hosts

    const [updating, setUpdating] = useState(false)
    const [hosts, dispatch] = useReducer(hostsReducer, hostsOriginal)

    const [deleted, setDeleted] = useState<HostState[]>([])

    const [editingHost, setEditingHost] = useState<HostState>()

    function createState() {
        const newHost: HostState = {
            rowId: getUniqueId(),
            tournamentId: props.tournamentId,

            userId: '',
            name: '',
            username: '',
            avatarUrl: ''
        }
        dispatch({ type: 'CREATE', data: newHost })
        setEditingHost(newHost)
    }

    function updateState(newHost: HostState) {
        dispatch({ type: 'UPDATE', data: newHost })
    }

    function deleteState(hostData: HostState) {
        if (!hostData.created) setDeleted([...deleted, hostData])
        dispatch({ type: 'DELETE', data: hostData })
    }

    function resetState() {
        dispatch({ type: 'RESET', data: hostsOriginal[0], originalData: [...hostsOriginal] })
        setDeleted([])
    }

    async function updateData() {
        setUpdating(true)
        try {
            const newHost = await props.sendData(hosts, deleted)
            hostsOriginal = newHost

            resetState()
            toast.success('Successfully updated hosts!')
        } catch {
            toast.error('Failed to update hosts. A server error ocurred!')
        }
        setUpdating(false)
    }

    return (
        <main className=" w-full flex flex-col items-center justify-center bg-full-white dark:bg-dark-navy transition py-12">
            <AnimatePresence>
                {editingHost && (
                    <HostEditView
                        editingHost={editingHost}
                        setEditingHost={setEditingHost}
                        updateState={updateState}
                        deleteState={deleteState}
                    />
                )}
            </AnimatePresence>
            <section className=" max-w-[60rem] w-full flex items-center justify-between text-gray-800 dark:text-slate-100 transition px-6">
                <div className=" flex flex-col items-start justify-evenly">
                    <h1 className=" font-medium text-xl sm:text-2xl md:text-3xl">
                        Manage Tournament
                    </h1>
                    <h3 className=" text-base md:text-xl">Hosts</h3>
                </div>
                <div className=" flex flex-col items-end justify-evenly">
                    <h2 className=" text-xl sm:text-2xl md:text-3xl text-right">
                        {props.tournamentInfo.tournamentName}
                    </h2>
                    <h3 className=" text-base md:text-xl">
                        Season {props.tournamentInfo.seasonNo}
                    </h3>
                </div>
            </section>
            <div className=" divider-vertical w-full h-px bg-dim-white dark:bg-bright-navy transition mt-6" />
            <section className=" w-full flex flex-col items-center justify-evenly overflow-x-auto px-2 md:px-4 my-16">
                <div className=" w-full max-w-[72rem] join flex items-center justify-end py-2">
                    <button
                        className={
                            ' join-item btn no-animation uppercase h-8 px-2 text-xs min-h-0 min-w-[4rem] border border-gray-300 ' +
                            'hover:bg-orange-gold hover:text-full-white hover:font-semibold active:bg-orange-gold/80 ' +
                            'disabled:bg-gray-300 disabled:text-gray-800/50'
                        }
                        disabled={updating}
                        onClick={() => updateData()}>
                        {updating ? (
                            <>
                                <span>Updating</span>
                                <span className=" loading loading-spinner loading-sm" />
                            </>
                        ) : (
                            'Update'
                        )}
                    </button>
                    <button
                        className={
                            ' join-item btn no-animation uppercase h-8 px-2 text-xs min-h-0 min-w-[4rem] border border-gray-300 ' +
                            'hover:bg-red-500 hover:text-full-white hover:font-semibold active:bg-red-500/80 ' +
                            'disabled:bg-gray-300 disabled:text-gray-800/50 disabled:border-l-gray-400'
                        }
                        disabled={updating}
                        onClick={() => resetState()}>
                        Reset
                    </button>
                </div>
                <table className=" w-[72rem] m-auto mb-4">
                    <thead className=" text-xs font-medium text-gray-700 p-2 mb-2 text-left dark:text-slate-100 transition">
                        <tr className=" [&>th]:p-2">
                            <th>User Id</th>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Avatar Url</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hosts.map((host) => (
                            <HostsView
                                state={host}
                                deleteState={deleteState}
                                setEditingHost={setEditingHost}
                                key={host.rowId}
                            />
                        ))}
                    </tbody>
                </table>
                <button
                    className={
                        ' btn btn-block no-animation uppercase h-8 px-2 text-base min-h-0 max-w-[72rem]' +
                        ' hover:bg-orange-gold hover:text-full-white hover:font-semibold active:bg-orange-gold/80'
                    }
                    onClick={() => createState()}>
                    Add New
                </button>
            </section>
        </main>
    )
}
