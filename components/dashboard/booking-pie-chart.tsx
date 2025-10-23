'use client'

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Calendar, Clock, Users } from "lucide-react"
import { useLabs } from "@/hooks/useLabs"
import { useAllBookings } from "@/hooks/useBookings"
import { formatDate } from "@/lib/utils/date/formatDate"

const chartConfig = {
  booked: {
    label: "Đã đặt",
    color: "hsl(var(--chart-1))",
  },
  available: {
    label: "Còn trống",
    color: "hsl(var(--chart-2))",
  },
  maintenance: {
    label: "Bảo trì",
    color: "hsl(var(--chart-3))",
  },
}

export function BookingPieChart() {
  const { data: labsData, isLoading: labsLoading } = useLabs()
  const { data: allBookings = [], isLoading: bookingsLoading } = useAllBookings()
  
  const isLoading = labsLoading || bookingsLoading
  

  
  // Calculate room status based on real data
  const calculateRoomStatus = () => {
    if (!labsData?.labs || !allBookings) {
      return {
        booked: 0,
        available: 0,
        maintenance: 0
      }
    }
    
    const labs = labsData.labs
    const todayBookings = allBookings.filter(booking => booking.date === formatDate(new Date().toISOString()))
    
    let booked = 0
    let maintenance = 0
    let available = 0
    
    labs.forEach(lab => {
      const hasBooking = todayBookings.some(booking => booking.labId === lab.id)
      
      if (lab.status === 'maintenance') {
        maintenance++
      } else if (hasBooking) {
        booked++
      } else {
        available++
      }
    })
    
    return { booked, available, maintenance }
  }
  
  const roomStatus = calculateRoomStatus()
  
  const data = [
    { name: "booked", value: roomStatus.booked, fill: "var(--color-booked)" },
    { name: "available", value: roomStatus.available, fill: "var(--color-available)" },
    { name: "maintenance", value: roomStatus.maintenance, fill: "var(--color-maintenance)" },
  ]
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Tình trạng đặt phòng hôm nay
        </CardTitle>
        <CardDescription>
          Phân bố trạng thái các phòng thí nghiệm
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[400px]">
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideLabel
                  className="flex flex-col gap-1"
                  formatter={(value, name) => [
                    <div key={name} className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{
                          backgroundColor: chartConfig[name as keyof typeof chartConfig]?.color,
                        }}
                      />
                      <span>{value} phòng</span>
                    </div>,
                    chartConfig[name as keyof typeof chartConfig]?.label,
                  ]}
                />
              }
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }: any) => `${((percent as number) * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <div className="h-2 w-2 rounded-full bg-[hsl(var(--chart-1))]" />
              <span className="text-sm font-medium">{roomStatus.booked}</span>
            </div>
            <p className="text-xs text-muted-foreground">Đã đặt</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <div className="h-2 w-2 rounded-full bg-[hsl(var(--chart-2))]" />
              <span className="text-sm font-medium">{roomStatus.available}</span>
            </div>
            <p className="text-xs text-muted-foreground">Còn trống</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <div className="h-2 w-2 rounded-full bg-[hsl(var(--chart-3))]" />
              <span className="text-sm font-medium">{roomStatus.maintenance}</span>
            </div>
            <p className="text-xs text-muted-foreground">Bảo trì</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
