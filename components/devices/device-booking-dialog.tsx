import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, User, Phone, Mail, MapPin, Settings } from 'lucide-react'
import { Device } from '@/lib/api/services/fetchDevice'
import { useDeviceBookings } from '@/hooks/useBookings'
import { formatDate, formatTime } from '@/lib/utils/date/formatDate'

interface DeviceBookingDialogProps {
  device: Device
  trigger?: React.ReactNode
}

export function DeviceBookingDialog({ device, trigger }: DeviceBookingDialogProps) {
  const { data: bookings = [], isLoading } = useDeviceBookings(device.id)
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_use':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_use':
        return 'Đang sử dụng'
      case 'scheduled':
        return 'Đã lên lịch'
      case 'completed':
        return 'Hoàn thành'
      case 'cancelled':
        return 'Đã hủy'
      default:
        return status
    }
  }

  const deviceBookings = bookings

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="flex-1">
            <Calendar className="mr-2 h-4 w-4" />
            Xem lịch sử dụng
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Lịch sử sử dụng thiết bị {device.name}
          </DialogTitle>
          <DialogDescription>
            Xem tất cả các lần sử dụng thiết bị {device.code}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Device Info */}
          <div className="p-4 rounded-lg">
            <h3 className="font-medium mb-2">Thông tin thiết bị</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>Thuộc phòng: {device.ownedByLab}</span>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span>Loại: {device.type}</span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Hãng: </span>
                <span>{device.brand} {device.model}</span>
              </div>
            </div>
          </div>

          {/* Bookings List */}
          <div className="space-y-4">
            <h3 className="font-medium">Lịch sử sử dụng ({deviceBookings.length})</h3>
            
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50 animate-pulse" />
                <p>Đang tải dữ liệu...</p>
              </div>
            ) : deviceBookings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Chưa có lịch sử sử dụng nào cho thiết bị này</p>
              </div>
            ) : (
              <div className="space-y-3">
                {deviceBookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4 space-y-3">
                    {/* Booking Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {formatDate(booking.date)}
                        </span>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {getStatusText(booking.status)}
                      </Badge>
                    </div>

                    {/* Time */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                      </span>
                    </div>

                    {/* Purpose */}
                    <div>
                      <span className="text-sm font-medium">Mục đích sử dụng: </span>
                      <span className="text-sm">{booking.purpose}</span>
                    </div>

                    {/* User Info */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{booking.userName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{booking.userEmail}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{booking.userPhone}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Đóng</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
