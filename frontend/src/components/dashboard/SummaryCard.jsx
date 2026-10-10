import { Card, CardContent } from "@/components/ui/card";

function SummaryCard({ title, value, description, icon: Icon}) {
    return(
        <Card className="border-border/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
                        <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                    <div className="shrink-0 rounded-lg bg-primary/10 p-2.5">
                        <Icon className="h-5 w-5 text-primary"/>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default SummaryCard