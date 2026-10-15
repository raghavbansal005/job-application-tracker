import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const statusColor = {
    Wishlist: "var(--chart-3)", Applied: "var(--chart-1)",
    Screening: "var(--chart-2)", Interview: "var(--chart-4)",
    Offer: "var(--chart-5)", Rejected: "var(--destructive)",
    Withdrawn: "var(--muted-foreground)"
}

function ApplicationStatusChart({ data }) {
    const chartData = data.map((item) => ({ status: item._id, count: item.count }))
    const totalApplications = chartData.reduce((total, item) => total + item.count, 0)

    if (totalApplications === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Application Status</CardTitle>
                </CardHeader>

                <CardContent>
                    <div className='flex h-[300px] items-center justify-center'>
                        <p className='text-sm text-muted-foreground'>No application data available yet.</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Application Status</CardTitle>
            </CardHeader>

            <CardContent>
                <div className='relative h-[300px]'>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={chartData} dataKey="count" nameKey="status" innerRadius={70} outerRadius={100} paddingAngle={3}>
                                {chartData.map((item) => (<Cell key={item.status} fill={statusColor[item.status] || "var(--chart-1)"} />))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>

                    <div className='pointer-events-none absolute inset-0 flex flex-col items-center justify-center'>
                        <span className='text-3xl font-bold text-foreground'>
                            {totalApplications}
                        </span>
                        <span className='text-xs text-muted-foreground'>
                            Applications
                        </span>
                    </div>
                </div>

                <div className='mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2'>
                    {chartData.map((item) => {
                        return (
                            <div key={item.status} className='flex items-center gap-2 text-sm'>
                                <span className='h-2.5 w-2.5 rounded-full' style={{ backgroundColor: statusColor[item.status] || "var(--chart-1)" }} />
                                <span className='text-muted-foreground'>{item.status}</span>
                                <span className='font-medium text-foreground'>{item.count}</span>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}

export default ApplicationStatusChart