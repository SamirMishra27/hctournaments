import { ParsedUrlQuery } from 'querystring'

export interface Params extends ParsedUrlQuery {
    tournament: string
}

export interface ApiResponseData {
    cloudinary_url: string
    data: { [key: string]: unknown }
    message: string
    success: boolean
}
