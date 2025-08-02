"use client"

import React, { useState } from "react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { flag } from 'country-emoji'
import { ContinentsWithCountries } from "@/types"

type Props = {
    value: string;
    onValueChange: (value: string) => void;
    error?: boolean;
    continents: ContinentsWithCountries;
}

function TimeZoneSelector({ value, onValueChange, error = false, continents }: Props) {
    const [filter, setFilter] = useState("")

    return (
        <Select value={value} onValueChange={onValueChange} >
            <SelectTrigger
                className={cn(
                    "w-full max-w-full truncate", // evita que crezca, corta texto
                    error && "border-red-500 border-2 focus:border-red-500 focus:ring-red-500"
                )}
            >
                <SelectValue placeholder="Select a timezone" className="truncate" />
            </SelectTrigger>
            <SelectContent>
                <div className="p-2">
                    <input
                        type="text"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        placeholder="Filtrar por país o zona horaria"
                        className="w-full px-2 py-1 border rounded"
                    />
                </div>
                {Object.entries(continents).map(([continent, countries]) => {
                    // Para cada continente, filtrar países con al menos una coincidencia
                    const filteredCountries = Object.entries(countries).filter(([countryCode, countryInfo]) => {
                        const matchName = countryInfo.name.toLowerCase().includes(filter.toLowerCase());
                        const matchTimezone = countryInfo.timezones.some(tz =>
                            tz.toLowerCase().includes(filter.toLowerCase())
                        );
                        return matchName || matchTimezone;
                    });

                    // Si no hay países que coincidan, no renderizar el continente
                    if (filteredCountries.length === 0) return null;

                    return (
                        <SelectGroup key={`continent-${continent}`}>
                            <SelectLabel className="font-bold">{continent}</SelectLabel>
                            {filteredCountries.map(([countryCode, countryInfo]) => {
                                // Filtrar zonas horarias por el filtro (aunque ya haya pasado el país por el filtro del nombre)
                                const matchedTimezones = countryInfo.timezones.filter(tz =>
                                    tz.toLowerCase().includes(filter.toLowerCase()) ||
                                    countryInfo.name.toLowerCase().includes(filter.toLowerCase())
                                );

                                return matchedTimezones.map((tz) => (
                                    <SelectItem key={`${countryCode}_${tz}`} value={`${countryCode}=${tz}`}>
                                        <span className="mr-2">{flag(countryCode)}</span>
                                        {countryInfo.name} - {tz}
                                    </SelectItem>
                                ));
                            })}
                        </SelectGroup>
                    );
                })}
            </SelectContent>
        </Select>
    )
}

export default TimeZoneSelector
