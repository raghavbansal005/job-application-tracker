import { useState } from "react"
import { ArrowLeft, Save } from "lucide-react"
import { useNavigate } from "react-router-dom"

import PageContainer from "@/components/layout/PageContainer"
import PageHeader from "@/components/layout/PageHeader"

import { Button } from "@/components/ui/button"
import { createApplication } from "@/services/applicationService"

function NewApplication() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({ company: "", jobTitle: "", jobUrl: "", location: "", employmentType: "Full-time", status: "Applied", appliedDate: "" })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData((previous) => ({ ...previous, [name]: value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            setLoading(true)
            setError(null)

            await createApplication(formData)
            navigate("/applications")
        }
        catch (error) {
            console.error("Failed to create application:", error)
            setError(error.response?.data?.message || "Failed to create application.")
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <PageContainer>
            <div className="max-w-6xl space-y-8">
                <div className="space-y-4">
                    <Button variant="ghost" className="-ml-2" onClick={() => navigate("/applications")}>
                        <ArrowLeft className="mr-2 h-4 w-4" />Back to Applications
                    </Button>
                    <PageHeader title="Add Application" description="Add a new job application to your tracker." />
                </div>

                <form onSubmit={handleSubmit} className="rounded-xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-base font-semibold text-foreground">Application Details</h2>
                            <p className="mt-1 text-sm text-muted-foreground">Add the basic information about the job you're applying for.</p>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label htmlFor="company" className="text-sm font-medium text-foreground">Company<span className="ml-1 text-destructive">*</span></label>
                                <input id="company" name="company" type="text" value={formData.company} onChange={handleChange} placeholder="e.g. Google" required
                                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20" />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="jobTitle" className="text-sm font-medium text-foreground">Job Title<span className="ml-1 text-destructive">*</span></label>
                                <input id="jobTitle" name="jobTitle" type="text" value={formData.jobTitle} onChange={handleChange} placeholder="e.g. Software Engineer" required
                                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="jobUrl" className="text-sm font-medium text-foreground">Job URL</label>
                            <input id="jobUrl" name="jobUrl" type="url" value={formData.jobUrl} onChange={handleChange} placeholder="https://example.com/job"
                                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
                            />
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label htmlFor="location" className="text-sm font-medium text-foreground">Location</label>
                                <input id="location" name="location" type="text" value={formData.location} onChange={handleChange} placeholder="e.g. Delhi"
                                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="employmentType" className="text-sm font-medium text-foreground">Employment Type</label>
                                <select id="employmentType" name="employmentType" value={formData.employmentType} onChange={handleChange}
                                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
                                >
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Internship">Internship</option>
                                    <option value="Freelance">Freelance</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label htmlFor="status" className="text-sm font-medium text-foreground">Status</label>
                                <select id="status" name="status" value={formData.status} onChange={handleChange}
                                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
                                >
                                    <option value="Wishlist">Wishlist</option>
                                    <option value="Applied">Applied</option>
                                    <option value="Screening">Screening</option>
                                    <option value="Interview">Interview</option>
                                    <option value="Offer">Offer</option>
                                    <option value="Rejected">Rejected</option>
                                    <option value="Withdrawn">Withdrawn</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="appliedDate" className="text-sm font-medium text-foreground">Applied Date</label>
                                <input id="appliedDate" name="appliedDate" type="date" value={formData.appliedDate} onChange={handleChange}
                                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
                                />
                            </div>
                        </div>

                        {error && (<div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3">
                            <p className="text-sm text-destructive">{error}</p>
                        </div>
                        )}

                        <div className="flex flex-col-reverse gap-3 border-t border-border/60 pt-6 sm:flex-row sm:justify-end">
                            <Button type="button" variant="outline" onClick={() => navigate("/applications")} disabled={loading}>Cancel</Button>
                            <Button type="submit" disabled={loading}>
                                <Save className="mr-2 h-4 w-4" /> {loading ? "Saving..." : "Save Application"}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </PageContainer>
    )
}

export default NewApplication