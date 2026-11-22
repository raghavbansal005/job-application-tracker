import { useState } from "react"
import { Link } from "react-router-dom"
import { BriefcaseBusiness, Menu, X } from "lucide-react"

import ThemeToggle from "@/components/common/ThemeToggle"

const navLinks = [
    { label: "Home", href: "#top" },
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "About", href: "#about" },
]

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-hero"

function LandingHeader() {
    const [menuOpen, setMenuOpen] = useState(false)
    const closeMenu = () => setMenuOpen(false)

    return (
        <header className="relative z-20">
            <nav aria-label="Main navigation" className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
                <Link to="/" onClick={closeMenu} aria-label="JobTrack home" className={`flex items-center gap-2.5 rounded-lg ${focusRing}`}>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-hero-foreground text-hero">
                        <BriefcaseBusiness size={22} aria-hidden="true" />
                    </span>
                    <span className="text-xl font-semibold tracking-tight">JobTrack</span>
                </Link>

                <div className="hidden items-center gap-9 text-sm font-medium lg:flex">
                    {navLinks.map((link, index) => (
                        <a key={link.href} href={link.href} className={`rounded-sm py-1 transition-colors hover:text-hero-foreground ${focusRing} ${index === 0 ? "border-b-2 border-hero-foreground text-hero-foreground" : "text-hero-foreground/80"}`}>
                            {link.label}
                        </a>
                    ))}
                </div>

                <div className="hidden items-center gap-3 lg:flex">
                    <ThemeToggle variant="hero" />
                    <Link to="/login" className={`rounded-full border border-hero-foreground/40 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-hero-foreground/10 ${focusRing}`}>
                        Log in
                    </Link>
                    <Link to="/register" className={`rounded-full bg-hero-foreground px-5 py-2.5 text-sm font-semibold text-hero transition-opacity hover:opacity-90 ${focusRing}`}>
                        Get Started
                    </Link>
                </div>

                <div className="flex items-center gap-3 lg:hidden">
                    <ThemeToggle variant="hero" />
                    <button type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="landing-mobile-menu" aria-label={menuOpen ? "Close menu" : "Open menu"}
                        className={`flex h-11 w-11 items-center justify-center rounded-lg border border-hero-foreground/40 ${focusRing}`}>
                        {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
                    </button>
                </div>
            </nav>

            {menuOpen && (
                <div id="landing-mobile-menu" className="mx-5 rounded-2xl bg-card p-3 text-card-foreground shadow-xl sm:mx-8 lg:hidden">
                    <div className="flex flex-col">
                        {navLinks.map((link) => (
                            <a key={link.href} href={link.href} onClick={closeMenu} className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-muted">{link.label}</a>
                        ))}
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 border-t border-border pt-3">
                        <Link to="/login" onClick={closeMenu} className="rounded-lg border border-border px-4 py-3 text-center text-sm font-medium hover:bg-muted">Log in</Link>
                        <Link to="/register" onClick={closeMenu} className="rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground hover:opacity-90">Get Started</Link>
                    </div>
                </div>
            )}
        </header>
    )
}

export default LandingHeader