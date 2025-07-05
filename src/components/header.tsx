"use client"

import { useState } from "react"
import Link from "next/link"
import { Globe, Menu, Clock, Info, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"

const navigation = [
    { name: "Inicio", href: "/", icon: Globe },
    { name: "Conversor", href: "/", icon: Clock },
    { name: "Acerca de", href: "#about", icon: Info },
    { name: "Contacto", href: "#contact", icon: Mail },
]

export function Header() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <Globe className="h-6 w-6 text-primary" />
                            <span className="font-bold text-xl">TimeZone Converter</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        {navigation.map((item) => {
                            const Icon = item.icon
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary"
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{item.name}</span>
                                </Link>
                            )
                        })}
                    </nav>

                    <div className="flex items-center space-x-4">
                        <ThemeToggle />

                        {/* Mobile Navigation */}
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild className="md:hidden">
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Abrir menú</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                <div className="flex flex-col space-y-4 mt-4">
                                    <div className="flex items-center space-x-2 pb-4 border-b">
                                        <Globe className="h-6 w-6 text-primary" />
                                        <span className="font-bold text-lg">TimeZone Converter</span>
                                    </div>
                                    {navigation.map((item) => {
                                        const Icon = item.icon
                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className="flex items-center space-x-3 text-sm font-medium transition-colors hover:text-primary py-2"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                <Icon className="h-4 w-4" />
                                                <span>{item.name}</span>
                                            </Link>
                                        )
                                    })}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    )
}