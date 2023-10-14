import { StatefulData } from './generics'
import { AdminRole, MatchStatus, TournamentStage } from './constants'

export interface AdminData extends StatefulData {
    user_id: string
    row_no: number

    name: string
    roles: AdminRole[]
}

export interface HostData extends StatefulData {
    row_id: string
    tournament_id: string
    row_no: number

    user_id: string
    name: string
    username: string
    avatar_url: string
}

export interface MatchData extends StatefulData {
    match_id: string
    tournament_id: string
    row_no: number

    title: string
    description: string
    status: MatchStatus

    team_a_name: string
    team_a_runs: number
    team_a_overs: number
    team_a_wickets: number

    team_b_name: string
    team_b_runs: number
    team_b_overs: number
    team_b_wickets: number

    winner_name: string
}

export interface PlayerStatisticData extends StatefulData {
    row_id: string
    tournament_id: string
    row_no: number

    user_id: string
    player_name: string

    runs: number
    balls: number

    runs_given: number
    balls_given: number

    wickets: number
}

export interface TeamStandingData extends StatefulData {
    row_id: string
    tournament_id: string
    row_no: number

    group_name: string
    group_id: string

    team_name: string
    matches_played: number
    matches_won: number
    matches_lost: number

    points_multiplier: number
    points: number

    runs_per_wicket_ratio: number
    priority: number

    qualified: boolean
}

export interface TournamentData extends StatefulData {
    tournament_id: string
    tournament_name: string

    created_at: string
    published: boolean

    slug_name: string
    season_no: number

    start_date: string
    end_date: string
    stage: TournamentStage

    participants: number
    total_teams: number

    total_matches: number
    matches_done: number

    server_link: string
    banner_link: string

    embed_theme_link: string
    champions_team: string
}
