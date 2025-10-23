'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle, CheckCircle, XCircle, Plus, Settings } from "lucide-react"
import { SiteHeader } from "@/components/sidebar/site-header"
import { SecurityCard } from "@/components/security/security-card"
import { SearchInput } from "@/components/common/search-input"
import { Pagination } from "@/components/common/pagination"
import { useSecuritySystems } from "@/hooks/useSecurity"
import { usePagination } from "@/hooks/usePagination"
import { useState } from "react"
import { SecuritySystem } from "@/lib/api/services/fetchSecurity"

export default function SecurityPage() {
  const [searchQuery, setSearchQuery] = useState("")
  
  // Fetch data using hooks
  const { data: securityData, isLoading: securityLoading, refetch: refetchSecurity } = useSecuritySystems()

  // Filter data based on search query
  const filteredSystems = securityData?.securitySystems.filter(system => 
    system.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    system.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    system.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    system.department.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  // Pagination for security systems
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedSystems,
    totalItems,
    startIndex,
    endIndex,
    goToPage
  } = usePagination({
    data: filteredSystems,
    itemsPerPage: 6
  })


  const handleSystemUpdated = (updatedSystem: SecuritySystem) => {
    console.log("Security system updated:", updatedSystem)
    refetchSecurity()
  }

  const handleSystemDeleted = (systemId: string) => {
    console.log("Security system deleted:", systemId)
    refetchSecurity()
  }

  const handleMaintenanceScheduled = (updatedSystem: SecuritySystem) => {
    console.log("Maintenance scheduled for system:", updatedSystem)
    refetchSecurity()
  }

  return (
    <>
      <SiteHeader title="Quản lý an ninh" />
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quản lý an ninh</h1>
            <p className="text-muted-foreground">
              Quản lý người dùng có vai trò an ninh và bảo mật dữ liệu
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm hệ thống mới
          </Button>
        </div>

        {/* Search Input */}
        <div className="flex gap-4">
          <SearchInput
            placeholder="Tìm kiếm người dùng an ninh theo tên, vai trò, phòng ban..."
            value={searchQuery}
            onChange={setSearchQuery}
            className="flex-1"
          />
        </div>

        {/* Security Systems Grid */}
        {securityLoading ? (
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
              {paginatedSystems.map((system) => (
                <SecurityCard
                  key={system.id}
                  system={system}
                  onSystemUpdated={handleSystemUpdated}
                  onSystemDeleted={handleSystemDeleted}
                  onMaintenanceScheduled={handleMaintenanceScheduled}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                  className="justify-center"
                />
                <div className="text-center text-sm text-muted-foreground mt-2">
                  Hiển thị {startIndex}-{endIndex} trong {totalItems} hệ thống an ninh
                </div>
              </div>
            )}
          </>
        )}

        {filteredSystems.length === 0 && !securityLoading && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Shield className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Không tìm thấy hệ thống an ninh</h3>
              <p className="text-muted-foreground text-center">
                {searchQuery ? "Thử thay đổi từ khóa tìm kiếm" : "Chưa có hệ thống an ninh nào"}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Tổng quan trạng thái người dùng</CardTitle>
              <CardDescription>
                Trạng thái hiện tại của người dùng có vai trò an ninh
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Hoạt động</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{securityData?.active || 0} người dùng</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium">Không hoạt động</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{securityData?.inactive || 0} người dùng</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium">Cảnh báo</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{securityData?.warning || 0} người dùng</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium">Tắt</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{securityData?.offline || 0} người dùng</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Người dùng cần chú ý</CardTitle>
              <CardDescription>
                Các người dùng có trạng thái cảnh báo hoặc không hoạt động
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredSystems
                  .filter(system => system.status === 'warning' || system.status === 'inactive' || system.status === 'offline')
                  .slice(0, 3)
                  .map((system) => (
                    <div key={system.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="text-sm font-medium">{system.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {system.role}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {system.status === 'active' ? 'Hoạt động' :
                         system.status === 'inactive' ? 'Không hoạt động' :
                         system.status === 'warning' ? 'Cảnh báo' : 'Tắt'}
                      </Badge>
                    </div>
                  ))}
                {filteredSystems.filter(system => system.status === 'warning' || system.status === 'inactive' || system.status === 'offline').length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Tất cả người dùng đang hoạt động bình thường
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
