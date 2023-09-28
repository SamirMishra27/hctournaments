import { AdminRole, MatchStatus, TournamentStage } from './constants'
import { StatefulData } from './generics'

export interface AdminState extends StatefulData {
    userId: string
    roles: AdminRole[]
    tempId?: string
}

export interface HostState extends StatefulData {
    rowId: string
    tournamentId: string
    userId: string

    name: string
    username: string
    avatarUrl: string
}

export interface MatchState extends StatefulData {
    matchId: string
    tournamentId: string

    title: string
    description: string
    status: MatchStatus
    teamAName: string
    teamARuns: number
    teamAOvers: number
    teamAWickets: number

    teamBName: string
    teamBRuns: number
    teamBOvers: number
    teamBWickets: number

    winnerName: string
}

export interface PlayerStatisticState extends StatefulData {
    rowId: string
    tournamentId: string

    userId: string
    playerName: string

    runs: number
    balls: number

    runsGiven: number
    ballsGiven: number

    wickets: number
}

export interface TeamStandingState extends StatefulData {
    rowId: string
    tournamentId: string

    groupName: string
    groupId: string

    teamName: string
    matchesPlayed: number
    matchesWon: number
    matchesLost: number

    pointsMultiplier: number
    points: number

    runsPerWicketRatio: number
    priority: number

    qualified: boolean
}

export interface TournamentState extends StatefulData {
    tournamentId: string
    tournamentName: string

    slugName: string
    seasonNo: number

    startDate: string
    endDate: string
    stage: TournamentStage

    participants: number
    totalTeams: number

    totalMatches: number
    matchesDone: number

    serverLink: string
    bannerLink: string
    embedThemeLink: string
    championsTeam: string
}
