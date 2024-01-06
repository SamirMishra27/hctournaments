'use client'

import { useState, useReducer, ChangeEvent } from 'react'
import { Formik, Form, Field } from 'formik'
import Link from 'next/link'
import * as Yup from 'yup'
import EditableField from '@/components/EditableField'
import { pathAsId } from '@/utils'
import { TournamentState } from '@/types/states'
import { tournamentInfoReducer } from '@/hooks/reducers'
import { TournamentStage } from '@/types/constants'
import ErrorBox from '@/components/ErrorBox'
import { toast } from 'sonner'

function Detail(props: { labelName: string; value: string | number; isLink?: boolean }) {
    const { labelName, value, isLink = false } = props

    return (
        <div className=" w-full flex items-center justify-evenly pl-1 md:pl-4 pr-1 md:pr-2 py-2 my-2 dark:text-slate-100 text-sm md:text-base transition">
            <strong aria-label={labelName} className=" w-1/2 md:w-[22rem]">
                {labelName}
            </strong>
            {isLink ? (
                <Link
                    href={value as string}
                    className=" w-1/2 md:w-80 text-blue-500 hover:underline break-all"
                    target="_blank">
                    {value}
                </Link>
            ) : (
                <div className=" w-1/2 md:w-80 h-auto flex-1 break-all">{value}</div>
            )}
        </div>
    )
}

export function TournamentEditView(props: {
    state: TournamentState
    createState?: (data: TournamentState) => void
    updateState?: (data: TournamentState) => void
    setEditMode?: (arg: boolean) => void
}) {
    const { state, createState, updateState, setEditMode } = props

    function getFormattedDate(string: string) {
        return new Date(string).toISOString().split('T')[0]
    }

    const tournamentStage: TournamentStage[] = [
        'UPCOMING',
        'REGISTRATION',
        'ONGOING',
        'KNOCKOUTS',
        'CONCLUDED'
    ]

    const baseStringSchema = Yup.string()
        .min(2, 'Min length should be 2 characters')
        .required("This can't be empty")

    const baseDateSchema = Yup.date().required('Invalid Date')

    const baseNumberSchema = Yup.number()
        .min(0, 'Value must be positive')
        .max(10000, 'Value must be less than 10000')
        .required("This can't be empty")

    const urlStringSchema = baseStringSchema.matches(
        /^https?:\/\/[^\s/$.?#].[^\s]*$/,
        'Must be a URL!'
    )

    const validationSchema = Yup.object().shape({
        tournamentName: baseStringSchema.matches(
            /^[a-zA-Z0-9._\s-]+$/,
            "Don't use invalid characters"
        ),

        slugName: baseStringSchema.matches(/^[a-zA-Z0-9_]+$/, "Don't use invalid characters"),
        seasonNo: baseNumberSchema
            .integer('Must not have decimals')
            .max(500, 'Value must be less than 500'),

        startDate: baseDateSchema,
        endDate: baseDateSchema,
        stage: baseStringSchema.oneOf(tournamentStage, 'Invalid stage name'),

        participants: baseNumberSchema,
        totalTeams: baseNumberSchema,

        totalMatches: baseNumberSchema,
        matchesDone: baseNumberSchema,

        serverLink: urlStringSchema,
        bannerLink: urlStringSchema,
        embedThemeLink: urlStringSchema,

        championsTeam: Yup.string().default('')
    })

    return (
        <Formik
            initialValues={{
                ...state,
                startDate: getFormattedDate(state.startDate),
                endDate: getFormattedDate(state.endDate)
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
                if (updateState) updateState(values)
                if (createState) createState(values)
            }}>
            {({ errors, setFieldValue }) => (
                <Form
                    className=" flex flex-col items-center justify-evenly text-base font-normal text-gray-800 p-2 my-2 space-y-2 dark:text-slate-100 transition"
                    autoComplete="off">
                    <div className=" join w-full flex items-center justify-end">
                        {updateState && setEditMode && (
                            <>
                                <button
                                    className={
                                        ' join-item btn no-animation uppercase h-8 px-2 text-xs min-h-0 min-w-[4rem] border border-gray-300 ' +
                                        'hover:bg-green-500 hover:text-full-white hover:font-semibold ' +
                                        'active:bg-green-500/80'
                                    }
                                    type="submit">
                                    Save
                                </button>
                                <button
                                    className={
                                        ' join-item btn no-animation uppercase h-8 px-2 text-xs min-h-0 min-w-[4rem] border border-gray-300 ' +
                                        'hover:bg-red-500 hover:text-full-white hover:font-semibold ' +
                                        'active:bg-red-500/80'
                                    }
                                    onClick={() => setEditMode(false)}>
                                    Cancel
                                </button>
                            </>
                        )}
                        {createState && (
                            <button
                                className={
                                    ' join-item btn no-animation uppercase h-8 px-2 text-xs min-h-0 min-w-[4rem] border border-gray-300 ' +
                                    'hover:bg-green-500 hover:text-full-white hover:font-semibold ' +
                                    'active:bg-green-500/80'
                                }
                                type="submit">
                                Create
                            </button>
                        )}
                    </div>
                    <div
                        className={
                            ' w-full flex flex-col items-center justify-center p-4 border-2 border-dim-white rounded-xl' +
                            ' dark:border-bright-navy transition'
                        }>
                        <EditableField
                            labelName="Tournament Id"
                            keyName="tournamentId"
                            canEdit={false}
                        />
                        <EditableField
                            labelName="Tournament Name"
                            keyName="tournamentName"
                            errorMessage={errors.tournamentName}
                        />
                        <div className=" w-full flex items-center justify-evenly p-1 md:pl-4 pr-1 md:pr-2 py-2 my-2 text-sm md:text-base">
                            <strong className=" w-1/2 md:w-[22rem]" aria-label="Stage">
                                Published
                            </strong>
                            <div className=" w-1/2 md:w-80 h-auto flex-1 break-all relative">
                                <Field
                                    as="select"
                                    name="published"
                                    className=" w-full border-2 border-dim-white rounded p-1 dark:bg-bright-navy/25 dark:border-bright-navy transition [&>option]:dark:bg-bright-navy"
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                        setFieldValue(
                                            'published',
                                            e.target.value === 'true' ? true : false
                                        )
                                    }>
                                    <option value="true">True</option>
                                    <option value="false">False</option>
                                </Field>
                                <ErrorBox message={errors.published} />
                            </div>
                        </div>
                        <EditableField
                            labelName="Tournament Link Slug"
                            keyName="slugName"
                            errorMessage={errors.slugName}
                        />
                        <EditableField labelName="Season Number" keyName="seasonNo" type="number" />
                        <EditableField
                            labelName="Start Date"
                            keyName="startDate"
                            type="date"
                            errorMessage={errors.startDate}
                        />
                        <EditableField
                            labelName="End Date"
                            keyName="endDate"
                            type="date"
                            errorMessage={errors.endDate}
                        />
                        {/* <EditableField
                            labelName="Stage"
                            keyName="stage"
                            errorMessage={errors.stage}
                        /> */}
                        <div className=" w-full flex items-center justify-evenly p-1 md:pl-4 pr-1 md:pr-2 py-2 my-2 text-sm md:text-base">
                            <strong className=" w-1/2 md:w-[22rem]" aria-label="Stage">
                                Stage
                            </strong>
                            <div className=" w-1/2 md:w-80 h-auto flex-1 break-all relative">
                                <Field
                                    as="select"
                                    name="stage"
                                    className=" w-full h-full pl-1 py-1 mb-1 border-2 border-dim-white rounded dark:bg-bright-navy/20 dark:border-bright-navy transition">
                                    {tournamentStage.map((stage) => (
                                        <option
                                            value={stage}
                                            key={pathAsId(stage)}
                                            className=" dark:bg-bright-navy">
                                            {stage}
                                        </option>
                                    ))}
                                </Field>
                                <ErrorBox message={errors.stage} />
                            </div>
                        </div>
                        <EditableField
                            labelName="Participants"
                            keyName="participants"
                            type="number"
                            errorMessage={errors.participants}
                        />
                        <EditableField
                            labelName="Total Teams"
                            keyName="totalTeams"
                            type="number"
                            errorMessage={errors.totalTeams}
                        />
                        <EditableField
                            labelName="Total Matches"
                            keyName="totalMatches"
                            type="number"
                            errorMessage={errors.totalMatches}
                        />
                        <EditableField
                            labelName="Matches Done"
                            keyName="matchesDone"
                            type="number"
                            errorMessage={errors.matchesDone}
                        />
                        <EditableField
                            labelName="Server Link"
                            keyName="serverLink"
                            errorMessage={errors.serverLink}
                        />
                        <EditableField
                            labelName="Banner Link"
                            keyName="bannerLink"
                            errorMessage={errors.bannerLink}
                        />
                        <EditableField
                            labelName="Embed Theme Link"
                            keyName="embedThemeLink"
                            errorMessage={errors.embedThemeLink}
                        />
                        <EditableField
                            labelName="Champions Team"
                            keyName="championsTeam"
                            errorMessage={errors.championsTeam}
                        />
                    </div>
                </Form>
            )}
        </Formik>
    )
}

function TournamentInfoView(props: {
    state: TournamentState
    setEditMode: (arg: boolean) => void
}) {
    const { state, setEditMode } = props

    return (
        <div className=" flex flex-col items-center justify-evenly text-base font-normal text-gray-800 p-2 my-2 space-y-2">
            <div className=" w-full flex items-center justify-end">
                <button
                    className={
                        ' join-item btn no-animation uppercase h-8 px-2 text-xs min-h-0 min-w-[4rem] border border-gray-300 ' +
                        'hover:bg-orange-gold hover:text-full-white hover:font-semibold ' +
                        'active:bg-orange-gold/80'
                    }
                    onClick={() => setEditMode(true)}>
                    Edit
                </button>
            </div>
            <div className=" w-full flex flex-col items-center justify-center p-4 border-2 border-dim-white rounded-xl dark:border-bright-navy transition">
                <Detail labelName="Tournament Id" value={state.tournamentId} />
                <Detail labelName="Tournament Name" value={state.tournamentName} />
                <Detail labelName="Created At" value={new Date(state.createdAt).toDateString()} />
                <Detail labelName="Published" value={String(state.published)} />
                <Detail labelName="Tournament Link Slug" value={state.slugName} />
                <Detail labelName="Season Number" value={state.seasonNo} />
                <Detail labelName="Start Date" value={new Date(state.startDate).toDateString()} />
                <Detail labelName="End Date" value={new Date(state.endDate).toDateString()} />
                <Detail labelName="Stage" value={state.stage} />
                <Detail labelName="Participants" value={state.participants} />
                <Detail labelName="Total Teams" value={state.totalTeams} />
                <Detail labelName="Total Matches" value={state.totalMatches} />
                <Detail labelName="Matches Done" value={state.matchesDone} />
                <Detail labelName="Server Link" value={state.serverLink} isLink={true} />
                <Detail labelName="Banner Link" value={state.bannerLink} isLink={true} />
                <Detail labelName="Embed Theme Link" value={state.embedThemeLink} isLink={true} />
                <Detail labelName="Champions Team" value={state.championsTeam} />
            </div>
        </div>
    )
}

export default function TournamentInfoEditPage(props: {
    tournament: TournamentState
    sendData: (state: TournamentState) => Promise<TournamentState>
}) {
    let tournamentInfoOriginal = props.tournament

    const [updating, setUpdating] = useState(false)
    const [tournamentInfo, dispatch] = useReducer(tournamentInfoReducer, tournamentInfoOriginal)

    const [editMode, setEditMode] = useState<boolean>(false)

    function updateState(newInfo: TournamentState) {
        dispatch({ type: 'UPDATE', data: newInfo })
        setEditMode(false)
    }

    function resetState() {
        dispatch({ type: 'UPDATE', data: tournamentInfoOriginal })
    }

    async function updateData() {
        setUpdating(true)
        try {
            const newState = await props.sendData(tournamentInfo)
            tournamentInfoOriginal = newState

            resetState()
            toast.success('Successfully updated tournament!')
        } catch {
            toast.error('Failed to update tournament. A server error ocurred!')
        }
        setUpdating(false)
    }

    return (
        <main className=" w-full flex flex-col items-center justify-center bg-full-white dark:bg-dark-navy transition py-12">
            <section className=" max-w-[60rem] w-full flex items-center justify-between text-gray-800 dark:text-slate-100 transition px-6">
                <div className=" flex flex-col items-start justify-evenly">
                    <h1 className=" font-medium text-xl sm:text-2xl md:text-3xl">
                        Manage Tournament
                    </h1>
                    <h3 className=" text-base md:text-xl">Settings</h3>
                </div>
                <div className=" flex flex-col items-end justify-evenly">
                    <h2 className=" text-xl sm:text-2xl md:text-3xl text-right">
                        {tournamentInfo.tournamentName}
                    </h2>
                    <h3 className=" text-base md:text-xl">Season {tournamentInfo.seasonNo}</h3>
                </div>
            </section>
            <div className=" divider-vertical w-full h-px bg-dim-white dark:bg-bright-navy transition mt-6" />
            <section className=" max-w-[96rem] my-16">
                {editMode ? (
                    <TournamentEditView
                        state={tournamentInfo}
                        updateState={updateState}
                        setEditMode={setEditMode}
                        key={tournamentInfo.tournamentId}
                    />
                ) : (
                    <TournamentInfoView
                        state={tournamentInfo}
                        setEditMode={setEditMode}
                        key={tournamentInfo.tournamentId}
                    />
                )}
                <div className=" w-full join flex items-center justify-end px-2 py-2">
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
            </section>
        </main>
    )
}
