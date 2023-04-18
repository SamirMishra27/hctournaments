import { InfoApiPayloadData } from './types'
import axios, { AxiosError, AxiosResponse } from 'axios'
import https from 'https'

const httpsAgent = new https.Agent({
    rejectUnauthorized: false
})

export const axiosApi = axios.create({
    baseURL: process.env.API_ROUTE,
    httpsAgent: httpsAgent
})

export async function getTournamentInfoData(tournament: string) {
    const path = '/tournaments/' + tournament

    let response: AxiosResponse
    try {
        response = await axiosApi.get(path)
    } catch (error) {
        console.log((error as AxiosError).cause, (error as AxiosError).stack)

        return undefined
    }
    const data = response.data as InfoApiPayloadData

    return data
}
