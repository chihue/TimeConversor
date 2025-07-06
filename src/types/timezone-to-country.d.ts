declare module '@abuhasanrumi/timezone-to-country' {
    export function getCountry(timezone: string): string | undefined;
    export function getTimezoneInfo(timezone: string): { countryCode: string, countryName: string, continent: string } | null;
}