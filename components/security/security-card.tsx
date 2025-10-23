import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { SecuritySystem } from "@/lib/api/services/fetchSecurity"
import { SecurityActionsPopover } from "./security-actions-popover"

interface SecurityCardProps {
  system: SecuritySystem;
  onSystemUpdated?: (updatedSystem: SecuritySystem) => void;
  onSystemDeleted?: (systemId: string) => void;
  onMaintenanceScheduled?: (updatedSystem: SecuritySystem) => void;
}

export function SecurityCard({ 
  system, 
  onSystemUpdated, 
  onSystemDeleted, 
  onMaintenanceScheduled
}: SecurityCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "inactive":
        return <XCircle className="h-4 w-4 text-gray-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case "offline":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <XCircle className="h-4 w-4 text-gray-600" />
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

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">{system.name}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(system.status)}
            <Badge className={getStatusBadgeClass(system.status)}>
              {getStatusText(system.status)}
            </Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {system.role}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Loại:</span>
          <Badge variant="outline">{system.type}</Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Ưu tiên:</span>
          <Badge className={getPriorityBadgeClass(system.priority)}>
            {getPriorityText(system.priority)}
          </Badge>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Vai trò:</span>
            <span className="font-medium">{system.role}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Phòng ban:</span>
            <span className="font-medium">{system.department}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Liên hệ:</span>
            <span className="font-medium">{system.contact}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <SecurityActionsPopover 
            system={system}
            onSystemUpdated={onSystemUpdated}
            onSystemDeleted={onSystemDeleted}
            onMaintenanceScheduled={onMaintenanceScheduled}
          />
        </div>
      </CardContent>
    </Card>
  )
}
