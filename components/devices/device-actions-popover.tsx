"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Edit, Trash2, Wrench, MoreVertical } from "lucide-react"
import { Device } from "@/lib/api/services/fetchDevice"
import { EditDeviceSheet } from "./edit-device-sheet"
import { DeleteDeviceDialog } from "./delete-device-dialog"
import { MaintenanceDialog } from "./maintenance-dialog"

interface DeviceActionsPopoverProps {
  device: Device
  onDeviceUpdated?: (updatedDevice: Device) => void
  onDeviceDeleted?: (deviceId: string) => void
  onMaintenanceScheduled?: (updatedDevice: Device) => void
}

export function DeviceActionsPopover({ 
  device, 
  onDeviceUpdated, 
  onDeviceDeleted, 
  onMaintenanceScheduled 
}: DeviceActionsPopoverProps) {
  const [editSheetOpen, setEditSheetOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [maintenanceDialogOpen, setMaintenanceDialogOpen] = useState(false)
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
              className="w-full justify-start"
              onClick={handleMaintenanceClick}
            >
              <Wrench className="h-4 w-4 mr-2" />
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

      <EditDeviceSheet
        device={device}
        open={editSheetOpen}
        onOpenChange={setEditSheetOpen}
        onDeviceUpdated={onDeviceUpdated}
      />

      <DeleteDeviceDialog
        device={device}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDeviceDeleted={onDeviceDeleted}
      />

      <MaintenanceDialog
        device={device}
        open={maintenanceDialogOpen}
        onOpenChange={setMaintenanceDialogOpen}
        onMaintenanceScheduled={onMaintenanceScheduled}
      />
    </>
  )
}
