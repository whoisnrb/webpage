import { prisma } from "@/lib/db"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ToggleFeatureButton } from "./toggle-button"

export default async function FeatureFlagsPage() {
    const flags = await prisma.featureFlag.findMany({
        orderBy: { key: 'asc' }
    })

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Feature Flags</CardTitle>
                    <CardDescription>Funkciók kapcsolása és A/B tesztelés.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Kulcs</TableHead>
                                <TableHead>Leírás</TableHead>
                                <TableHead>Állapot</TableHead>
                                <TableHead>Rollout %</TableHead>
                                <TableHead className="text-right">Műveletek</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {flags.map((flag) => (
                                <TableRow key={flag.id}>
                                    <TableCell className="font-mono font-medium">
                                        {flag.key}
                                    </TableCell>
                                    <TableCell>
                                        {flag.description || "-"}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={flag.enabled ? 'default' : 'secondary'}>
                                            {flag.enabled ? 'Enabled' : 'Disabled'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {flag.percentage}%
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <ToggleFeatureButton
                                            flagId={flag.id}
                                            initialStatus={flag.enabled}
                                            initialPercentage={flag.percentage}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                            {flags.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                        Nincs létrehozott feature flag.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
