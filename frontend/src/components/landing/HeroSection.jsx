import { Link } from "react-router-dom"
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react"

import LandingHeader from "@/components/landing/LandingHeader"
import DashboardPreview from "@/components/landing/DashboardPreview"
import FeatureStrip from "@/components/landing/FeatureStrip"

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-hero"

function HeroSection() {
    return (
        <div id="top" className="relative isolate overflow-hidden bg-hero text-hero-foreground">
            <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[38rem] w-[38rem] rounded-full bg-primary/40 blur-3xl" />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -left-40 -z-10 h-[30rem] w-[30rem] rounded-full bg-hero-foreground/10 blur-3xl" />

            <LandingHeader />

            <section className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-14 pt-10 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:px-12 lg:pb-20 lg:pt-14">
                <div>
                    <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-hero-foreground/25 bg-hero-foreground/10 px-4 py-2 text-xs font-medium sm:text-sm">
                        <Sparkles size={15} aria-hidden="true" />A more organized way to job hunt
                    </div>

                    <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                        The Smart Way to Track Your Job Applications with{" "}
                        <span className="font-serif italic">JobTrack.</span>
                    </h1>

                    <p className="mt-6 max-w-xl text-base leading-7 text-hero-foreground/80 sm:text-lg sm:leading-8">
                        Organize applications, track interviews, schedule follow-ups, and see your progress, all in one private workspace.
                    </p>

                    <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Link to="/register" className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-hero-foreground px-7 py-3 text-sm font-semibold text-hero transition-transform hover:-translate-y-0.5 ${focusRing}`}>
                            Get Started <ArrowRight size={17} aria-hidden="true" />
                        </Link>
                        <a href="#how-it-works" className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-hero-foreground/50 px-7 py-3 text-sm font-medium transition-colors hover:bg-hero-foreground/10 ${focusRing}`}>
                            See how it works <ChevronDown size={16} aria-hidden="true" />
                        </a>
                    </div>

                    <p className="mt-4 text-xs text-hero-foreground/70">Create an account to start tracking your job search.</p>
                </div>

                <DashboardPreview />
            </section>

            <FeatureStrip />
        </div>
    )
}

export default HeroSection