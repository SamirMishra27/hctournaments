import { InfoApiPayloadData } from './types'
import axios, { AxiosResponse } from 'axios'

export const axiosApi = axios.create({
    baseURL: process.env.API_ROUTE
})

export async function getTournamentInfoData(tournament: string) {
    const path = '/tournaments/' + tournament

    let response: AxiosResponse
    try {
        response = await axiosApi.get(path)
    } catch (error) {
        return undefined
    }
    const data = response.data as InfoApiPayloadData

    return data
}
