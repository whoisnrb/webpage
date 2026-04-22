"use client"

import { useState } from "react"
import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { updateProjectStatus } from "@/app/actions/project"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export function ProjectRow({ project }: { project: any }) {
    const [isEditing, setIsEditing] = useState(false)
    const [status, setStatus] = useState(project.status)
    const [progress, setProgress] = useState(project.progress.toString())
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        setIsSaving(true)
        const res = await updateProjectStatus(project.id, status, parseInt(progress, 10))
        setIsSaving(false)
        if (res.success) {
            toast.success("Projekt frissítve")
            setIsEditing(false)
        } else {
            toast.error("Hiba történt")
        }
    }

    if (isEditing) {
        return (
            <TableRow>
                <TableCell className="font-medium">{project.title}</TableCell>
                <TableCell>
                    {project.user?.name} <br/>
                    <span className="text-xs text-muted-foreground">{project.user?.email}</span>
                </TableCell>
                <TableCell>{project.createdAt.toLocaleDateString()}</TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Státusz" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="KICKOFF">KICKOFF</SelectItem>
                                <SelectItem value="DESIGN">DESIGN</SelectItem>
                                <SelectItem value="DEVELOPMENT">DEVELOPMENT</SelectItem>
                                <SelectItem value="REVISION">REVISION</SelectItem>
                                <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input 
                            type="number" 
                            className="w-20" 
                            value={progress} 
                            onChange={(e) => setProgress(e.target.value)} 
                            min="0" 
                            max="100" 
                        />
                        %
                    </div>
                </TableCell>
                <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} disabled={isSaving}>Mégse</Button>
                        <Button size="sm" onClick={handleSave} disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Mentés
                        </Button>
                    </div>
                </TableCell>
            </TableRow>
        )
    }

    return (
        <TableRow>
            <TableCell className="font-medium">{project.title}</TableCell>
            <TableCell>
                {project.user?.name} <br/>
                <span className="text-xs text-muted-foreground">{project.user?.email}</span>
            </TableCell>
            <TableCell>{project.createdAt.toLocaleDateString('hu-HU')}</TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    <span className="text-xs border rounded-full px-2 py-0.5">{project.status}</span>
                    <span className="text-xs font-semibold">{project.progress}%</span>
                </div>
            </TableCell>
            <TableCell className="text-right">
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    Szerkesztés
                </Button>
            </TableCell>
        </TableRow>
    )
}
