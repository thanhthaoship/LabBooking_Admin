'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, User, Building, Phone, Calendar, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { SecuritySystem } from "@/lib/api/services/fetchSecurity"

interface ViewSecurityDialogProps {
  system: SecuritySystem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewSecurityDialog({ system, open, onOpenChange }: ViewSecurityDialogProps) {
  if (!system) return null

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "inactive":
        return <XCircle className="h-5 w-5 text-gray-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-orange-600" />
      case "offline":
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <XCircle className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "inactive":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      case "warning":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case "offline":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Hoạt động";
      case "inactive":
        return "Không hoạt động";
      case "warning":
        return "Cảnh báo";
      case "offline":
        return "Tắt";
      default:
        return "Không xác định";
    }
  }

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "low":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return "Cao";
      case "medium":
        return "Trung bình";
      case "low":
        return "Thấp";
      default:
        return "Không xác định";
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-xl">{system.name}</DialogTitle>
              <DialogDescription>
                Chi tiết thông tin người dùng an ninh
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Priority */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {getStatusIcon(system.status)}
              <Badge className={getStatusBadgeClass(system.status)}>
                {getStatusText(system.status)}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Ưu tiên:</span>
              <Badge className={getPriorityBadgeClass(system.priority)}>
                {getPriorityText(system.priority)}
              </Badge>
            </div>
          </div>

          {/* User Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Vai trò</p>
                  <p className="text-sm text-muted-foreground">{system.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Phòng ban</p>
                  <p className="text-sm text-muted-foreground">{system.department}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Liên hệ</p>
                  <p className="text-sm text-muted-foreground">{system.contact}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Loại hệ thống</p>
                <Badge variant="outline" className="text-sm">
                  {system.type}
                </Badge>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Mô tả</p>
                <p className="text-sm text-muted-foreground rounded-lg">
                  {system.description}
                </p>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Ngày tạo</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(system.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Cập nhật lần cuối</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(system.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
