"use client"

import { useState } from "react"
import { CalendarIcon, Clock, Globe, Sun, Moon, ArrowLeftRight } from "lucide-react"
import { format, set } from "date-fns"
import { es } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const countries = [
    { name: "España", timezone: "Europe/Madrid", flag: "🇪🇸" },
    { name: "Estados Unidos (Nueva York)", timezone: "America/New_York", flag: "🇺🇸" },
    { name: "Estados Unidos (Los Ángeles)", timezone: "America/Los_Angeles", flag: "🇺🇸" },
    { name: "Reino Unido", timezone: "Europe/London", flag: "🇬🇧" },
    { name: "Francia", timezone: "Europe/Paris", flag: "🇫🇷" },
    { name: "Alemania", timezone: "Europe/Berlin", flag: "🇩🇪" },
    { name: "Italia", timezone: "Europe/Rome", flag: "🇮🇹" },
    { name: "Japón", timezone: "Asia/Tokyo", flag: "🇯🇵" },
    { name: "China", timezone: "Asia/Shanghai", flag: "🇨🇳" },
    { name: "Australia (Sídney)", timezone: "Australia/Sydney", flag: "🇦🇺" },
    { name: "Brasil", timezone: "America/Sao_Paulo", flag: "🇧🇷" },
    { name: "Argentina", timezone: "America/Argentina/Buenos_Aires", flag: "🇦🇷" },
    { name: "México", timezone: "America/Mexico_City", flag: "🇲🇽" },
    { name: "Canadá", timezone: "America/Toronto", flag: "🇨🇦" },
    { name: "India", timezone: "Asia/Kolkata", flag: "🇮🇳" },
    { name: "Rusia (Moscú)", timezone: "Europe/Moscow", flag: "🇷🇺" },
]

export default function TimeConversor() {
    const [date, setDate] = useState<Date>(new Date())
    const [time, setTime] = useState(() => {
        const now = new Date()
        return `${now.getHours().toString().padStart(2, '0')}:00`
    }) // Hora actual del sistema con minutos en 00
    const [fromCountry, setFromCountry] = useState("")
    const [toCountry, setToCountry] = useState("")
    const [convertedTime, setConvertedTime] = useState<string>("")
    const [hourlyConversions, setHourlyConversions] = useState<
        Array<{
            hour: string
            originTime: string
            originDate: string
            originIsDay: boolean
            targetTime: string
            targetDate: string
            targetIsDay: boolean
        }>
    >([])

    const [inputErrors, setInputErrors]  = useState({
        date: false,
        fromCountry: false,
        toCountry: false,
        time: false,
    })

    const handleConvert = () => {
        const errors = {
            date: false,
            fromCountry: false,
            toCountry: false,
            time: false,
        }
        if (!date)errors.date = true
        if (!fromCountry)errors.fromCountry = true
        if (!toCountry)errors.toCountry = true
        if (!time || !/^\d{2}:\d{2}$/.test(time)) {
            errors.time = true
        }

        setInputErrors(errors)

        if (errors.date || errors.fromCountry || errors.toCountry || errors.time) {
            console.info("Error en los campos de entrada:", errors)
            return
        }



        const fromTimezone = countries.find((c) => c.name === fromCountry)?.timezone
        const toTimezone = countries.find((c) => c.name === toCountry)?.timezone

        if (!fromTimezone || !toTimezone) return

        // Crear fecha con la hora seleccionada
        const [hours, minutes] = time.split(":").map(Number)
        const selectedDateTime = new Date(date)
        selectedDateTime.setHours(hours, minutes, 0, 0)

        // Convertir a la zona horaria de destino
        const convertedDate = new Date(selectedDateTime.toLocaleString("en-US", { timeZone: fromTimezone }))
        const targetTime = new Date(convertedDate.getTime()).toLocaleString("es-ES", {
            timeZone: toTimezone,
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        })

        setConvertedTime(targetTime)

        // Generar conversiones para las 24 horas del día
        const conversions = []
        for (let hour = 0; hour < 24; hour++) {
            const baseDate = new Date(date)
            baseDate.setHours(hour, 0, 0, 0)

            // Crear fechas específicas para cada zona horaria
            const originDate = new Date(baseDate.toLocaleString("en-US", { timeZone: fromTimezone }))
            const targetDate = new Date(baseDate.toLocaleString("en-US", { timeZone: toTimezone }))

            // Hora en el país de origen
            const originTime = baseDate.toLocaleString("es-ES", {
                timeZone: fromTimezone,
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            })

            // Fecha en el país de origen
            const originDateStr = baseDate.toLocaleString("es-ES", {
                timeZone: fromTimezone,
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            })

            // Hora en el país de destino
            const targetTime = baseDate.toLocaleString("es-ES", {
                timeZone: toTimezone,
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            })

            // Fecha en el país de destino
            const targetDateStr = baseDate.toLocaleString("es-ES", {
                timeZone: toTimezone,
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            })

            // Determinar si es día o noche (6:00 - 20:00 = día)
            const originHour = Number.parseInt(originTime.split(":")[0])
            const targetHour = Number.parseInt(targetTime.split(":")[0])

            const isOriginDay = originHour >= 6 && originHour < 20
            const isTargetDay = targetHour >= 6 && targetHour < 20

            conversions.push({
                hour: hour.toString().padStart(2, "0"),
                originTime: originTime,
                originDate: originDateStr,
                originIsDay: isOriginDay,
                targetTime: targetTime,
                targetDate: targetDateStr,
                targetIsDay: isTargetDay,
            })
        }

        setHourlyConversions(conversions)
    }

    const handleSwapCountries = () => {
        const temp = fromCountry
        setFromCountry(toCountry)
        setToCountry(temp)
    }

    const getTimeDifference = () => {
        if (!date || !fromCountry || !toCountry) return ""

        const fromTimezone = countries.find((c) => c.name === fromCountry)?.timezone
        const toTimezone = countries.find((c) => c.name === toCountry)?.timezone

        if (!fromTimezone || !toTimezone) return ""

        // Crear una fecha base específica
        const baseDate = new Date(date)
        baseDate.setHours(12, 0, 0, 0)

        // Obtener la hora en cada zona horaria
        const fromTimeStr = baseDate.toLocaleString("en-CA", { 
            timeZone: fromTimezone, 
            hour12: false, 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit' 
        })
        const toTimeStr = baseDate.toLocaleString("en-CA", { 
            timeZone: toTimezone, 
            hour12: false, 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit' 
        })

        // Convertir a objetos Date y calcular diferencia
        const fromTime = new Date(fromTimeStr)
        const toTime = new Date(toTimeStr)
        
        const diffInMs = toTime.getTime() - fromTime.getTime()
        const diffInHours = Math.round(diffInMs / (1000 * 60 * 60))

        if (diffInHours > 0) {
            return `+${diffInHours}h`
        } else if (diffInHours < 0) {
            return `${diffInHours}h`
        } else {
            return "0h"
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
                        <Globe className="h-8 w-8" />
                        Conversor de Zonas Horarias
                    </h1>
                    <p className="text-muted-foreground text-lg">Convierte fechas y horas entre diferentes países del mundo</p>
                </div>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Configuración de Conversión
                        </CardTitle>
                        <CardDescription>Selecciona la fecha, hora y países para realizar la conversión</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="from-country">País de origen</Label>
                                <Select value={fromCountry} onValueChange={setFromCountry}>
                                    <SelectTrigger className={cn(inputErrors.fromCountry && "border-red-500 border-2 focus:border-red-500 focus:ring-red-500")}>
                                        <SelectValue placeholder="Selecciona el país de origen" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {countries.map((country) => (
                                            <SelectItem key={country.name} value={country.name}>
                                                <span className="flex items-center gap-2">
                                                    {country.flag} {country.name}
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="to-country">País de destino</Label>
                                <Select value={toCountry} onValueChange={setToCountry}>
                                    <SelectTrigger className={cn(inputErrors.toCountry && "border-red-500 border-2 focus:border-red-500 focus:ring-red-500")}>
                                        <SelectValue placeholder="Selecciona el país de destino" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {countries.map((country) => (
                                            <SelectItem key={country.name} value={country.name}>
                                                <span className="flex items-center gap-2">
                                                    {country.flag} {country.name}
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleSwapCountries}
                                disabled={!fromCountry || !toCountry}
                                className="flex items-center gap-2 bg-transparent"
                            >
                                <ArrowLeftRight className="h-4 w-4" />
                                Intercambiar países
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Fecha</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal", 
                                                !date && "text-muted-foreground",
                                                inputErrors.date && "border-red-500 border-2 focus:border-red-500 focus:ring-red-500"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar mode="single" selected={date} onSelect={(newDate) => newDate && setDate(newDate)} initialFocus />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="time">Hora</Label>
                                <Input 
                                    id="time" 
                                    type="time" 
                                    value={time} 
                                    onChange={(e) => setTime(e.target.value)} 
                                    className={cn(inputErrors.time && "border-red-500 border-2 focus:border-red-500 focus:ring-red-500")}
                                />
                            </div>
                        </div>

                        <Button onClick={handleConvert} className="w-full" size="lg">
                            <Clock className="mr-2 h-4 w-4" />
                            Convertir Zona Horaria
                        </Button>
                    </CardContent>
                </Card>

                {convertedTime && (
                    <Card className="border-primary">
                        <CardHeader>
                            <CardTitle className="text-primary">Resultado de la Conversión</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                    <div className="text-center">
                                        <div className="text-sm text-muted-foreground mb-1">Desde</div>
                                        <div className="font-semibold">
                                            {countries.find((c) => c.name === fromCountry)?.flag} {fromCountry}
                                        </div>
                                        <div className="text-sm">
                                            {date && format(date, "PPP", { locale: es })} - {time}
                                        </div>
                                    </div>

                                    <div className="flex justify-center">
                                        <div className="bg-primary/10 rounded-full p-3 flex flex-col items-center">
                                            <Clock className="h-6 w-6 text-primary mb-1" />
                                            <span className="text-xs font-semibold text-primary">{getTimeDifference()}</span>
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <div className="text-sm text-muted-foreground mb-1">Hacia</div>
                                        <div className="font-semibold">
                                            {countries.find((c) => c.name === toCountry)?.flag} {toCountry}
                                        </div>
                                        <div className="text-lg font-bold text-primary">{convertedTime}</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {hourlyConversions.length > 0 && (
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Tabla de Conversión Completa - {date && format(date, "PPP", { locale: es })}
                            </CardTitle>
                            <CardDescription>
                                Comparación de todas las horas del día entre {fromCountry} y {toCountry}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    {countries.find((c) => c.name === fromCountry)?.flag}
                                                    <span className="font-semibold">{fromCountry}</span>
                                                </div>
                                            </TableHead>
                                            <TableHead className="text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    {countries.find((c) => c.name === toCountry)?.flag}
                                                    <span className="font-semibold">{toCountry}</span>
                                                </div>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {hourlyConversions.map((conversion, index) => (
                                            <TableRow
                                                key={index}
                                                className={conversion.originTime === time ? "bg-primary/10" : ""}
                                            >
                                                <TableCell className="text-center py-1">
                                                    <div className="flex flex-col items-center space-y-1">
                                                        <div className="flex items-center gap-1">
                                                            <span className="font-mono text-base font-semibold">
                                                                {conversion.originTime}
                                                            </span>
                                                            {conversion.originIsDay ? (
                                                                <Sun className="h-4 w-4 text-yellow-500" />
                                                            ) : (
                                                                <Moon className="h-4 w-4 text-blue-400" />
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                                                            {conversion.originDate}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center py-1">
                                                    <div className="flex flex-col items-center space-y-1">
                                                        <div className="flex items-center gap-1">
                                                            <span className="font-mono text-base font-semibold">
                                                                {conversion.targetTime}
                                                            </span>
                                                            {conversion.targetIsDay ? (
                                                                <Sun className="h-4 w-4 text-yellow-500" />
                                                            ) : (
                                                                <Moon className="h-4 w-4 text-blue-400" />
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                                                            {conversion.targetDate}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="mt-4 text-sm text-muted-foreground text-center">
                                La fila resaltada corresponde a la hora seleccionada ({time})
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}