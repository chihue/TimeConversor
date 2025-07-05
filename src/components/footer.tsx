import Link from "next/link"
import { Globe, Heart, Github, Twitter, Mail } from "lucide-react"

export function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Globe className="h-6 w-6 text-primary" />
                            <span className="font-bold text-lg">TimeZone Converter</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Convierte fechas y horas entre diferentes zonas horarias del mundo de manera fácil y rápida.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold">Enlaces Rápidos</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                                    Conversor
                                </Link>
                            </li>
                            <li>
                                <Link href="#about" className="text-muted-foreground hover:text-primary transition-colors">
                                    Acerca de
                                </Link>
                            </li>
                            <li>
                                <Link href="#contact" className="text-muted-foreground hover:text-primary transition-colors">
                                    Contacto
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold">Recursos</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    Guía de Uso
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    Soporte
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold">Síguenos</h3>
                        <div className="flex space-x-4">
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Github className="h-5 w-5" />
                                <span className="sr-only">GitHub</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Mail className="h-5 w-5" />
                                <span className="sr-only">Email</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} TimeZone Converter. Todos los derechos reservados.
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-2 sm:mt-0">
                        Hecho con <Heart className="h-4 w-4 text-red-500" /> para el mundo
                    </p>
                </div>
            </div>
        </footer>
    )
}
