import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, MapPin, User, Phone, Mail } from "lucide-react"
import { Lab } from "@/lib/api/services/fetchLab"
import { BookingDialog } from "./booking-dialog"
import { LabActionsPopover } from "./lab-actions-popover"

interface LabCardProps {
  lab: Lab
  onViewBookings?: (labId: string) => void
  onLabUpdated?: (updatedLab: Lab) => void
  onLabDeleted?: (labId: string) => void
}

export function LabCard({ lab, onViewBookings, onLabUpdated, onLabDeleted }: LabCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200"
      case "occupied":
        return "bg-red-100 text-red-800 border-red-200"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Có sẵn"
      case "occupied":
        return "Đang sử dụng"
      case "maintenance":
        return "Bảo trì"
      case "closed":
        return "Đóng cửa"
      default:
        return status
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{lab.roomName}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <span className="font-mono text-sm">{lab.roomCode}</span>
              <Badge className={getStatusColor(lab.status)}>
                {getStatusText(lab.status)}
              </Badge>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-1">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Sức chứa: {lab.capacity} sinh viên</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{lab.location}</span>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Quản lý phòng:</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{lab.manager.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{lab.manager.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{lab.manager.phone}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {lab.manager.department}
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Thiết bị:</h4>
          <div className="flex flex-wrap gap-1">
            {lab.equipment.slice(0, 3).map((item, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {item}
              </Badge>
            ))}
            {lab.equipment.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{lab.equipment.length - 3} khác
              </Badge>
            )}
          </div>
        </div>

        {lab.description && (
          <div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {lab.description}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex w-full gap-2">
          <BookingDialog lab={lab} />
          <LabActionsPopover 
            lab={lab}
            onLabUpdated={onLabUpdated}
            onLabDeleted={onLabDeleted}
          />
        </div>
      </CardFooter>
    </Card>
  )
}
