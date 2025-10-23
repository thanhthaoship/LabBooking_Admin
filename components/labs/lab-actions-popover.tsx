"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Edit, Trash2, MoreVertical } from "lucide-react"
import { Lab } from "@/lib/api/services/fetchLab"
import { EditLabSheet } from "./edit-lab-sheet"
import { DeleteLabDialog } from "./delete-lab-dialog"

interface LabActionsPopoverProps {
  lab: Lab
  onLabUpdated?: (updatedLab: Lab) => void
  onLabDeleted?: (labId: string) => void
}

export function LabActionsPopover({ lab, onLabUpdated, onLabDeleted }: LabActionsPopoverProps) {
  const [editSheetOpen, setEditSheetOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [popoverOpen, setPopoverOpen] = useState(false)

  const handleEditClick = () => {
    setEditSheetOpen(true)
    setPopoverOpen(false)
  }

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
    setPopoverOpen(false)
  }

  return (
    <>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2" align="end">
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={handleEditClick}
            >
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={handleDeleteClick}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <EditLabSheet
        lab={lab}
        open={editSheetOpen}
        onOpenChange={setEditSheetOpen}
        onLabUpdated={onLabUpdated}
      />

      <DeleteLabDialog
        lab={lab}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onLabDeleted={onLabDeleted}
      />
    </>
  )
}
