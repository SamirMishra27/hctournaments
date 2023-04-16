import { InfoApiPayloadData } from './types'
import axios from 'axios'

export const axiosApi = axios.create({
    baseURL: process.env.API_ROUTE
})

export async function getTournamentInfoData(tournament: string) {
    const path = '/tournaments/' + tournament

    const response = await axiosApi.get(path)
    const data = response.data as InfoApiPayloadData

    return data
}
