import axios from 'axios'

export const axiosApi = axios.create({
    baseURL: process.env.API_ROUTE
})
