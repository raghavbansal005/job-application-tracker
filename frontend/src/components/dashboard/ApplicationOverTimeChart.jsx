import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function ApplicationOverTimeChart({ data }) {
    const chartData = data.map((item) => ({ month: item._id, applications: item.count }))

    if (chartData.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Application Over Time</CardTitle>
                </CardHeader>

                <CardContent>
                    <div className='flex h-[300px] items-center justify-center'>
                        <p className='text-sm text-muted-foreground'>No application activity yet.</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Application Over Time</CardTitle>
            </CardHeader>

            <CardContent>
                <div className='h-[300px]'>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Area type="monotone" dataKey="applications" stroke="var(--chart-1)" fill='var(--chart-1)' fillOpacity={0.15}/>
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}

export default ApplicationOverTimeChart