"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Wrench, AlertTriangle, Clock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Device } from "@/lib/api/services/fetchDevice"
import { deviceService } from "@/lib/api/services/fetchDevice"

interface MaintenanceDialogProps {
  device: Device
  open: boolean
  onOpenChange: (open: boolean) => void
  onMaintenanceScheduled?: (updatedDevice: Device) => void
}

export function MaintenanceDialog({ device, open, onOpenChange, onMaintenanceScheduled }: MaintenanceDialogProps) {
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
      // Schedule maintenance using the device service
      const response = await deviceService.scheduleMaintenance(device.id, formData.maintenanceDate)
      
      if (response.status && response.data) {
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
        return "Bảo trì định kỳ"
      case "repair":
        return "Sửa chữa"
      case "upgrade":
        return "Nâng cấp"
      case "inspection":
        return "Kiểm tra"
      default:
        return type
    }
  }

  const isMaintenanceDue = () => {
    const nextMaintenance = new Date(device.nextMaintenance)
    const today = new Date()
    const daysUntilMaintenance = Math.ceil((nextMaintenance.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilMaintenance <= 7 && daysUntilMaintenance >= 0
  }

  const isWarrantyExpired = () => {
    const warrantyExpiry = new Date(device.warrantyExpiry)
    const today = new Date()
    return warrantyExpiry < today
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Lên lịch bảo trì thiết bị
          </DialogTitle>
          <DialogDescription>
            Lên lịch bảo trì cho thiết bị {device.name} ({device.code})
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Device Info */}
          <div className="p-4 rounded-lg bg-muted/50">
            <h3 className="font-medium mb-2">Thông tin thiết bị</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Tên:</span> {device.name}
              </div>
              <div>
                <span className="text-muted-foreground">Mã:</span> {device.code}
              </div>
              <div>
                <span className="text-muted-foreground">Loại:</span> {device.type}
              </div>
              <div>
                <span className="text-muted-foreground">Hãng:</span> {device.brand} {device.model}
              </div>
            </div>
            
            {/* Maintenance Status */}
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Bảo trì tiếp theo: {new Date(device.nextMaintenance).toLocaleDateString('vi-VN')}</span>
                {isMaintenanceDue() && (
                  <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Sắp đến hạn
                  </Badge>
                )}
              </div>
              {isWarrantyExpired() && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Bảo hành đã hết hạn</span>
                </div>
              )}
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
                    <SelectItem value="routine">Bảo trì định kỳ</SelectItem>
                    <SelectItem value="repair">Sửa chữa</SelectItem>
                    <SelectItem value="upgrade">Nâng cấp</SelectItem>
                    <SelectItem value="inspection">Kiểm tra</SelectItem>
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
