export const INVITE_BOT_LINK = `https://discord.com/oauth2/authorize?client_id=753191385296928808&permissions=1144388672&scope=bot%20applications.commands`

export const HCL_SERVER_LINK = `https://discord.gg/handcricket`

export const BOTS_SERVER_LINK = `https://discord.gg/KcJMNdWb3v`

export const DefaultMetaData = {
    OG_SITE_NAME: 'hctournaments',
    OG_MAIN_TITLE: 'hctournaments',
    OG_DESCRIPTION: 'HandCricket Tournaments at one place'
}

export function hasTournamentStarted(start_date: string) {
    const rtf = new Intl.RelativeTimeFormat('en', { style: 'short' })
    const parsedDate = new Date(start_date)

    const currentTimeDiff = parsedDate.getTime() - Date.now()
    const relativeDate = rtf.format(Math.floor(currentTimeDiff / 1000 / 60 / 60 / 24), 'day')

    return [currentTimeDiff < 0, relativeDate]
}
