import { useEffect, useState } from "react";
import { BriefcaseBusiness, CalendarDays, Plus, Trophy, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

import { getDashboard } from "@/services/dashboardService";

import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";

import SummaryCard from "@/components/dashboard/SummaryCard";
import ApplicationStatusChart from "@/components/dashboard/ApplicationStatusChart";
import ApplicationOverTimeChart from "@/components/dashboard/ApplicationOverTimeChart";
import UpcomingInterviews from "@/components/dashboard/UpcomingInterviews";
import FollowUpList from "@/components/dashboard/FollowUpList";

function Dashboard() {
    const navigate = useNavigate()

    const [dashboardData, setDashboardData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true)
                setError(null)

                const data = await getDashboard()
                setDashboardData(data)
            }
            catch (error) {
                console.error('Failed to load dashboard:', error)
                setError(error.response?.data?.message || 'Failed to load dashboard data.')
            }
            finally {
                setLoading(false)
            }
        }
        loadDashboard()
    }, [])

    if (loading) {
        return <PageContainer><p className="text-sm text-muted-foreground">Loading dashboard...</p></PageContainer>
    }
    if (error) {
        return <PageContainer><p className="text-sm text-destructive">{error}</p></PageContainer>
    }

    return (
        <PageContainer>
            <div className="space-y-8">
                <PageHeader title="Dashboard" description="Here's an overview of your job search." action={
                    <Button className="w-full sm:w-auto" onClick={() => navigate("/applications")}>
                        <Plus className="mr-2 h-4 w-4" />Add Application
                    </Button>
                } />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <SummaryCard title="Total Applications" value={dashboardData.summary.totalApplications} description="Applications tracked" icon={BriefcaseBusiness} />
                    <SummaryCard title="Interviews" value={dashboardData.summary.interviews} description="Interviews reached" icon={CalendarDays} />
                    <SummaryCard title="Offers" value={dashboardData.summary.offers} description="Offers received" icon={Trophy} />
                    <SummaryCard title="Rejected" value={dashboardData.summary.rejected} description="Applications rejected" icon={XCircle} />
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                    <ApplicationStatusChart data={dashboardData.applicationByStatus} />
                    <ApplicationOverTimeChart data={dashboardData.applicationOverTime} />
                    <div className="lg:col-span-2">
                        <UpcomingInterviews interviews={dashboardData.upcomingInterviews} />
                    </div>
                    <div className="lg:col-span-2">
                        <FollowUpList followUps={dashboardData.pendingFollowUps} overdueFollowUps={dashboardData.overdueFollowUps} />
                    </div>
                </div>
            </div>
        </PageContainer>
    )
}

export default Dashboard