'use server'

import {
    AdminState,
    HostState,
    MatchState,
    PlayerStatisticState,
    TeamStandingState,
    TournamentState
} from '@/types/states'

import {
    AdminsPayload,
    HostsPayload,
    ImageUrls,
    MatchesPayload,
    PlayerStatsPayload,
    TeamStandingsPayload,
    TournamentPayload
} from '@/types/payloads'

import {
    AdminData,
    HostData,
    MatchData,
    PlayerStatisticData,
    TeamStandingData,
    TournamentData
} from '@/types/structures'

import { convertSnakeCaseToCamelCase, convertCamelCaseToSnakeCase } from '@/utils'
import { SendingPayload } from './types/generics'

const BASE_URL = process.env.API_ROUTE_BASE

export async function getTournamentData(
    tournamentSlug: string,
    season: number
): Promise<TournamentState> {
    const ROUTE = BASE_URL + `/tournaments/${tournamentSlug}/${season}`

    const data = await fetch(ROUTE, {
        headers: { Authorization: process.env.API_AUTH_KEY as string },
        next: { revalidate: 60, tags: ['tournament'] },
        method: 'GET'
    })

    const json: TournamentPayload = await data.json()

    const state: TournamentState = convertSnakeCaseToCamelCase<TournamentPayload>(json)

    return state
}

export async function putTournamentData(
    tournamentSlug: string,
    season: number,
    state: TournamentState
): Promise<void> {
    const ROUTE = BASE_URL + `/tournaments/${tournamentSlug}/${season}`

    const payload: TournamentPayload = convertCamelCaseToSnakeCase<TournamentState>(state)

    // eslint-disable-next-line
    const response = await fetch(ROUTE, {
        headers: {
            Authorization: process.env.API_AUTH_KEY as string,
            'Content-type': 'application/json'
        },
        body: JSON.stringify(payload),
        method: 'PUT'
    })
    if (response.status >= 300) throw new Error()
}

export async function postTournamentData(
    tournamentSlug: string,
    season: number,
    state: TournamentState
): Promise<TournamentState> {
    const ROUTE = BASE_URL + `/tournaments/${tournamentSlug}/${season}`

    const payload: TournamentPayload = convertCamelCaseToSnakeCase<TournamentState>(state)

    const response = await fetch(ROUTE, {
        headers: {
            Authorization: process.env.API_AUTH_KEY as string,
            'Content-type': 'application/json'
        },
        body: JSON.stringify(payload),
        method: 'POST'
    })

    const data: TournamentPayload = await response.json()

    const newState = convertSnakeCaseToCamelCase<TournamentPayload>(data)

    return newState
}

export async function getAllTournamentsData(): Promise<TournamentState[]> {
    const ROUTE = BASE_URL + '/tournaments'

    const data = await fetch(ROUTE, {
        headers: { Authorization: process.env.API_AUTH_KEY as string },
        next: { revalidate: 60 },
        method: 'GET'
    })

    const json: TournamentPayload[] = await data.json()

    const state: TournamentState[] = json.map((tournament) =>
        convertSnakeCaseToCamelCase<TournamentData>(tournament)
    )

    return state
}

export async function getMatchesData(
    tournamentSlug: string,
    season: number
): Promise<[MatchState[], string, string]> {
    const ROUTE = BASE_URL + `/matches/${tournamentSlug}/${season}`

    const data = await fetch(ROUTE, {
        headers: { Authorization: process.env.API_AUTH_KEY as string },
        next: { revalidate: 60, tags: ['matches'] }
    })

    const json: MatchesPayload = await data.json()

    const state: MatchState[] = [
        ...json.matches.map((match) => convertSnakeCaseToCamelCase<MatchData>(match))
    ]

    return [state, json.embed_image_url, json.tournament_id]
}

export async function putMatchesData(
    tournamentSlug: string,
    season: number,
    state: MatchState[],
    deleted: MatchState[]
): Promise<void> {
    const ROUTE = BASE_URL + `/matches/${tournamentSlug}/${season}`

    function preparePayload(data: MatchState): MatchData {
        delete data.created
        delete data.updated

        return convertCamelCaseToSnakeCase<MatchState>(data)
    }

    const payload: SendingPayload<MatchData> = {
        added: state.filter((match) => match.created).map((match) => preparePayload(match)),
        updated: state.filter((match) => match.updated).map((match) => preparePayload(match)),
        deleted: deleted.map((match) => convertCamelCaseToSnakeCase<MatchState>(match))
    }

    const response = await fetch(ROUTE, {
        headers: {
            Authorization: process.env.API_AUTH_KEY as string,
            'Content-type': 'application/json'
        },
        body: JSON.stringify(payload),
        method: 'PUT'
    })
    if (response.status >= 300) throw new Error()
}

export async function getPlayerStatsData(
    tournamentSlug: string,
    season: number
): Promise<[PlayerStatisticState[], string, string]> {
    const ROUTE = BASE_URL + `/playerstats/${tournamentSlug}/${season}`

    const data = await fetch(ROUTE, {
        headers: { Authorization: process.env.API_AUTH_KEY as string },
        next: { revalidate: 60, tags: ['playerstats'] },
        method: 'GET'
    })

    const json: PlayerStatsPayload = await data.json()

    const state: PlayerStatisticState[] = [
        ...json.player_stats.map((data) => convertSnakeCaseToCamelCase<PlayerStatisticData>(data))
    ]

    return [state, json.embed_image_url, json.tournament_id]
}

export async function putPlayerStatsData(
    tournamentSlug: string,
    season: number,
    state: PlayerStatisticState[],
    deleted: PlayerStatisticState[]
): Promise<void> {
    const ROUTE = BASE_URL + `/playerstats/${tournamentSlug}/${season}`

    function preparePayload(data: PlayerStatisticState): PlayerStatisticData {
        delete data.created
        delete data.updated

        return convertCamelCaseToSnakeCase<PlayerStatisticState>(data)
    }

    const payload: SendingPayload<PlayerStatisticData> = {
        added: state.filter((player) => player.created).map((player) => preparePayload(player)),
        updated: state.filter((player) => player.updated).map((player) => preparePayload(player)),
        deleted: deleted.map((player) => convertCamelCaseToSnakeCase<PlayerStatisticState>(player))
    }

    const response = await fetch(ROUTE, {
        headers: {
            Authorization: process.env.API_AUTH_KEY as string,
            'Content-type': 'application/json'
        },
        body: JSON.stringify(payload),
        method: 'PUT'
    })
    if (response.status >= 300) throw new Error()
}

export async function getTeamStandingsData(
    tournamentSlug: string,
    season: number
): Promise<[TeamStandingState[], ImageUrls, string]> {
    const ROUTE = BASE_URL + `/groups/${tournamentSlug}/${season}`
    console.log(ROUTE)

    const data = await fetch(ROUTE, {
        headers: { Authorization: process.env.API_AUTH_KEY as string },
        next: { revalidate: 60 }
    })

    const json: TeamStandingsPayload = await data.json()

    const state: TeamStandingState[] = [
        ...json.team_standings.map((standing) =>
            convertSnakeCaseToCamelCase<TeamStandingData>(standing)
        )
    ]

    return [state, json.embed_image_urls, json.tournament_id]
}

export async function putTeamStandingsData(
    tournamentSlug: string,
    season: number,
    state: TeamStandingState[],
    deleted: TeamStandingState[]
): Promise<void> {
    const ROUTE = BASE_URL + `/groups/${tournamentSlug}/${season}`

    function preparePayload(data: TeamStandingState): TeamStandingData {
        delete data.created
        delete data.updated

        return convertCamelCaseToSnakeCase<TeamStandingState>(data)
    }

    const payload: SendingPayload<TeamStandingData> = {
        added: state
            .filter((standing) => standing.created)
            .map((standing) => preparePayload(standing)),
        updated: state
            .filter((standing) => standing.updated)
            .map((standing) => preparePayload(standing)),
        deleted: deleted.map((standing) => convertCamelCaseToSnakeCase<TeamStandingState>(standing))
    }

    const response = await fetch(ROUTE, {
        headers: {
            Authorization: process.env.API_AUTH_KEY as string,
            'Content-type': 'application/json'
        },
        body: JSON.stringify(payload),
        method: 'PUT'
    })
    if (response.status >= 300) throw new Error()
}

export async function getAdminsData(): Promise<AdminState[]> {
    const ROUTE = BASE_URL + '/admins'

    const data = await fetch(ROUTE, {
        headers: { Authorization: process.env.API_AUTH_KEY as string },
        next: { revalidate: 60, tags: ['admins'] }
    })

    const json: AdminsPayload = await data.json()

    const state: AdminState[] = [
        ...json.map((admin) => convertSnakeCaseToCamelCase<AdminData>(admin))
    ]

    return state
}

export async function putAdminsData(state: AdminState[], deleted: AdminState[]): Promise<void> {
    const ROUTE = BASE_URL + '/admins'

    function preparePayload(data: AdminState): AdminData {
        delete data.created
        delete data.updated

        return convertCamelCaseToSnakeCase<AdminState>(data)
    }

    const payload = {
        added: state.filter((admin) => admin.created).map((admin) => preparePayload(admin)),
        updated: state.filter((admin) => admin.updated).map((admin) => preparePayload(admin)),
        deleted: deleted.map((admin) => convertCamelCaseToSnakeCase<AdminState>(admin))
    }

    const response = await fetch(ROUTE, {
        headers: {
            Authorization: process.env.API_AUTH_KEY as string,
            'Content-type': 'application/json'
        },
        body: JSON.stringify(payload),
        method: 'PUT'
    })
    if (response.status >= 300) throw new Error()
}

export async function getHostsData(
    tournamentSlug: string,
    season: number
): Promise<[HostState[], string]> {
    const ROUTE = BASE_URL + `/hosts/${tournamentSlug}/${season}`

    const data = await fetch(ROUTE, {
        headers: { Authorization: process.env.API_AUTH_KEY as string },
        next: { revalidate: 60, tags: ['hosts'] }
    })

    const json: HostsPayload = await data.json()

    const state: HostState[] = [
        ...json.hosts.map((host) => convertSnakeCaseToCamelCase<HostData>(host))
    ]

    return [state, json.tournament_id]
}

export async function putHostsData(
    tournamentSlug: string,
    season: number,
    state: HostState[],
    deleted: HostState[]
): Promise<void> {
    const ROUTE = BASE_URL + `/hosts/${tournamentSlug}/${season}`

    function preparePayload(data: HostState): HostData {
        delete data.created
        delete data.updated

        return convertCamelCaseToSnakeCase<HostState>(data)
    }

    const payload = {
        added: state.filter((host) => host.created).map((host) => preparePayload(host)),
        updated: state.filter((host) => host.updated).map((host) => preparePayload(host)),
        deleted: deleted.map((host) => preparePayload(host))
    }

    const response = await fetch(ROUTE, {
        headers: {
            Authorization: process.env.API_AUTH_KEY as string,
            'Content-type': 'application/json'
        },
        body: JSON.stringify(payload),
        method: 'PUT'
    })
    if (response.status >= 300) throw new Error()
}
