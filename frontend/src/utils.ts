import CryptoJS from 'crypto-js'
import ObjectID from 'bson-objectid'
import { camelToSnake, snakeToCamel } from './types/generics'

export const INVITE_BOT_LINK = `https://discord.com/oauth2/authorize?client_id=753191385296928808&permissions=1144388672&scope=bot%20applications.commands`

export const HCL_SERVER_LINK = `https://discord.gg/handcricket`

export const BOTS_SERVER_LINK = `https://discord.gg/KcJMNdWb3v`

export const DefaultMetaData = {
    OG_SITE_NAME: 'hctournaments',
    OG_MAIN_TITLE: 'hctournaments',
    OG_DESCRIPTION: 'HandCricket Tournaments at one place'
}

export function hasTournamentStarted(start_date: string): [boolean, string] {
    const rtf = new Intl.RelativeTimeFormat('en', { style: 'short' })
    const parsedDate = new Date(start_date)

    const currentTimeDiff = parsedDate.getTime() - Date.now()
    const relativeDate = rtf.format(Math.floor(currentTimeDiff / 1000 / 60 / 60 / 24), 'day')

    return [currentTimeDiff < 0, relativeDate]
}

/**
 * Pass a future date time and get a relative time string telling
 * how much time is left for it to happen
 * @param date The date string (must be in ISO 8601 format)
 * @returns A relative time string telling how much time is left
 * for the provided time to occur
 *
 * If the time that was provided is in past, then it returns an empty string
 */
export function getRelativeTimeFrom(date: string): string {
    const targetDate = new Date(date)
    const currentTime = new Date()
    const timeDiff = (targetDate.getTime() - currentTime.getTime()) / 1000

    const days = Math.floor(timeDiff / 86400) // 86400 seconds in a day
    const hours = Math.floor((timeDiff % 86400) / 3600) // 3600 seconds in an hour
    const minutes = Math.floor((timeDiff % 3600) / 60) // 60 seconds in a minute

    const parts: string[] = []

    if (days > 0) {
        parts.push(`${days}d`)
    }

    if (hours > 0) {
        parts.push(`${hours}h`)
    }

    if (minutes > 0) {
        parts.push(`${minutes}m`)
    }

    return parts.join(' ')
}

/**
 * Get a MongoDB like Object Id which is 24 characters long (fixed-length)
 * @returns A 24 character long hex string
 */
export function getUniqueId(): string {
    return ObjectID().toHexString()
}

/**
 * Encrypt the given string using CryptoJS
 * @param value A string value that should be encrypted
 * @returns Encrypted value of the string
 */
export function encrypt(value: string): string {
    const passphrase: string = process.env.ENCRYPT_PASSPHRASE as string
    const encryptedValue = CryptoJS.AES.encrypt(value, passphrase).toString()

    return encryptedValue
}

/**
 * Decrypt the given string value using CryptoJS
 * @param value A string that should be decrypted
 * @returns Decrypted value of the string
 */
export function decrypt(value: string): string {
    const passphrase: string = process.env.ENCRYPT_PASSPHRASE as string
    const decryptedValue = CryptoJS.AES.decrypt(value, passphrase).toString(CryptoJS.enc.Utf8)

    return decryptedValue
}

/**
 * Convert the given string sentence as complete lowercase
 * with all spaces replaced with hyphens (like kebab-case)
 * @param input Sentence or word to convert
 * @returns A lower-kebab-case string
 */
export function pathAsId(input: string): string {
    return input.toLowerCase().replace(/\s+/g, '-')
}

/**
 * Utility to interpret seconds easily
 * @param number The duration in **seconds**
 * @returns Milliseconds that JavaScript understands
 */
export function seconds(number: number): number {
    return number * 1000
}

/**
 * Convert given object's keys from snake_case to camelCase
 * @param object The object with snake_case like keys
 * @returns A new object with camelCase like keys. Values are not modified
 */
export function convertSnakeCaseToCamelCase<T extends object>(
    object: T
): { [key in keyof T as snakeToCamel<key & string>]: T[key] } {
    return {
        ...Object.keys(object).reduce(
            (newObject, key) => {
                const camelCaseKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
                newObject[camelCaseKey] = object[key as keyof T]

                return newObject
            },
            {} as Record<string, unknown>
        )
    } as never
}

/**
 * Convert given object's keys from camelCase to snake_case
 * @param object The object with camelCase like keys
 * @returns A new object with snake_case like keys. Values are not modified
 */
export function convertCamelCaseToSnakeCase<T extends object>(
    object: T
): { [key in keyof T as camelToSnake<key & string>]: T[key] } {
    return {
        ...Object.keys(object).reduce(
            (newObject, key) => {
                const snake_case_key = key.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`)
                newObject[snake_case_key] = object[key as keyof T]

                return newObject
            },
            {} as Record<string, unknown>
        )
    } as never
}
