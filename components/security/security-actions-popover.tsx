"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Edit, Trash2, CalendarClock, Eye, MoreVertical } from "lucide-react"
import { SecuritySystem } from "@/lib/api/services/fetchSecurity"
import { EditSecuritySheet } from "./edit-security-sheet"
import { DeleteSecurityDialog } from "./delete-security-dialog"
import { MaintenanceDialog } from "./maintenance-dialog"
import { ViewSecurityDialog } from "./view-security-dialog"

interface SecurityActionsPopoverProps {
  system: SecuritySystem
  onSystemUpdated?: (updatedSystem: SecuritySystem) => void
  onSystemDeleted?: (systemId: string) => void
  onMaintenanceScheduled?: (updatedSystem: SecuritySystem) => void
}

export function SecurityActionsPopover({ 
  system, 
  onSystemUpdated, 
  onSystemDeleted, 
  onMaintenanceScheduled
}: SecurityActionsPopoverProps) {
  const [editSheetOpen, setEditSheetOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [maintenanceDialogOpen, setMaintenanceDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [popoverOpen, setPopoverOpen] = useState(false)

  const handleEditClick = () => {
    setEditSheetOpen(true)
    setPopoverOpen(false)
  }

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
    setPopoverOpen(false)
  }

  const handleMaintenanceClick = () => {
    setMaintenanceDialogOpen(true)
    setPopoverOpen(false)
  }

  const handleViewDetailsClick = () => {
    setViewDialogOpen(true)
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
              onClick={handleViewDetailsClick}
            >
              <Eye className="h-4 w-4 mr-2" />
              Xem chi tiết
            </Button>
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
              className="w-full justify-start"
              onClick={handleMaintenanceClick}
            >
              <CalendarClock className="h-4 w-4 mr-2" />
              Bảo trì
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

      <EditSecuritySheet
        system={system}
        open={editSheetOpen}
        onOpenChange={setEditSheetOpen}
        onSystemUpdated={onSystemUpdated}
      />

      <DeleteSecurityDialog
        system={system}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSystemDeleted={onSystemDeleted}
      />

      <MaintenanceDialog
        system={system}
        open={maintenanceDialogOpen}
        onOpenChange={setMaintenanceDialogOpen}
        onMaintenanceScheduled={onMaintenanceScheduled}
      />

      <ViewSecurityDialog
        system={system}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />
    </>
  )
}
