import {
    AdminData,
    HostData,
    MatchData,
    PlayerStatisticData,
    TeamStandingData,
    TournamentData
} from './structures'
import { BasePayloadResponse } from './generics'

export type AdminsPayload = AdminData[]

export type ImageUrls = Record<string, string>

export type TournamentPayload = TournamentData

export interface MatchesPayload extends BasePayloadResponse {
    matches: MatchData[]
}

export interface PlayerStatsPayload extends BasePayloadResponse {
    player_stats: PlayerStatisticData[]
}

export interface TeamStandingsPayload extends Omit<BasePayloadResponse, 'embed_image_url'> {
    embed_image_urls: ImageUrls
    team_standings: TeamStandingData[]
}

export interface HostsPayload extends Omit<BasePayloadResponse, 'embed_image_url'> {
    hosts: HostData[]
}

export interface DiscordUserPayload {
    id: string
    username: string
    avatar: string
    discriminator: string
    public_flags: number
    flags: number
    banner: string
    accent_color: number | null
    global_name: string
    avatar_decoration_data: string | null
    banner_color: null
}
