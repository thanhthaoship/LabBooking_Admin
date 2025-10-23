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
import { Lab } from "@/lib/api/services/fetchLab"
import { labService } from "@/lib/api/services/fetchLab"

interface DeleteLabDialogProps {
  lab: Lab
  open: boolean
  onOpenChange: (open: boolean) => void
  onLabDeleted?: (labId: string) => void
}

export function DeleteLabDialog({ lab, open, onOpenChange, onLabDeleted }: DeleteLabDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)

    try {
      const response = await labService.deleteLab(lab.id)
      
      if (response.status) {
        onLabDeleted?.(lab.id)
        onOpenChange(false)
      }
    } catch (error) {
      console.error("Error deleting lab:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa phòng lab</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa phòng lab <strong>{lab.roomName}</strong> ({lab.roomCode})?
            <br />
            <br />
            Hành động này không thể hoàn tác và sẽ xóa vĩnh viễn tất cả thông tin liên quan đến phòng lab này.
          </AlertDialogDescription>
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
