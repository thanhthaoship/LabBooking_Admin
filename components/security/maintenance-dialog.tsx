"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle, Calendar, Clock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SecuritySystem } from "@/lib/api/services/fetchSecurity"
import { securityService } from "@/lib/api/services/fetchSecurity"
import { formatDate } from "@/lib/utils/date/formatDate"

interface MaintenanceDialogProps {
  system: SecuritySystem
  open: boolean
  onOpenChange: (open: boolean) => void
  onMaintenanceScheduled?: (updatedSystem: SecuritySystem) => void
}

export function MaintenanceDialog({ system, open, onOpenChange, onMaintenanceScheduled }: MaintenanceDialogProps) {
  const [formData, setFormData] = useState({
    maintenanceDate: "",
    maintenanceType: "routine",
    description: "",
    status: "scheduled"
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await securityService.scheduleMaintenance(system.id, formData.maintenanceDate)
      
      if (response?.status && response?.data) {
        onMaintenanceScheduled?.(response.data)
        onOpenChange(false)
        // Reset form
        setFormData({
          maintenanceDate: "",
          maintenanceType: "routine",
          description: "",
          status: "scheduled"
        })
      }
    } catch (error) {
      console.error("Error scheduling maintenance:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getMaintenanceTypeText = (type: string) => {
    switch (type) {
      case "routine":
        return "Kiểm tra định kỳ"
      case "repair":
        return "Sửa chữa"
      case "upgrade":
        return "Nâng cấp"
      case "inspection":
        return "Kiểm tra an toàn"
      case "calibration":
        return "Hiệu chuẩn"
      default:
        return type
    }
  }

  const isMaintenanceDue = () => {
    const nextCheck = new Date(system.updatedAt)
    const today = new Date()
    const daysUntilMaintenance = Math.ceil((nextCheck.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilMaintenance <= 7 && daysUntilMaintenance >= 0
  }

  const isOverdue = () => {
    const nextCheck = new Date(system.updatedAt)
    const today = new Date()
    return nextCheck < today
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Lên lịch bảo trì hệ thống an ninh
          </DialogTitle>
          <DialogDescription>
            Lên lịch bảo trì cho hệ thống {system.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* System Info */}
          <div className="p-4 rounded-lg bg-muted/50">
            <h3 className="font-medium mb-2">Thông tin hệ thống</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Tên:</span> {system.name}
              </div>
              <div>
                <span className="text-muted-foreground">Loại:</span> {system.type}
              </div>
            </div>
            
            {/* Maintenance Status */}
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Kiểm tra tiếp theo: {formatDate(system.updatedAt)}</span>
                {isMaintenanceDue() && !isOverdue() && (
                  <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Sắp đến hạn
                  </Badge>
                )}
                {isOverdue() && (
                  <Badge variant="outline" className="text-red-600 border-red-600">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Quá hạn
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Lịch bảo trì: {formatDate(system.updatedAt)}</span>
              </div>
            </div>
          </div>

          {/* Maintenance Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maintenanceDate">Ngày bảo trì</Label>
                <Input
                  id="maintenanceDate"
                  type="date"
                  value={formData.maintenanceDate}
                  onChange={(e) => handleInputChange("maintenanceDate", e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maintenanceType">Loại bảo trì</Label>
                <Select value={formData.maintenanceType} onValueChange={(value) => handleInputChange("maintenanceType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại bảo trì" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="routine">Kiểm tra định kỳ</SelectItem>
                    <SelectItem value="repair">Sửa chữa</SelectItem>
                    <SelectItem value="upgrade">Nâng cấp</SelectItem>
                    <SelectItem value="inspection">Kiểm tra an toàn</SelectItem>
                    <SelectItem value="calibration">Hiệu chuẩn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả bảo trì</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Mô tả chi tiết công việc bảo trì..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Đã lên lịch</SelectItem>
                  <SelectItem value="in_progress">Đang thực hiện</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang lên lịch..." : "Lên lịch bảo trì"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
