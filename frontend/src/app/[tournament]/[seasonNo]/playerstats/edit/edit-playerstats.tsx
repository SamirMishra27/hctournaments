'use client'

import { useState, useReducer } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import MotionDialog from '@/components/MotionDialog'
import ErrorBox from '@/components/ErrorBox'
import { getUniqueId } from '@/utils'
import { PlayerStatisticState, TournamentState } from '@/types/states'
import { playerStatsReducer } from '@/hooks/reducers'
import { AnimatePresence } from 'framer-motion'
import { isEqual } from 'lodash'
import FormControls from '@/components/FormActions'
import RowActions from '@/components/RowActions'
import { toast } from 'sonner'
import useEscapeKey from '@/hooks/useEscapeKey'

function BulkEditorView(props: {
    processBulkInput: (input: string) => void
    setBulkEditorDisplay: (arg: boolean) => void
}) {
    const validationSchema = Yup.object().shape({
        textInput: Yup.string()
            .min(10)
            .required('This is required!')
            .matches(/^[a-zA-Z0-9|,._\s]+$/, "Don't use invalid characters")
    })

    useEscapeKey(() => props.setBulkEditorDisplay(false))

    return (
        <MotionDialog>
            <Formik
                initialValues={{ textInput: '' }}
                validationSchema={validationSchema}
                onSubmit={(values) => props.processBulkInput(values.textInput)}>
                {({ errors }) => (
                    <Form
                        className=" flex flex-col items-start justify-evenly text-sm font-normal text-gray-800 uppercase dark:text-slate-100"
                        autoComplete="off">
                        <Field
                            name="textInput"
                            as="textarea"
                            className=" w-full border-2 border-dim-white rounded p-1 font-mono  dark:bg-bright-navy/25 dark:border-bright-navy transition"
                            cols="60"
                            rows="20"
                        />
                        <ErrorBox message={errors.textInput} />
                        <FormControls onCancelClick={() => props.setBulkEditorDisplay(false)} />
                    </Form>
                )}
            </Formik>
        </MotionDialog>
    )
}

function PlayerEditView(props: {
    editingPlayer: PlayerStatisticState
    setEditingPlayer: (data: PlayerStatisticState | undefined) => void
    updateState: (data: PlayerStatisticState) => void
    deleteState: (data: PlayerStatisticState) => void
}) {
    const { editingPlayer, updateState, deleteState, setEditingPlayer } = props

    const baseNumberSchema = Yup.number()
        .min(0, 'Value must be positive')
        .max(5000, 'Value must be less than 5000')
        .integer('Must not have decimals')
        .required("This can't be empty")

    const validationSchema = Yup.object().shape({
        userId: Yup.string()
            .min(17, 'Enter valid ID!')
            .max(19, 'Enter valid ID!')
            .required("Must enter player's Discord User ID!")
            .matches(/^\d{17,19}$/, 'Enter valid ID!'),
        playerName: Yup.string()
            .min(1, 'Min length should be 3 characters')
            .max(50, 'Max length should be 50 characters')
            .required("Must enter player's name!")
            .matches(/^[a-zA-Z0-9._]+$/, "Don't use invalid characters"),
        runs: baseNumberSchema,
        balls: baseNumberSchema,
        runsGiven: baseNumberSchema,
        ballsGiven: baseNumberSchema,
        wickets: baseNumberSchema.max(1000, 'Value must be less than 1000')
    })

    useEscapeKey(() => {
        if (editingPlayer.created && !editingPlayer.userId) deleteState(editingPlayer)
        setEditingPlayer(undefined)
    })

    return (
        <MotionDialog>
            <Formik
                initialValues={editingPlayer}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    updateState(values)
                    setEditingPlayer(undefined)
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
                        <div className=" w-full py-2  relative">
                            <div className=" font-semibold normal-case">Player Name</div>
                            <Field
                                name="playerName"
                                className=" w-full border-2 border-dim-white rounded p-1 dark:bg-bright-navy/25 dark:border-bright-navy transition"
                            />
                            <ErrorBox message={errors.playerName} />
                        </div>
                        <div className=" w-full py-2 relative">
                            <div className=" font-semibold normal-case">Runs</div>
                            <Field
                                name="runs"
                                type="number"
                                className=" w-full border-2 border-dim-white rounded p-1 dark:bg-bright-navy/25 dark:border-bright-navy transition"
                            />
                            <ErrorBox message={errors.runs} />
                        </div>
                        <div className=" w-full py-2 relative">
                            <div className=" font-semibold normal-case">Balls</div>
                            <Field
                                name="balls"
                                type="number"
                                className=" w-full border-2 border-dim-white rounded p-1 dark:bg-bright-navy/25 dark:border-bright-navy transition"
                            />
                            <ErrorBox message={errors.balls} />
                        </div>
                        <div className=" w-full py-2 relative">
                            <div className=" font-semibold normal-case">Runs Given</div>
                            <Field
                                name="runsGiven"
                                type="number"
                                className=" w-full border-2 border-dim-white rounded p-1 dark:bg-bright-navy/25 dark:border-bright-navy transition"
                            />
                            <ErrorBox message={errors.runsGiven} />
                        </div>
                        <div className=" w-full py-2 relative">
                            <div className=" font-semibold normal-case">Balls Given</div>
                            <Field
                                name="ballsGiven"
                                type="number"
                                className=" w-full border-2 border-dim-white rounded p-1 dark:bg-bright-navy/25 dark:border-bright-navy transition"
                            />
                            <ErrorBox message={errors.ballsGiven} />
                        </div>
                        <div className=" w-full py-2 relative">
                            <div className=" font-semibold normal-case">Wickets</div>
                            <Field
                                name="wickets"
                                type="number"
                                className=" w-full border-2 border-dim-white rounded p-1 dark:bg-bright-navy/25 dark:border-bright-navy transition"
                            />
                            <ErrorBox message={errors.wickets} />
                        </div>
                        <div className=" join w-full flex items-center justify-end max-w-xs space-x-2 pt-4">
                            <FormControls
                                onCancelClick={() => {
                                    if (editingPlayer.created && !editingPlayer.userId)
                                        deleteState(editingPlayer)
                                    setEditingPlayer(undefined)
                                }}
                            />
                        </div>
                    </Form>
                )}
            </Formik>
        </MotionDialog>
    )
}

function PlayerStatisticsView(props: {
    state: PlayerStatisticState
    deleteState: (data: PlayerStatisticState) => void
    setEditingPlayer: (data: PlayerStatisticState) => void
}) {
    const { state, deleteState, setEditingPlayer } = props

    return (
        <tr className=" text-sm font-normal text-gray-800 uppercase border-y-2 border-dim-white odd:bg-slate-50/20 even:bg-slate-50/40 dark:text-slate-100 dark:border-bright-navy dark:odd:bg-bright-navy/20 dark:even:bg-bright-navy/40 transition">
            <td className=" p-2 text-sm text-left">{state.userId}</td>
            <td className=" p-2 text-left normal-case">{state.playerName}</td>
            <td className=" p-2">{state.runs}</td>
            <td className=" p-2">{state.balls}</td>
            <td className=" p-2">{state.runsGiven}</td>
            <td className=" p-2">{state.ballsGiven}</td>
            <td className=" p-2">{state.wickets}</td>
            <td className=" bg-night-blue">
                <RowActions
                    onEditClick={() => setEditingPlayer(state)}
                    onDeleteClick={() => deleteState(state)}
                />
            </td>
        </tr>
    )
}

export default function PlayerStatsEditPage(props: {
    playerStats: PlayerStatisticState[]
    tournamentId: string
    tournamentInfo: TournamentState
    sendData: (
        state: PlayerStatisticState[],
        deleted: PlayerStatisticState[]
    ) => Promise<PlayerStatisticState[]>
}) {
    let playerStatsOriginal = props.playerStats

    const [updating, setUpdating] = useState(false)
    const [playerStats, dispatch] = useReducer(playerStatsReducer, [...playerStatsOriginal])

    const [deleted, setDeleted] = useState<PlayerStatisticState[]>([])

    const [editingPlayer, setEditingPlayer] = useState<PlayerStatisticState>()

    const [bulkEditor, setBulkEditorDisplay] = useState(false)

    function createState() {
        const newPlayerStats: PlayerStatisticState = {
            rowId: getUniqueId(),
            tournamentId: props.tournamentId,

            userId: '',
            playerName: '',

            runs: 0,
            balls: 0,

            runsGiven: 0,
            ballsGiven: 0,
            wickets: 0
        }
        dispatch({ type: 'CREATE', data: newPlayerStats })
        setEditingPlayer(newPlayerStats)
    }

    function updateState(newPlayer: PlayerStatisticState) {
        dispatch({ type: 'UPDATE', data: newPlayer })
    }

    function deleteState(newPlayer: PlayerStatisticState) {
        if (!newPlayer.created) setDeleted([...deleted, newPlayer])
        dispatch({ type: 'DELETE', data: newPlayer })
    }

    function resetState() {
        dispatch({
            type: 'RESET',
            data: playerStatsOriginal[0],
            originalData: [...playerStatsOriginal]
        })
        setDeleted([])
    }

    async function updateData() {
        setUpdating(true)
        try {
            const newState = await props.sendData(playerStats, deleted)
            playerStatsOriginal = newState

            resetState()
            toast.success('Successfully updated player stats!')
        } catch {
            toast.error('Failed to update player stats. A server error ocurred!')
        }
        setUpdating(false)
    }

    function processBulkInput(input: string) {
        type PlayerInput = Omit<PlayerStatisticState, 'rowId' | 'tournamentId'>
        const DELIMITER = ','

        const inputSplit = input.split('\n')
        const inputMapped = new Map<string, PlayerInput>()

        inputSplit.forEach((splitLine) => {
            const [name, userId, runs, balls, runsGiven, ballsGiven, wickets] =
                splitLine.split(DELIMITER)

            if (!name || !userId || !runs || !balls || !runsGiven || !ballsGiven || !wickets) return

            inputMapped.set(userId.trim(), {
                playerName: name.trim(),
                userId: userId.trim(),
                runs: Number(runs),
                balls: Number(balls),
                runsGiven: Number(runsGiven),
                ballsGiven: Number(ballsGiven),
                wickets: Number(wickets)
            })
        })
        console.log(inputMapped)

        playerStats.forEach((player, index) => {
            const newPlayerInput = inputMapped.get(player.userId)

            if (!newPlayerInput) return

            const newPlayerCombined = { ...player, ...newPlayerInput }

            if (!isEqual(player, newPlayerCombined)) {
                newPlayerCombined.updated = true
                playerStats[index] = newPlayerCombined
            }
            inputMapped.delete(player.userId)
        })

        Array.from(inputMapped.values()).forEach((playerInput) => {
            playerStats.push({
                created: true,

                rowId: getUniqueId(),
                tournamentId: props.tournamentId,

                ...playerInput
            })
        })

        dispatch({ type: 'RESET', data: playerStats[0], originalData: playerStats })
        setBulkEditorDisplay(false)
    }

    return (
        <main className=" w-full flex flex-col items-center justify-center bg-full-white dark:bg-dark-navy transition py-12">
            <AnimatePresence>
                {editingPlayer && (
                    <PlayerEditView
                        editingPlayer={editingPlayer}
                        setEditingPlayer={setEditingPlayer}
                        updateState={updateState}
                        deleteState={deleteState}
                    />
                )}
                {bulkEditor && (
                    <BulkEditorView
                        processBulkInput={processBulkInput}
                        setBulkEditorDisplay={setBulkEditorDisplay}
                    />
                )}
            </AnimatePresence>
            <section className=" max-w-[60rem] w-full flex items-center justify-between text-gray-800 dark:text-slate-100 transition px-6">
                <div className=" flex flex-col items-start justify-evenly">
                    <h1 className=" font-medium text-xl sm:text-2xl md:text-3xl">
                        Manage Tournament
                    </h1>
                    <h3 className=" text-base md:text-xl">Player Stats</h3>
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
                            'disabled:bg-gray-300 disabled:text-gray-800/50 disabled:border-l-gray-400'
                        }
                        onClick={() => setBulkEditorDisplay(true)}>
                        Bulk Edit
                    </button>
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
                            <th>Runs</th>
                            <th>Balls</th>
                            <th>Runs Given</th>
                            <th>Balls Given</th>
                            <th>Wickets</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {playerStats.map((player) => (
                            <PlayerStatisticsView
                                state={player}
                                deleteState={deleteState}
                                setEditingPlayer={setEditingPlayer}
                                key={player.rowId}
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
