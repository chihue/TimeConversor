export type CountryInfo = {
    name: string;
    flag: string;
    timezones: string[];
};

export type ContinentsWithCountries = Record<string, Record<string, CountryInfo>>;

