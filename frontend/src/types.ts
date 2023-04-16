import { ParsedUrlQuery } from 'querystring'

export interface Params extends ParsedUrlQuery {
    tournament: string
}

export interface GroupInfo {
    id: string
    name: string
}

export interface GroupStandings {
    team_name: string
    matches_played: number
    matches_won: number
    matches_lost: number
    points: number
}

export interface HostInfo {
    name: string
    mention: string
    id: number
}

export interface MatchInfo {
    MatchNo: number
    MatchStatus: boolean // If true then match is finished
    TeamAName: string
    TeamARuns: number
    TeamAOvers: number
    TeamAWickets: number
    TeamBName: string
    TeamBRuns: number
    TeamBOvers: number
    TeamBWickets: number
}
export interface PlayerStatistics {
    name: string
    id: number
    runs: number
    balls: number
    runs_given: number
    balls_given: number
    wickets: number
}

export interface TournamentInfo {
    tournament_full_name: string
    tournament_short_name: string
    season: string
    start_date: string
    end_date: string
    participants: number
    total_teams: number
    current_stage: string
    total_matches: number
    matches_done: number
    groups: Array<GroupInfo>
    host: Array<HostInfo>
    server_link: string
    banner_link: string
}

export interface ApiPayloadData {
    cloudinary_url: string
    message: string
    success: boolean
}

export interface GroupsApiPayloadData extends ApiPayloadData {
    data: Array<GroupStandings>
}

export interface InfoApiPayloadData extends ApiPayloadData {
    data: TournamentInfo
}

export interface ScheduleApiPayloadData extends ApiPayloadData {
    data: Array<MatchInfo>
}

export interface StatsApiPayloadData extends ApiPayloadData {
    full_data: Array<PlayerStatistics>
    top_ten_batting: Array<PlayerStatistics>
    top_ten_bowling: Array<PlayerStatistics>
}
