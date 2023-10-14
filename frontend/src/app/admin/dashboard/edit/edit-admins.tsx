'use client'

import { useState, useReducer } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { pathAsId, getUniqueId } from '@/utils'
import { AdminState } from '@/types/states'
import { adminsInfoReducer } from '@/hooks/reducers'

function AdminView(props: {
    state: AdminState
    // createState: (data: AdminState) => void
    updateState: (data: AdminState) => void
    deleteState: (data: AdminState) => void
}) {
    const { state, updateState, deleteState } = props
    console.log(state, typeof state.roles)

    const [editMode, setEditMode] = useState<boolean>(state.created ? true : false)

    function dispatchUpdate(inputValues: AdminState) {
        // @ts-expect-error because input value is a string
        inputValues.roles = inputValues.roles.split(',').map((s) => s.toUpperCase().trim()) // TODO: Implement select
        updateState(inputValues)
        setEditMode(false)
    }

    function validateRolesInput(value: string, textContext: Yup.TestContext<Yup.AnyObject>) {
        if (!value) return false

        const rolesArray = value
            .split(',')
            .map((s) => s.trim().toUpperCase())
            .filter((s) => s.length)
        const validValues: string[] = []

        for (const role of rolesArray) {
            if (!['OWNER', 'ADMIN'].includes(role)) {
                return textContext.createError({
                    message: `"${role}" is not a valid role!`
                })
            }

            if (validValues.includes(role)) {
                return textContext.createError({
                    message: `${role} is already present!`
                })
            }

            validValues.push(role)
        }

        return true
    }

    const validationSchema = Yup.object().shape({
        userId: Yup.string()
            .min(17, 'Enter valid ID!')
            .max(19, 'Enter valid ID!')
            .required("Must enter user's Discord User ID!")
            .matches(/^\d{17,19}$/, 'Enter valid ID!'),
        roles: Yup.string()
            .required("This can't be empty!")
            .test('valid-roles', ({ message }) => message, validateRolesInput)
    })

    if (editMode)
        return (
            <Formik
                initialValues={state}
                validationSchema={validationSchema}
                onSubmit={(values) => dispatchUpdate(values)}>
                {({ errors }) => (
                    <Form
                        className=" flex items-center justify-evenly text-base font-normal text-gray-800 p-3 border-2 border-dim-white rounded-xl my-2 pb-6"
                        autoComplete="off">
                        <div className="w-56 mx-2 flex flex-col items-start justify-evenly relative">
                            <Field
                                name="userId"
                                className=" pl-2 py-1 mb-1 uppercase border-2 border-gray-300 rounded-lg"
                            />
                            <div
                                className={
                                    ' text-sm text-rose-500 normal-case pl-2 h-5 max-w-[15rem] ' +
                                    'overflow-clip whitespace-nowrap text-ellipsis absolute -bottom-4'
                                }
                                title={errors.userId}>
                                {errors.userId}
                            </div>
                        </div>
                        <div className="w-56 mx-2 flex flex-col items-start justify-evenly relative">
                            <Field
                                name="roles"
                                className=" pl-2 py-1 mb-1 uppercase border-2 border-gray-300 rounded-lg"
                            />
                            <div
                                className={
                                    ' text-sm text-rose-500 normal-case pl-2 h-5 max-w-[15rem] ' +
                                    'overflow-clip whitespace-nowrap text-ellipsis absolute -bottom-4'
                                }
                                title={String(errors.roles)}>
                                {errors.roles}
                            </div>
                        </div>
                        <div className=" flex-1 join flex items-center justify-center max-w-xs">
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
                                onClick={() => {
                                    state.created ? deleteState(state) : setEditMode(false)
                                }}>
                                Cancel
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        )

    return (
        <div className=" flex items-center justify-evenly text-base font-normal text-gray-800 uppercase p-3 border-2 border-dim-white rounded-xl my-2">
            <div className="w-56 px-2 mx-2">{state.userId}</div>
            <div className="w-56 px-2 mx-2 flex items-center justify-start gap-x-2">
                {state.roles.map((role) => (
                    <span
                        className={
                            ' px-2 py-1 text-center text-sm font-medium rounded-xl' +
                            (role === 'OWNER' ? ' bg-red-400/70' : ' bg-orange-gold/50')
                        }
                        key={pathAsId(role)}>
                        {role}
                    </span>
                ))}
            </div>
            <div className=" divider divider-vertical my-0 border-r-2 border-r-dim-white h-auto max-h-9" />
            <div className=" flex-1 join flex items-center justify-center max-w-xs px-4">
                <button
                    className={
                        ' join-item btn no-animation uppercase h-8 px-2 text-xs min-h-0 min-w-[4rem] border border-gray-300 ' +
                        'hover:bg-orange-gold hover:text-full-white hover:font-semibold ' +
                        'active:bg-orange-gold/80'
                    }
                    onClick={() => setEditMode(true)}>
                    Edit
                </button>
                <button
                    className={
                        ' join-item btn no-animation uppercase h-8 px-2 text-xs min-h-0 min-w-[4rem] border border-gray-300 ' +
                        'hover:bg-red-500 hover:text-full-white hover:font-semibold ' +
                        'active:bg-red-500/80'
                    }
                    onClick={() => deleteState(state)}>
                    Delete
                </button>
            </div>
        </div>
    )
}

export default function AdminEditPage(props: {
    admins: AdminState[]
    sendData: (state: AdminState[], deleted: AdminState[]) => Promise<AdminState[]>
}) {
    let adminsOriginal = props.admins

    const [updating, setUpdating] = useState(false)
    const [admins, dispatch] = useReducer(adminsInfoReducer, [...adminsOriginal])

    const [deleted, setDeleted] = useState<AdminState[]>([])

    function createState() {
        const newAdmin: AdminState = {
            userId: '',
            rowNo: admins.length ? admins[admins.length - 1].rowNo + 1 : 1,

            name: '',
            roles: ['ADMIN'],
            tempId: getUniqueId()
        }
        dispatch({ type: 'CREATE', data: newAdmin })
    }

    function updateState(newAdmin: AdminState) {
        dispatch({ type: 'UPDATE', data: newAdmin })
    }

    function deleteState(adminData: AdminState) {
        if (!adminData.created) setDeleted([...deleted, adminData])
        dispatch({ type: 'DELETE', data: adminData })
    }

    function resetState() {
        dispatch({ type: 'RESET', data: adminsOriginal[0], originalData: [...adminsOriginal] })
        setDeleted([])
    }

    async function updateData() {
        setUpdating(true)

        const newState = await props.sendData(admins, deleted)
        adminsOriginal = newState

        dispatch({ type: 'RESET', data: newState[0], originalData: [...adminsOriginal] })
        setUpdating(false)
    }

    return (
        <main className=" w-full flex flex-col items-center justify-center bg-full-white">
            <section className=" overflow-x-auto my-4">
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
                <div className=" text-base font-bold text-gray-700 uppercase p-2 w-full flex items-center justify-evenly border-b-2 border-b-dim-white mb-6 text-left">
                    <strong className=" w-56 px-2">User Id</strong>
                    <strong className=" w-56 px-2">Roles</strong>
                    <strong className=" w-36 text-center px-2">Actions</strong>
                </div>
                {admins.map((admin) => (
                    <AdminView
                        state={admin}
                        // createState={createState}
                        updateState={updateState}
                        deleteState={deleteState}
                        key={admin.userId}
                    />
                ))}
                <button
                    className={
                        ' btn btn-block no-animation uppercase h-8 px-2 text-base min-h-0 ' +
                        'hover:bg-orange-gold hover:text-full-white hover:font-semibold active:bg-orange-gold/80'
                    }
                    onClick={() => createState()}>
                    Add New
                </button>
            </section>
        </main>
    )
}
