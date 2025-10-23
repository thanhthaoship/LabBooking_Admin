'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, FlaskConical, Users, Clock, Settings, Search } from "lucide-react"
import { LabCard } from "@/components/labs/lab-card"
import { DeviceCard } from "@/components/devices/device-card"
import { SearchInput } from "@/components/common/search-input"
import { Pagination } from "@/components/common/pagination"
import { useLabs } from "@/hooks/useLabs"
import { useDevices } from "@/hooks/useDevices"
import { usePagination } from "@/hooks/usePagination"
import { useState } from "react"
import { Lab } from "@/lib/api/services/fetchLab"
import { Device } from "@/lib/api/services/fetchDevice"
import { SiteHeader } from "@/components/sidebar/site-header"

export default function LabsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("labs")

  // Fetch data using hooks
  const { data: labsData, isLoading: labsLoading, refetch: refetchLabs } = useLabs()
  const { data: devicesData, isLoading: devicesLoading, refetch: refetchDevices } = useDevices()

  // Filter data based on search query
  const filteredLabs = labsData?.labs.filter(lab =>
    lab.roomName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lab.roomCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lab.manager.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const filteredDevices = devicesData?.devices.filter(device =>
    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.ownedByLab.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.type.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  // Pagination for labs
  const {
    currentPage: labsCurrentPage,
    totalPages: labsTotalPages,
    paginatedData: paginatedLabs,
    totalItems: labsTotalItems,
    startIndex: labsStartIndex,
    endIndex: labsEndIndex,
    goToPage: goToLabsPage
  } = usePagination({
    data: filteredLabs,
    itemsPerPage: 6
  })

  // Pagination for devices
  const {
    currentPage: devicesCurrentPage,
    totalPages: devicesTotalPages,
    paginatedData: paginatedDevices,
    totalItems: devicesTotalItems,
    startIndex: devicesStartIndex,
    endIndex: devicesEndIndex,
    goToPage: goToDevicesPage
  } = usePagination({
    data: filteredDevices,
    itemsPerPage: 6
  })

  const handleViewBookings = (labId: string) => {
    console.log("View bookings for lab:", labId)
  }

  const handleLabUpdated = (updatedLab: Lab) => {
    console.log("Lab updated:", updatedLab)
    refetchLabs()
  }

  const handleLabDeleted = (labId: string) => {
    console.log("Lab deleted:", labId)
    refetchLabs()
  }

  const handleDeviceUpdated = (updatedDevice: Device) => {
    console.log("Device updated:", updatedDevice)
    refetchDevices()
  }

  const handleDeviceDeleted = (deviceId: string) => {
    console.log("Device deleted:", deviceId)
    refetchDevices()
  }

  const handleMaintenanceScheduled = (updatedDevice: Device) => {
    console.log("Maintenance scheduled for device:", updatedDevice)
    refetchDevices()
  }

  return (
    <>
      <SiteHeader title="Quản lý phòng thí nghiệm"/>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quản lý phòng thí nghiệm</h1>
            <p className="text-muted-foreground">
              Quản lý không gian phòng thí nghiệm, thiết bị và lịch đặt
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm phòng thí nghiệm
          </Button>
        </div>

        {/* Search Input */}
        <div className="flex gap-4">
          <SearchInput
            placeholder="Tìm kiếm phòng thí nghiệm hoặc thiết bị..."
            value={searchQuery}
            onChange={setSearchQuery}
            className="flex-1"
          />
        </div>

        {/* Tabs for Labs and Devices */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="labs" className="flex items-center gap-2">
              <FlaskConical className="h-4 w-4" />
              Phòng thí nghiệm ({labsData?.total || 0})
            </TabsTrigger>
            <TabsTrigger value="devices" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Thiết bị ({devicesData?.total || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="labs" className="space-y-6">
            {/* Labs Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Thống kê phòng thí nghiệm</CardTitle>
                <CardDescription>
                  Tổng quan về tình trạng sử dụng phòng thí nghiệm
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{labsData?.total || 0}</div>
                    <div className="text-sm text-muted-foreground">Tổng số phòng</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{labsData?.available || 0}</div>
                    <div className="text-sm text-muted-foreground">Có sẵn</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{labsData?.occupied || 0}</div>
                    <div className="text-sm text-muted-foreground">Đang sử dụng</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{labsData?.maintenance || 0}</div>
                    <div className="text-sm text-muted-foreground">Bảo trì</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Labs Grid */}
            {labsLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {paginatedLabs.map((lab) => (
                    <LabCard
                      key={lab.id}
                      lab={lab}
                      onViewBookings={handleViewBookings}
                      onLabUpdated={handleLabUpdated}
                      onLabDeleted={handleLabDeleted}
                    />
                  ))}
                </div>

                {/* Pagination for Labs */}
                {labsTotalPages > 1 && (
                  <div className="mt-6">
                    <Pagination
                      currentPage={labsCurrentPage}
                      totalPages={labsTotalPages}
                      onPageChange={goToLabsPage}
                      className="justify-center"
                    />
                    <div className="text-center text-sm text-muted-foreground mt-2">
                      Hiển thị {labsStartIndex}-{labsEndIndex} trong {labsTotalItems} phòng thí nghiệm
                    </div>
                  </div>
                )}
              </>
            )}

            {filteredLabs.length === 0 && !labsLoading && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <FlaskConical className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Không tìm thấy phòng thí nghiệm</h3>
                  <p className="text-muted-foreground text-center">
                    {searchQuery ? "Thử thay đổi từ khóa tìm kiếm" : "Chưa có phòng thí nghiệm nào"}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="devices" className="space-y-6">
            {/* Devices Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Thống kê thiết bị</CardTitle>
                <CardDescription>
                  Tổng quan về tình trạng thiết bị trong phòng thí nghiệm
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-5">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{devicesData?.total || 0}</div>
                    <div className="text-sm text-muted-foreground">Tổng số thiết bị</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{devicesData?.available || 0}</div>
                    <div className="text-sm text-muted-foreground">Có sẵn</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{devicesData?.inUse || 0}</div>
                    <div className="text-sm text-muted-foreground">Đang sử dụng</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{devicesData?.maintenance || 0}</div>
                    <div className="text-sm text-muted-foreground">Bảo trì</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{devicesData?.broken || 0}</div>
                    <div className="text-sm text-muted-foreground">Hỏng</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Devices Grid */}
            {devicesLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {paginatedDevices.map((device) => (
                    <DeviceCard
                      key={device.id}
                      device={device}
                      onDeviceUpdated={handleDeviceUpdated}
                      onDeviceDeleted={handleDeviceDeleted}
                      onMaintenanceScheduled={handleMaintenanceScheduled}
                    />
                  ))}
                </div>

                {/* Pagination for Devices */}
                {devicesTotalPages > 1 && (
                  <div className="mt-6">
                    <Pagination
                      currentPage={devicesCurrentPage}
                      totalPages={devicesTotalPages}
                      onPageChange={goToDevicesPage}
                      className="justify-center"
                    />
                    <div className="text-center text-sm text-muted-foreground mt-2">
                      Hiển thị {devicesStartIndex}-{devicesEndIndex} trong {devicesTotalItems} thiết bị
                    </div>
                  </div>
                )}
              </>
            )}

            {filteredDevices.length === 0 && !devicesLoading && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Settings className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Không tìm thấy thiết bị</h3>
                  <p className="text-muted-foreground text-center">
                    {searchQuery ? "Thử thay đổi từ khóa tìm kiếm" : "Chưa có thiết bị nào"}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
