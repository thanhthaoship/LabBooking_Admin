'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FlaskConical, Shield, Users, Calendar } from "lucide-react"
import { SiteHeader } from "@/components/sidebar/site-header"
import { BookingPieChart } from "@/components/dashboard/booking-pie-chart"
import { TodayCalendar } from "@/components/dashboard/booking-calendar"
import { useLabs } from "@/hooks/useLabs"
import { useAllBookings } from "@/hooks/useBookings"
import { useSecuritySystems } from "@/hooks/useSecurity"

export default function HomePage() {
  const { data: labsData } = useLabs()
  const { data: allBookings = [] } = useAllBookings()
  const { data: securityData } = useSecuritySystems()
  
  // Calculate statistics
  const totalLabs = labsData?.total || 0
  const activeBookings = allBookings.filter(booking => booking.status === 'confirmed').length
  const totalUsers = new Set(allBookings.map(booking => booking.userId)).size
  const activeSecurity = securityData?.active || 0
  
  return ( 
    <>
      <SiteHeader title="Bảng điều khiển" />
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bảng điều khiển</h1>
          <p className="text-muted-foreground">
            Chào mừng đến với bảng điều khiển
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng số phòng thí nghiệm
              </CardTitle>
              <FlaskConical className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLabs}</div>
              <p className="text-xs text-muted-foreground">
                {labsData?.available || 0} phòng có sẵn
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Đặt lịch đang hoạt động
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeBookings}</div>
              <p className="text-xs text-muted-foreground">
                {allBookings.length} tổng số đặt lịch
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Người dùng
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                người dùng đã đặt lịch
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Hệ thống bảo vệ
              </CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeSecurity}</div>
              <p className="text-xs text-muted-foreground">
                {securityData?.total || 0} tổng số nhân viên an ninh
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content - Two Column Layout */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Side - Pie Chart */}
          <BookingPieChart />
          
          {/* Right Side - Today's Calendar */}
          <TodayCalendar />
        </div>

        {/* Additional Information Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Đặt lịch gần đây</CardTitle>
              <CardDescription>
                Các đặt lịch phòng thí nghiệm và đặt chỗ mới nhất
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Phòng thí nghiệm Hóa học - Phòng 101
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Đặt bởi Nguyễn Văn A trong 2 giờ
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Phòng thí nghiệm Vật lý - Phòng 203
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Đặt bởi Trần Thị B trong 3 giờ
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trạng thái hệ thống</CardTitle>
              <CardDescription>
                Trạng thái hiện tại của hệ thống phòng thí nghiệm và thiết bị
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Hệ thống quản lý phòng thí nghiệm</span>
                  <span className="text-sm text-green-600">Trực tuyến</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Hệ thống bảo vệ</span>
                  <span className="text-sm text-green-600">Trực tuyến</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Hệ thống đặt lịch</span>
                  <span className="text-sm text-green-600">Trực tuyến</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
