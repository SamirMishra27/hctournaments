'use client'

import { useState, useReducer, ChangeEvent } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import MotionDialog from '@/components/MotionDialog'
import ErrorBox from '@/components/ErrorBox'
import { getUniqueId } from '@/utils'
import { TeamStandingState, TournamentState } from '@/types/states'
import { standingsReducer } from '@/hooks/reducers'
import { AnimatePresence } from 'framer-motion'
import FormControls from '@/components/FormActions'
import RowActions from '@/components/RowActions'
import { toast } from 'sonner'
import useEscapeKey from '@/hooks/useEscapeKey'
import AutocompleteField from '@/components/AutocompleteField'

function StandingEditView(props: {
    editingTeam: TeamStandingState
    groupNames: string[]
    groupIds: string[]
    setEditingTeam: (data: TeamStandingState | undefined) => void
    updateState: (data: TeamStandingState) => void
    deleteState: (data: TeamStandingState) => void
}) {
    const { editingTeam, groupNames, groupIds, setEditingTeam, updateState, deleteState } = props

    const baseStringSchema = Yup.string()
        .min(2, 'Min length should be 2 characters')
        .matches(/^[a-zA-Z0-9._\s\W]+$/, "Don't use invalid characters")
        .required("This can't be empty")

    const groupAndTeamSchema = baseStringSchema
        .max(100, 'Maximum length is 100 characters')
        .uppercase()

    const baseNumberSchema = Yup.number()
        .min(0, 'Value must be positive')
        .max(500, 'Value must be less than 500')
        .required("This can't be empty")

    const integerOnlySchema = baseNumberSchema.integer('Must not have decimals')

    const validationSchema = Yup.object().shape({
        groupName: groupAndTeamSchema,
        groupId: baseStringSchema
            .max(50, 'Maximum length is 50')
            .matches(/^[a-z0-9_]+$/, 'Must be lower case'),

        teamName: groupAndTeamSchema,
        matchesPlayed: integerOnlySchema,
        matchesWon: integerOnlySchema,
        matchesLost: integerOnlySchema,

        pointsMultiplier: integerOnlySchema,
        points: integerOnlySchema,

        runsPerWicketRatio: baseNumberSchema,
        priority: integerOnlySchema,

        qualified: Yup.bool().required('Must be either true or false')
    })

    useEscapeKey(() => {
        if (editingTeam.created) deleteState(editingTeam)
        setEditingTeam(undefined)
    })

    return (
        <MotionDialog>
            <Formik
                initialValues={editingTeam}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    updateState(values)
                    setEditingTeam(undefined)
                }}>
                {({ errors, setFieldValue }) => (
                    <Form
                        className=" flex flex-col items-start justify-evenly text-sm font-normal text-gray-800 uppercase dark:text-slate-100 transition"
                        autoComplete="off">
                        <div className=" flex items-center justify-evenly space-x-2">
                            <div className=" w-full py-2 relative">
                                <div className=" font-semibold normal-case">Group Name</div>
                                <AutocompleteField
                                    keyName="groupName"
                                    options={groupNames}
                                    errorMessage={errors.groupName}
                                    setFieldValue={setFieldValue}
                                />
                            </div>
                            <AutocompleteField
                                keyName="groupId"
                                options={groupIds}
                                errorMessage={errors.groupId}
                                setFieldValue={setFieldValue}
                            />
                        </div>
                        <div className=" w-full py-2 relative">
                            <div className=" font-semibold normal-case">Team Name</div>
                            <Field
                                name="teamName"
                                className=" w-full border-2 border-dim-white rounded p-1 dark:bg-bright-navy/25 dark:border-bright-navy transition capitalize"
                            />
                            <ErrorBox message={errors.teamName} />
                        </div>
                        <div className=" flex items-center justify-evenly space-x-2">
                            <div className=" w-full py-2 max-w-[10rem] relative">
                                <div className=" font-semibold normal-case">Matches Played</div>
                                <Field
                                    name="matchesPlayed"
                                    type="number"
                                    className=" w-full border-2 border-dim-white rounded p-1 dark:bg-bright-navy/25 dark:border-bright-navy transition"
                                />
                                <ErrorBox message={errors.matchesPlayed} />
                            </div>
                            <div className=" w-full py-2 max-w-[8rem] relative">
                                <div className=" font-semibold normal-case">Won</div>
                                <Field
                                    name="matchesWon"
                                    type="number"
                                    className=" w-full border-2 border-dim-white rounded p-1 dark:bg-bright-navy/25 dark:border-bright-navy transition"
                                />
                                <ErrorBox message={errors.matchesWon} />
                            </div>
                            <div className=" w-full py-2 max-w-[8rem] relative">
                                <div className=" font-semibold normal-case">Lost</div>
                                <Field
                                    name="matchesLost"
                                    type="number"
                                    className=" w-full border-2 border-dim-white rounded p-1 dark:bg-bright-navy/25 dark:border-bright-navy transition"
                                />
                                <ErrorBox message={errors.matchesLost} />
                            </div>
                        </div>
                        <div className=" w-full py-2 relative">
                            <div className=" font-semibold normal-case">Points Multiplier</div>
                            <Field
                                name="pointsMultiplier"
                                type="number"
                                className=" w-full border-2 border-dim-white rounded p-1 dark:bg-bright-navy/25 dark:border-bright-navy transition"
                            />
                            <ErrorBox message={errors.pointsMultiplier} />
                        </div>
                        <div className=" w-full py-2 relative">
                            <div className=" font-semibold normal-case">Points</div>
                            <Field
                                name="points"
                                type="number"
                                className=" w-full border-2 border-dim-white rounded p-1 dark:bg-bright-navy/25 dark:border-bright-navy transition"
                            />
                            <ErrorBox message={errors.points} />
                        </div>
                        <div className=" w-full py-2 relative">
                            <div
                                className=" font-semibold normal-case tooltip"
                                data-tip="Runs Per Wicket Ratio">
                                RPWR
                            </div>
                            <Field
                                name="runsPerWicketRatio"
                                type="number"
                                step="0.01"
                                className=" w-full border-2 border-dim-white rounded p-1 dark:bg-bright-navy/25 dark:border-bright-navy transition"
                            />
                            <ErrorBox message={errors.runsPerWicketRatio} />
                        </div>
                        <div className=" w-full py-2 relative">
                            <div className=" font-semibold normal-case">Qualified</div>
                            <Field
                                as="select"
                                name="qualified"
                                className=" w-full border-2 border-dim-white rounded p-1 dark:bg-bright-navy/25 dark:border-bright-navy transition [&>option]:dark:bg-bright-navy"
                                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                    setFieldValue(
                                        'qualified',
                                        e.target.value === 'true' ? true : false
                                    )
                                }>
                                <option value="true">Qualified</option>
                                <option value="false">Not Qualified</option>
                            </Field>
                            <ErrorBox message={errors.qualified} />
                        </div>
                        <FormControls
                            onCancelClick={() => {
                                if (editingTeam.created) deleteState(editingTeam)
                                setEditingTeam(undefined)
                            }}
                        />
                    </Form>
                )}
            </Formik>
        </MotionDialog>
    )
}

function StandingView(props: {
    state: TeamStandingState
    deleteState: (data: TeamStandingState) => void
    setEditingTeam: (data: TeamStandingState | undefined) => void
}) {
    const { state, deleteState, setEditingTeam } = props

    return (
        <tr className=" text-sm font-normal text-gray-800 uppercase border-y-2 border-dim-white odd:bg-slate-50/20 even:bg-slate-50/40 dark:text-slate-100 dark:border-bright-navy dark:odd:bg-bright-navy/20 dark:even:bg-bright-navy/40 transition">
            <td className=" p-2">{state.groupName}</td>
            <td className=" p-2 text-sm normal-case">{state.groupId}</td>
            <td className=" p-2 text-sm text-left">{state.teamName}</td>
            <td className=" p-2">{state.matchesPlayed}</td>
            <td className=" p-2">{state.matchesWon}</td>
            <td className=" p-2">{state.matchesLost}</td>
            <td className=" p-2">{state.pointsMultiplier}</td>
            <td className=" p-2">{state.points}</td>
            <td className=" p-2">{state.runsPerWicketRatio}</td>
            <td className=" p-2">{state.qualified.toString()}</td>
            <td className=" bg-night-blue">
                <RowActions
                    onEditClick={() => setEditingTeam(state)}
                    onDeleteClick={() => deleteState(state)}
                />
            </td>
        </tr>
    )
}

export default function StandingsEditPage(props: {
    standings: TeamStandingState[]
    tournamentId: string
    tournamentInfo: TournamentState
    sendData: (
        state: TeamStandingState[],
        deleted: TeamStandingState[]
    ) => Promise<TeamStandingState[]>
}) {
    let standingsOriginal = props.standings

    const [updating, setUpdating] = useState(false)
    const [standings, dispatch] = useReducer(standingsReducer, standingsOriginal)

    const [deleted, setDeleted] = useState<TeamStandingState[]>([])

    const [editingTeam, setEditingTeam] = useState<TeamStandingState>()

    function createData() {
        const newStanding: TeamStandingState = {
            rowId: getUniqueId(),
            tournamentId: props.tournamentId,
            rowNo: standings.length ? standings[standings.length - 1].rowNo + 1 : 1,

            groupName: '',
            groupId: '',

            teamName: '',
            matchesPlayed: 0,
            matchesWon: 0,
            matchesLost: 0,

            pointsMultiplier: 0,
            points: 0,

            runsPerWicketRatio: 0,
            priority: 0,
            qualified: false
        }
        dispatch({ type: 'CREATE', data: newStanding })
        setEditingTeam(newStanding)
    }

    function updateState(newStanding: TeamStandingState) {
        dispatch({ type: 'UPDATE', data: newStanding })
    }

    function deleteState(standing: TeamStandingState) {
        if (!standing.created) setDeleted([...deleted, standing])
        dispatch({ type: 'DELETE', data: standing })
    }

    function resetState() {
        dispatch({
            type: 'RESET',
            data: standingsOriginal[0],
            originalData: [...standingsOriginal]
        })
        setDeleted([])
    }

    async function updateData() {
        setUpdating(true)
        try {
            const newState = await props.sendData(standings, deleted)
            standingsOriginal = newState

            resetState()
            toast.success('Successfully updated standings!')
        } catch {
            toast.error('Failed to update standings. A server error ocurred!')
        }
        setUpdating(false)
    }

    return (
        <main className=" w-full flex flex-col items-center justify-center bg-full-white dark:bg-dark-navy transition py-12">
            <AnimatePresence>
                {editingTeam && (
                    <StandingEditView
                        editingTeam={editingTeam}
                        groupNames={Array.from(
                            new Set(standings.map((row) => row.groupName.toUpperCase()))
                        )}
                        groupIds={Array.from(
                            new Set(standings.map((row) => row.groupId.toLowerCase()))
                        )}
                        setEditingTeam={setEditingTeam}
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
                    <h3 className=" text-base md:text-xl">Standings</h3>
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
                            <th>Group Name</th>
                            <th>Group Id</th>
                            <th>Team Name</th>
                            <th>Played</th>
                            <th>Won</th>
                            <th>Lost</th>
                            <th>Points Multiplier</th>
                            <th>Points</th>
                            <th>Runs Per Wicket Ratio</th>
                            <th>Qualified</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {standings.map((teamStanding) => (
                            <StandingView
                                state={teamStanding}
                                deleteState={deleteState}
                                setEditingTeam={setEditingTeam}
                                key={teamStanding.rowId}
                            />
                        ))}
                    </tbody>
                </table>
                <button
                    className={
                        ' btn btn-block no-animation uppercase h-8 px-2 text-base min-h-0 max-w-[72rem]' +
                        ' hover:bg-orange-gold hover:text-full-white hover:font-semibold active:bg-orange-gold/80'
                    }
                    onClick={() => createData()}>
                    Add New
                </button>
            </section>
        </main>
    )
}
