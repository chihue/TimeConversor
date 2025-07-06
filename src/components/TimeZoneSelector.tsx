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
import getTimezoneInfo from '@abuhasanrumi/timezone-to-country'
import { flag, code, name, countries } from 'country-emoji'



function TimeZoneSelector({ value, onValueChange, error = false }: { value: string, onValueChange: (value: string) => void, error: boolean }) {
    const [filter, setFilter] = useState("")

    const timeZonesBYContinent = Intl.supportedValuesOf("timeZone").reduce(
        (acc: Record<string, string[]>, tz) => {
            const continent = tz.split("/")[0]
            if (!acc[continent]) {
                acc[continent] = []
            }
            acc[continent].push(tz)
            return acc
        },
        {}
    )

    const normallizeTimeZone = (tz: string) => {
        const parts = tz.split("/")
        if (parts.length > 1) {
            return parts[1].replace(/_/g, " ")
        }
        return tz
    }

    // Filtrar continentes y zonas horarias
    const filteredContinents = Object.entries(timeZonesBYContinent).filter(
        ([continent, timeZones]) => {
            const continentMatches = continent.toLowerCase().includes(filter.toLowerCase())
            const timeZonesFiltered = timeZones.filter((tz) =>
                normallizeTimeZone(tz).toLowerCase().includes(filter.toLowerCase())
            )
            return continentMatches || timeZonesFiltered.length > 0
        }
    )

    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className={cn("w-full", error && "border-red-500 border-2 focus:border-red-500 focus:ring-red-500")}>
                <SelectValue placeholder="Select a timezone" />
            </SelectTrigger>
            <SelectContent>
                {/* Input para filtrar */}
                <div className="p-2">
                    <input
                        type="text"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        placeholder="Filtrar continente o zona horaria"
                        className="w-full px-2 py-1 border rounded"
                    />
                </div>
                {filteredContinents.map(([continent, timeZones]) => {
                    // Filtrar zonas dentro del continente
                    const filteredTimeZones = timeZones.filter((tz) =>
                        normallizeTimeZone(tz).toLowerCase().includes(filter.toLowerCase())
                    )

                    if (filteredTimeZones.length === 0) return null

                    return (
                        <SelectGroup key={continent}>
                            <SelectLabel>{continent}</SelectLabel>
                            {filteredTimeZones.map((tz) => {
                                const info = getTimezoneInfo(tz)
                                if (info === null) return null // Omitir zonas horarias sin información
                                return (
                                    <SelectItem key={tz} value={tz}>
                                        {flag(info.countryCode)} {normallizeTimeZone(tz)} {name(info.countryCode)} ({code(info.countryCode)})
                                    </SelectItem>
                                )
                            })}
                        </SelectGroup>
                    )
                })}
            </SelectContent>
        </Select>
    )
}

export default TimeZoneSelector
