import { ContinentsWithCountries } from '@/types';
import * as ct from 'countries-and-timezones'

// Helper para obtener el emoji de la bandera a partir del código de país (ISO Alpha-2)
function getFlagEmoji(countryCode: string): string {
    return countryCode
        .toUpperCase()
        .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

export function getAllTimezones(): Record<ct.TimezoneName, ct.Timezone> {
    return ct.getAllTimezones();
}

export function getContinentsWithCountries(): ContinentsWithCountries {
    const continents: Record<string, Record<string, { name: string; flag: string; timezones: string[] }>> = {};
    const allTimezones = getAllTimezones();

    for (const timezone of Object.values(allTimezones)) {
        if (!timezone.countries) continue;

        const continent = timezone.name.split('/')[0];
        if (continent === 'Etc' || continent === 'UTC' || continent === 'Factory') continue;

        if (!continents[continent]) {
            continents[continent] = {};
        }

        // console.log(`Processing timezone: ${timezone.name} in continent: ${continent}`);

        for (const countryCode of timezone.countries) {
            if (!continents[continent][countryCode]) {
                const country = ct.getCountry(countryCode);
                if (country) {
                    continents[continent][countryCode] = {
                        name: country.name,
                        flag: getFlagEmoji(countryCode),
                        timezones: []
                    };
                }
            }

            // Agregar la zona horaria si no está ya incluida
            const countryEntry = continents[continent][countryCode];
            if (!countryEntry.timezones.includes(timezone.name)) {
                countryEntry.timezones.push(timezone.name);
            }
        }
    }

    return continents;
}
