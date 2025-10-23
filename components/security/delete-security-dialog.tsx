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
import { SecuritySystem } from "@/lib/api/services/fetchSecurity"
import { securityService } from "@/lib/api/services/fetchSecurity"

interface DeleteSecurityDialogProps {
  system: SecuritySystem
  open: boolean
  onOpenChange: (open: boolean) => void
  onSystemDeleted?: (systemId: string) => void
}

export function DeleteSecurityDialog({ system, open, onOpenChange, onSystemDeleted }: DeleteSecurityDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)

    try {
      const response = await securityService.deleteSecuritySystem(system.id)
      
      if (response.status) {
        onSystemDeleted?.(system.id)
        onOpenChange(false)
      }
    } catch (error) {
      console.error("Error deleting security system:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa hệ thống an ninh</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa hệ thống an ninh <strong>{system.name}</strong>?
            Hành động này không thể hoàn tác và sẽ xóa vĩnh viễn tất cả thông tin liên quan đến hệ thống này, bao gồm:
          </AlertDialogDescription>
          <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1 text-sm">
            <li>Lịch sử kiểm tra và bảo trì</li>
            <li>Lịch sử hoạt động</li>
            <li>Thông tin cấu hình</li>
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
