"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Device } from "@/lib/api/services/fetchDevice"
import { deviceService } from "@/lib/api/services/fetchDevice"

interface DeleteDeviceDialogProps {
  device: Device
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeviceDeleted?: (deviceId: string) => void
}

export function DeleteDeviceDialog({ device, open, onOpenChange, onDeviceDeleted }: DeleteDeviceDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)

    try {
      const response = await deviceService.deleteDevice(device.id)
      
      if (response.status) {
        onDeviceDeleted?.(device.id)
        onOpenChange(false)
      }
    } catch (error) {
      console.error("Error deleting device:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa thiết bị</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa thiết bị <strong>{device.name}</strong> ({device.code})?
            Hành động này không thể hoàn tác và sẽ xóa vĩnh viễn tất cả thông tin liên quan đến thiết bị này, bao gồm:
          </AlertDialogDescription>
          <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1 text-sm">
            <li>Lịch sử sử dụng thiết bị</li>
            <li>Lịch sử bảo trì</li>
            <li>Tất cả dữ liệu liên quan</li>
          </ul>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "Đang xóa..." : "Xóa"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
