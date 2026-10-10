import { useState, useEffect } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import FormField from "@/components/common/FormField";

import { Button } from "@/components/ui/button";
import { getApplicationById, updateApplication } from "@/services/applicationService";

function EditApplication() {
    const navigate = useNavigate()
    const { id } = useParams()

    const [formData, setFormData] = useState({ company: '', jobTitle: '', jobUrl: '', location: '', employmentType: 'Full-time', status: 'Applied', appliedDate: '' })

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const loadApplication = async () => {
            try {
                setLoading(true)
                setError(null)
                const data = await getApplicationById(id)
                const application = data.application

                setFormData({
                    company: application.company || '', jobTitle: application.jobTitle || '',
                    jobUrl: application.jobUrl || '', location: application.location || '',
                    employmentType: application.employmentType || 'Full-time', status: application.status || 'Applied',
                    appliedDate: application.appliedDate ? application.appliedDate.slice(0, 10) : ''
                })
            }
            catch (error) {
                console.error('Failed to load application.', error)
                setError(error.response?.data?.message || 'Failed to load application.')
            }
            finally {
                setLoading(false)
            }
        }
        loadApplication()
    }, [id])

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData((previous) => ({ ...previous, [name]: value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            setSaving(true)
            setError(null)
            await updateApplication(id, formData)
            navigate(`/applications/${id}`)
        }
        catch (error) {
            console.error('Failed to update application', error)
            setError(error.response?.data?.message || 'Failed to update application.')
        }
        finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <PageContainer>
                <div className="max-w-4xl">
                    <p className="text-sm text-muted-foreground">Loading application...</p>
                </div>
            </PageContainer>
        )
    }

    if (error) {
        return (
            <PageContainer>
                <div className="max-w-4xl">
                    <Button variant="ghost" className="-ml-2 mb-6" onClick={() => navigate(`/applications/${id}`)}>
                        <ArrowLeft className="mr-2 h-4 w-4" />Back to Application
                    </Button>
                    <p className="text-sm text-destructive">{error}</p>
                </div>
            </PageContainer>
        )
    }

    return (
        <PageContainer>
            <div className="max-w-4xl space-y-8">
                <div className="space-y-4">
                    <Button variant="ghost" className="-ml-2" onClick={() => navigate(`/applications/${id}`)}>
                        <ArrowLeft className="mr-2 h-4 w-4" />Back to Application
                    </Button>
                    <PageHeader title="Edit Application" description="Update the details of your job application." />
                </div>

                <form onSubmit={handleSubmit} className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
                    <div className="grid gap-6 sm:grid-cols-2">
                        <FormField id="company" label="Company" required>
                            <input id="company" name="company" type="text" value={formData.company} onChange={handleChange} required
                                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                        </FormField>

                        <FormField id="jobTitle" label="Job Title" required>
                            <input id="jobTitle" name="jobTitle" type="text" value={formData.jobTitle} onChange={handleChange} required
                                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                        </FormField>

                        <div className="sm:col-span-2">
                            <FormField id="jobUrl" label="Job URL">
                            <input id="jobUrl" name="jobUrl" type="url" value={formData.jobUrl} onChange={handleChange} placeholder="https://example.com/job"
                                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                            </FormField>
                        </div>

                        <FormField id="location" label="Location">
                            <input id="location" name="location" type="text" value={formData.location} onChange={handleChange} placeholder="Delhi, Remote, Hyderabad..."
                                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                        </FormField>

                        <FormField id="employmentType" label="Employment Type">
                            <select id="employmentType" name="employmentType" value={formData.employmentType} onChange={handleChange}
                                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" >
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Internship">Internship</option>
                                <option value="Freelance">Freelance</option>
                            </select>
                        </FormField>

                        <FormField id="status" label="Status">
                            <select id="status" name="status" value={formData.status} onChange={handleChange}
                                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" >
                                <option value="Wishlist">Wishlist</option>
                                <option value="Applied">Applied</option>
                                <option value="Screening">Screening</option>
                                <option value="Interview">Interview</option>
                                <option value="Offer">Offer</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Withdrawn">Withdrawn</option>
                            </select>
                        </FormField>

                        <FormField id="appliedDate" label="Applied Date">
                            <input id="appliedDate" name="appliedDate" type="date" value={formData.appliedDate} onChange={handleChange}
                                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                        </FormField>
                    </div>

                    {error && (<p className="mt-6 text-sm text-destructive">{error}</p>)}
                    <div className="mt-8 flex items-center justify-end gap-3 border-t border-border/60 pt-6">
                        <Button type="button" variant="outline" onClick={() => navigate(`/applications/${id}`)}>Cancel</Button>
                        <Button type="submit" disabled={saving} > <Save className="mr-2 h-4 w-4" /> {saving ? "Saving..." : "Save Changes"} </Button>
                    </div>
                </form>
            </div>
        </PageContainer>
    )
}

export default EditApplication