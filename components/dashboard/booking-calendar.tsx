'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, FlaskConical, ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import { addDays, subDays, isToday, format } from "date-fns"
import { vi } from "date-fns/locale"
import { useState } from "react"
import { useAllBookings } from "@/hooks/useBookings"
import { useLabs } from "@/hooks/useLabs"
import { Booking } from "@/lib/api/services/fetchBooking"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

// Helper function to get lab name by ID
const getLabName = (labId: string, labs: any[]) => {
  const lab = labs.find(l => l.id === labId)
  return lab ? `${lab.roomName} - ${lab.roomCode}` : `Phòng thí nghiệm ${labId}`
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "confirmed":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Đã xác nhận</Badge>
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Chờ xác nhận</Badge>
    case "cancelled":
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Đã hủy</Badge>
    default:
      return <Badge variant="outline">Không xác định</Badge>
  }
}

const getBookingsForDate = (date: Date, allBookings: Booking[]) => {
  const dateString = format(date, 'yyyy-MM-dd')
  return allBookings.filter(booking => booking.date === dateString)
}

export function TodayCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const { data: allBookings = [], isLoading: bookingsLoading } = useAllBookings()
  const { data: labsData, isLoading: labsLoading } = useLabs()
  const currentBookings = getBookingsForDate(selectedDate, allBookings)
  
  const isLoading = bookingsLoading || labsLoading
  
  const goToPreviousDay = () => {
    setSelectedDate(prev => subDays(prev, 1))
  }
  
  const goToNextDay = () => {
    setSelectedDate(prev => addDays(prev, 1))
  }
  
  const goToToday = () => {
    setSelectedDate(new Date())
  }
  
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
      setDatePickerOpen(false)
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Lịch đặt phòng
            </CardTitle>
            <CardDescription>
              {format(selectedDate, "EEEE, dd MMMM yyyy", { locale: vi })} - {currentBookings.length} đặt lịch
            </CardDescription>
          </div>
          
          {/* Day Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousDay}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant={isToday(selectedDate) ? "default" : "outline"}
              size="sm"
              onClick={goToToday}
              className="text-xs"
            >
              Hôm nay
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextDay}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            {/* Date Picker */}
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent 
                  mode="single" 
                  selected={selectedDate} 
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="overflow-y-auto max-h-[500px]">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start gap-3 p-3 border rounded-lg animate-pulse">
                <div className="p-2 bg-gray-200 rounded-lg">
                  <FlaskConical className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {currentBookings.map((booking) => (
              <div key={booking.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 ease-linear transition-colors">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FlaskConical className="h-4 w-4 text-blue-600" />
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-sm">
                        {booking.labId ? getLabName(booking.labId, labsData?.labs || []) : 'Phòng thí nghiệm'}
                      </h4>
                      <p className="text-xs text-muted-foreground">{booking.purpose}</p>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{booking.startTime} - {booking.endTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{booking.userName}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          
            {currentBookings.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Không có đặt lịch nào trong ngày này</p>
              </div>
            )}
          </div>
        )}
        <CardFooter className="w-full p-4 my-4 sticky bottom-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 transition-[width,height] ease-linear rounded-2xl">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tổng số đặt lịch:</span>
            <span className="font-medium">{currentBookings.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-muted-foreground">Đã xác nhận:</span>
            <span className="font-medium text-green-600">
              {currentBookings.filter(b => b.status === 'confirmed').length}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-muted-foreground">Chờ xác nhận:</span>
            <span className="font-medium text-yellow-600">
              {currentBookings.filter(b => b.status === 'pending').length}
            </span>
          </div>
        </div>
        </CardFooter>
        </CardContent>
    </Card>
  )
}