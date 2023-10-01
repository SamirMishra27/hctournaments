import { ReducerAction } from '@/types/generics'
import {
    AdminState,
    HostState,
    MatchState,
    PlayerStatisticState,
    TeamStandingState,
    TournamentState
} from '@/types/states'

export function tournamentInfoReducer(
    state: TournamentState,
    action: ReducerAction<TournamentState>
): TournamentState {
    const { data, type } = action

    if (type === 'CREATE') {
        return { created: true, ...data }
    }
    //
    else if (type === 'UPDATE') {
        return { updated: true, ...data }
    }
    //
    else return state
}

export function matchesReducer(
    state: MatchState[] = [],
    action: ReducerAction<MatchState>
): MatchState[] {
    const { data, type, originalData } = action

    if (type === 'CREATE') {
        data.created = true

        return [...state, { ...data }]
    }
    //
    else if (type === 'UPDATE') {
        data.updated = true

        state.forEach((match, index) => {
            if (match.matchId === data.matchId) {
                state[index] = data
            }
        })

        return [...state]
    }
    //
    else if (type === 'DELETE') {
        const filtered = state.filter((match) => match.matchId !== data.matchId)

        return [...filtered]
    }
    //
    else if (type === 'RESET' && originalData) {
        return [...originalData]
    }
    //
    else return state
}

export function playerStatsReducer(
    state: PlayerStatisticState[] = [],
    action: ReducerAction<PlayerStatisticState>
): PlayerStatisticState[] {
    const { data, type, originalData } = action

    if (type === 'CREATE') {
        data.created = true

        return [...state, { ...data }]
    }
    //
    else if (type === 'UPDATE') {
        data.updated = true

        state.forEach((player, index) => {
            if (player.rowId === data.rowId) {
                state[index] = data
            }
        })

        return [...state]
    }
    //
    else if (type === 'DELETE') {
        const filtered = state.filter((player) => player.rowId !== data.rowId)

        return [...filtered]
    }
    //
    else if (type === 'RESET' && originalData) {
        return [...originalData]
    }
    //
    else return state
}

export function standingsReducer(
    state: TeamStandingState[] = [],
    action: ReducerAction<TeamStandingState>
): TeamStandingState[] {
    const { data, type, originalData } = action

    if (type === 'CREATE') {
        data.created = true

        return [...state, { ...data }]
    }
    //
    else if (type === 'UPDATE') {
        data.updated = true

        state.forEach((standing, index) => {
            if (standing.rowId === data.rowId) {
                state[index] = data
            }
        })

        return [...state]
    }
    //
    else if (type === 'DELETE') {
        const filtered = state.filter((standing) => standing.rowId !== data.rowId)

        return [...filtered]
    }
    //
    else if (type === 'RESET' && originalData) {
        return [...originalData]
    }
    //
    else return state
}

export function adminsInfoReducer(
    state: AdminState[] = [],
    action: ReducerAction<AdminState>
): AdminState[] {
    const { data, type, originalData } = action

    if (type === 'CREATE') {
        data.created = true

        return [...state, { ...data }]
    }
    //
    else if (type === 'UPDATE') {
        if (!data.created) data.updated = true

        state.forEach((admin, index) => {
            if (admin.userId === data.userId || admin.tempId === data.tempId) {
                state[index] = data
            }
        })

        return [...state]
    }
    //
    else if (type === 'DELETE') {
        const filtered = state.filter(
            (admin) => admin.userId !== data.userId || admin.tempId !== data.tempId
        )

        return [...filtered]
    }
    //
    else if (type === 'RESET' && originalData) {
        return [...originalData]
    }
    //
    else return state
}

export function hostsReducer(
    state: HostState[] = [],
    action: ReducerAction<HostState>
): HostState[] {
    const { data, type, originalData } = action

    if (type === 'CREATE') {
        data.created = true

        return [...state, { ...data }]
    }
    //
    else if (type === 'UPDATE') {
        data.updated = true

        state.forEach((host, index) => {
            if (host.rowId === data.rowId) {
                state[index] = data
            }
        })

        return [...state]
    }
    //
    else if (type === 'DELETE') {
        const filtered = state.filter((host) => host.rowId !== data.rowId)

        return [...filtered]
    }
    //
    else if (type === 'RESET' && originalData) {
        return [...originalData]
    }
    //
    else return state
}
