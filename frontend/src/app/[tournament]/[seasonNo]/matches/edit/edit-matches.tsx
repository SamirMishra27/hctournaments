'use client'

import { useState, useReducer } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import MotionDialog from '@/components/MotionDialog'
import ErrorBox from '@/components/ErrorBox'
import { getUniqueId } from '@/utils'
import { MatchState, TournamentState } from '@/types/states'
import { matchesReducer } from '@/hooks/reducers'
import { AnimatePresence } from 'framer-motion'
import { MatchStatus } from '@/types/constants'
import FormControls from '@/components/FormActions'
import RowActions from '@/components/RowActions'
import { toast } from 'sonner'
import useEscapeKey from '@/hooks/useEscapeKey'

function MatchEditView(props: {
    editingMatch: MatchState
    setEditingMatch: (data: MatchState | undefined) => void
    updateState: (data: MatchState) => void
    deleteState: (data: MatchState) => void
}) {
    const { editingMatch, updateState, deleteState, setEditingMatch } = props

    const matchStatus: MatchStatus[] = ['PENDING', 'DONE']

    const baseStringSchema = Yup.string()
        .min(2, 'Min length should be 2 characters')
        .matches(/^[a-zA-Z0-9._\s\W]+$/, "Don't use invalid characters")
        .required("This can't be empty")

    const teamNameSchema = baseStringSchema.max(100, 'Value must be less than 100')

    const baseNumberSchema = Yup.number()
        .min(0, 'Value must be positive')
        .required("This can't be empty")

    const baseIntegerSchema = baseNumberSchema.integer('Must not have decimals')

    const validationSchema = Yup.object().shape({
        title: baseStringSchema.max(100, 'Maximum length is 100'),
        description: baseStringSchema.max(500, 'Maximum length is 500 characters'),
        status: baseStringSchema.max(50, 'Maximum length is 50 characters').oneOf(matchStatus),

        teamAName: teamNameSchema,
        teamARuns: baseIntegerSchema.max(1000, 'Value must be less than 1000'),
        teamAOvers: baseNumberSchema.max(50, 'Value must be less than 50'),
        teamAWickets: baseIntegerSchema.max(20, 'Value must be less than 20'),

        teamBName: teamNameSchema,
        teamBRuns: baseIntegerSchema.max(1000, 'Value must be less than 1000'),
        teamBOvers: baseNumberSchema.max(50, 'Value must be less than 50'),
        teamBWickets: baseIntegerSchema.max(20, 'Value must be less than 20'),

        winnerName: teamNameSchema
    })

    useEscapeKey(() => {
        if (editingMatch.created && !editingMatch.title) deleteState(editingMatch)
        setEditingMatch(undefined)
    })

    return (
        <MotionDialog>
            <Formik
                initialValues={editingMatch}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    updateState(values)
                    setEditingMatch(undefined)
                }}>
                {({ errors }) => (
                    <Form
                        className=" flex flex-col items-start justify-evenly text-sm font-normal text-gray-800 uppercase dark:text-slate-100 transition"
                        autoComplete="off">
                        <div className=" w-full py-2 relative">
                            <div className=" font-semibold normal-case">Title</div>
                            <Field
                                name="title"
                                className=" w-full border-2 border-dim-white rounded p-1 dark:bg-bright-navy/25 dark:border-bright-navy transition"
                            />
                            <ErrorBox message={errors.title} />
                        </div>
                        <div className=" w-full py-2 relative">
                            <div className=" font-semibold normal-case">Description</div>
                            <Field
                                as="textarea"
                                name="description"
                                rows="3"
                                cols="30"
                                className=" border-2 border-dim-white rounded p-1 dark:bg-bright-navy/25 dark:border-bright-navy transition"
                            />
                            <ErrorBox message={errors.description} />
                        </div>
                        <div className=" w-full py-2 relative">
                            <div className=" font-semibold normal-case">Status</div>
                            <Field
                                as="select"
                                name="status"
                                className=" w-full border-2 border-dim-white rounded p-1 dark:bg-bright-navy/25 dark:border-bright-navy transition">
                                <option value="PENDING">PENDING</option>
                                <option value="DONE">DONE</option>
                            </Field>
                            <ErrorBox message={errors.status} />
                        </div>
                        <div className=" w-full py-2 relative">
                            <div className=" font-semibold normal-case">Home Team</div>
                            <Field
                                name="teamAName"
                                className=" w-full border-2 border-dim-white rounded p-1 dark:bg-bright-navy/25 dark:border-bright-navy transition"
                            />
                            <ErrorBox message={errors.teamAName} />
                        </div>
                        <div className=" flex items-center justify-evenly space-x-2">
                            <div className=" w-full py-2 relative">
                                <div className=" font-semibold normal-case">Runs</div>
                                <Field
                                    name="teamARuns"
                                    type="number"
                                    className=" w-20 border-2 border-dim-white rounded p-1 dark:bg-bright-navy/25 dark:border-bright-navy transition"
                                />
                                <ErrorBox message={errors.teamARuns} />
                            </div>
                            <div className=" w-full py-2 relative">
                                <div className=" font-semibold normal-case">Wickets</div>
                                <Field
                                    name="teamAWickets"
                                    type="number"
                                    className=" w-20 border-2 border-dim-white rounded p-1 dark:bg-bright-navy/25 dark:border-bright-navy transition"
                                />
                                <ErrorBox message={errors.teamAOvers} />
                            </div>
                            <div className=" w-full py-2 relative">
                                <div className=" font-semibold normal-case">Overs</div>
                                <Field
                                    name="teamAOvers"
                                    type="number"
                                    step="0.1"
                                    className=" w-20 border-2 border-dim-white rounded p-1 dark:bg-bright-navy/25 dark:border-bright-navy transition"
                                />
                                <ErrorBox message={errors.teamAWickets} />
                            </div>
                        </div>
                        <div className=" w-full py-2 relative">
                            <div className=" font-semibold normal-case">Away Team</div>
                            <Field
                                name="teamBName"
                                className=" w-full border-2 border-dim-white rounded p-1 dark:bg-bright-navy/25 dark:border-bright-navy transition"
                            />
                            <ErrorBox message={errors.teamBName} />
                        </div>
                        <div className=" flex items-center justify-evenly space-x-2">
                            <div className=" w-full py-2 relative">
                                <div className=" font-semibold normal-case">Runs</div>
                                <Field
                                    name="teamBRuns"
                                    type="number"
                                    className=" w-20 border-2 border-dim-white rounded p-1 dark:bg-bright-navy/25 dark:border-bright-navy transition"
                                />
                                <ErrorBox message={errors.teamBRuns} />
                            </div>
                            <div className=" w-full py-2 relative">
                                <div className=" font-semibold normal-case">Wickets</div>
                                <Field
                                    name="teamBWickets"
                                    type="number"
                                    className=" w-20 border-2 border-dim-white rounded p-1 dark:bg-bright-navy/25 dark:border-bright-navy transition"
                                />
                                <ErrorBox message={errors.teamBWickets} />
                            </div>
                            <div className=" w-full py-2 relative">
                                <div className=" font-semibold normal-case">Overs</div>
                                <Field
                                    name="teamBOvers"
                                    type="number"
                                    step="0.1"
                                    className=" w-20 border-2 border-dim-white rounded p-1 dark:bg-bright-navy/25 dark:border-bright-navy transition"
                                />
                                <ErrorBox message={errors.teamBOvers} />
                            </div>
                        </div>
                        <div className=" w-full py-2 relative">
                            <div className=" font-semibold normal-case">Winner</div>
                            <Field
                                name="winnerName"
                                className=" w-full border-2 border-dim-white rounded p-1 dark:bg-bright-navy/25 dark:border-bright-navy transition"
                            />
                            <ErrorBox message={errors.winnerName} />
                        </div>
                        <FormControls
                            onCancelClick={() => {
                                if (editingMatch.created && !editingMatch.title)
                                    deleteState(editingMatch)
                                setEditingMatch(undefined)
                            }}
                        />
                    </Form>
                )}
            </Formik>
        </MotionDialog>
    )
}

function MatchesView(props: {
    state: MatchState
    deleteState: (data: MatchState) => void
    setEditingMatch: (data: MatchState) => void
}) {
    const { state, deleteState } = props

    return (
        <tr className=" text-sm font-normal text-gray-800 uppercase border-y-2 border-dim-white odd:bg-slate-50/20 even:bg-slate-50/40 dark:text-slate-100 dark:border-bright-navy dark:odd:bg-bright-navy/20 dark:even:bg-bright-navy/40 transition">
            <td className=" p-2">{state.title}</td>
            <td className=" p-2">
                <div className=" max-w-[8rem] max-h-24 line-clamp-3 normal-case">
                    {state.description}
                </div>
            </td>
            <td className=" p-2">{state.status}</td>
            <td className=" p-2">{state.teamAName}</td>
            <td className=" p-2">{state.teamARuns}</td>
            <td className=" p-2">{state.teamAOvers}</td>
            <td className=" p-2">{state.teamAWickets}</td>
            <td className=" p-2">{state.teamBName}</td>
            <td className=" p-2">{state.teamBRuns}</td>
            <td className=" p-2">{state.teamBOvers}</td>
            <td className=" p-2">{state.teamBWickets}</td>
            <td className=" p-2">{state.winnerName}</td>
            <td className=" bg-night-blue">
                <RowActions
                    onEditClick={() => props.setEditingMatch(state)}
                    onDeleteClick={() => deleteState(state)}
                />
            </td>
        </tr>
    )
}

export default function MatchesEditPage(props: {
    matches: MatchState[]
    tournamentId: string
    tournamentInfo: TournamentState
    sendData: (state: MatchState[], deleted: MatchState[]) => Promise<MatchState[]>
}) {
    let matchesOriginal = props.matches

    const [updating, setUpdating] = useState(false)
    const [matches, dispatch] = useReducer(matchesReducer, matchesOriginal)

    const [deleted, setDeleted] = useState<MatchState[]>([])

    const [editingMatch, setEditingMatch] = useState<MatchState>()

    function createState() {
        const newMatch: MatchState = {
            matchId: getUniqueId(),
            tournamentId: props.tournamentId,

            title: '',
            description: '',
            status: 'PENDING',

            teamAName: '',
            teamARuns: 0,
            teamAOvers: 0,
            teamAWickets: 0,

            teamBName: '',
            teamBRuns: 0,
            teamBOvers: 0,
            teamBWickets: 0,
            winnerName: ''
        }
        dispatch({ type: 'CREATE', data: newMatch })
        setEditingMatch(newMatch)
    }

    function updateState(newMatch: MatchState) {
        dispatch({ type: 'UPDATE', data: newMatch })
    }

    function deleteState(matchData: MatchState) {
        if (!matchData.created) setDeleted([...deleted, matchData])
        dispatch({ type: 'DELETE', data: matchData })
    }

    function resetState() {
        dispatch({ type: 'RESET', data: matchesOriginal[0], originalData: [...matchesOriginal] })
        setDeleted([])
    }

    async function updateData() {
        setUpdating(true)
        try {
            const newState = await props.sendData(matches, deleted)
            matchesOriginal = newState

            resetState()
            toast.success('Successfully updated matches!')
        } catch {
            toast.error('Failed to update matches. A server error ocurred!')
        }
        setUpdating(false)
    }

    return (
        <main className=" w-full flex flex-col items-center justify-center bg-full-white dark:bg-dark-navy transition py-12">
            <AnimatePresence>
                {editingMatch && (
                    <MatchEditView
                        editingMatch={editingMatch}
                        setEditingMatch={setEditingMatch}
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
                    <h3 className=" text-base md:text-xl">Matches</h3>
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
                            <th>Title</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Home Team</th>
                            <th>Runs</th>
                            <th>Wickets</th>
                            <th>Overs</th>
                            <th>Away Team</th>
                            <th>Runs</th>
                            <th>Wickets</th>
                            <th>Overs</th>
                            <th>Winner</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {matches.map((match) => (
                            <MatchesView
                                state={match}
                                deleteState={deleteState}
                                setEditingMatch={setEditingMatch}
                                key={match.matchId}
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
