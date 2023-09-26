export type snakeToCamel<T extends string> = T extends `${infer first}_${infer rest}`
    ? `${first}${snakeToCamel<Capitalize<rest>>}`
    : T

export type camelToSnake<T extends string> = T extends `${infer first}${infer second}${infer rest}`
    ? second extends Uppercase<second>
        ? `${Uncapitalize<first>}_${camelToSnake<`${Uncapitalize<second>}${rest}`>}`
        : `${Uncapitalize<first>}${camelToSnake<`${second}${rest}`>}`
    : T

export type BasePayloadResponse = {
    tournament_id: string
    embed_image_url: string
}

export type ReducerAction<Type> = {
    type: 'CREATE' | 'UPDATE' | 'DELETE' | 'RESET'
    data: Type
    originalData?: Type[]
}

export type StatefulData = {
    created?: boolean
    updated?: boolean
}

export type SendingPayload<T> = {
    added: T[]
    updated: T[]
    deleted: T[]
}
