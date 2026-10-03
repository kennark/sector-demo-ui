export type UserEntryRequest = {
    id: number | null,
    name: string,
    sectorIds: string[],
    agreeTerms: boolean
}