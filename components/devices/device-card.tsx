import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, AlertTriangle } from "lucide-react"
import { Device } from "@/lib/api/services/fetchDevice"
import { DeviceBookingDialog } from "./device-booking-dialog"
import { DeviceActionsPopover } from "./device-actions-popover"

interface DeviceCardProps {
  device: Device
  onDeviceUpdated?: (updatedDevice: Device) => void
  onDeviceDeleted?: (deviceId: string) => void
  onMaintenanceScheduled?: (updatedDevice: Device) => void
}

export function DeviceCard({ 
  device, 
  onDeviceUpdated, 
  onDeviceDeleted, 
  onMaintenanceScheduled 
}: DeviceCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200"
      case "in_use":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "broken":
        return "bg-red-100 text-red-800 border-red-200"
    case "retired":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Có sẵn"
      case "in_use":
        return "Đang sử dụng"
      case "maintenance":
        return "Bảo trì"
      case "broken":
        return "Hỏng"
      case "retired":
        return "Ngừng sử dụng"
      default:
        return status
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
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{device.name}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <span className="font-mono text-sm">{device.code}</span>
              <Badge className={getStatusColor(device.status)}>
                {getStatusText(device.status)}
              </Badge>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Device Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>Thuộc phòng: {device.ownedByLab}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Loại:</span> {device.type}
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Hãng:</span> {device.brand} {device.model}
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Số seri:</span> {device.serialNumber}
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>Vị trí: {device.location}</span>
        </div>

        {/* Maintenance Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Bảo trì tiếp theo: {new Date(device.nextMaintenance).toLocaleDateString('vi-VN')}</span>
            {isMaintenanceDue() && (
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            )}
          </div>
          {isWarrantyExpired() && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertTriangle className="h-4 w-4" />
              <span>Bảo hành đã hết hạn</span>
            </div>
          )}
        </div>

        {/* Key Specifications */}
        {device.specifications && Object.keys(device.specifications).length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Thông số chính:</h4>
            <div className="space-y-1">
              {Object.entries(device.specifications).slice(0, 2).map(([key, value]) => (
                <div key={key} className="text-sm text-muted-foreground">
                  <span className="font-medium">{key}:</span> {value}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {device.description && (
          <div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {device.description}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <DeviceBookingDialog device={device} />
          <DeviceActionsPopover 
            device={device}
            onDeviceUpdated={onDeviceUpdated}
            onDeviceDeleted={onDeviceDeleted}
            onMaintenanceScheduled={onMaintenanceScheduled}
          />
        </div>
      </CardContent>
    </Card>
  )
}
