'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/common/pagination'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Search } from 'lucide-react'
import { useEquipmentsList } from '@/hooks/useEquipmentsApi'
import { EquipmentFormDialog } from '@/components/equipments/EquipmentFormDialog'
import { EquipmentTable } from '@/components/equipments/EquipmentTable'

export default function EquipmentsPage() {
  const [searchPhrase, setSearchPhrase] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortBy, setSortBy] = useState<string | undefined>('EquipmentName')
  const [sortDirection, setSortDirection] = useState<'Ascending' | 'Descending'>('Ascending')

  const { data, isLoading } = useEquipmentsList({ searchPhrase, pageNumber, pageSize, sortBy, sortDirection })

  return (
    <div className="px-6 py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-orange-600">Quản lý thiết bị</CardTitle>
          <EquipmentFormDialog>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="mr-2 h-4 w-4" /> Thêm thiết bị
            </Button>
          </EquipmentFormDialog>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Tìm thiết bị" value={searchPhrase} onChange={e => setSearchPhrase(e.target.value)} className="pl-9" />
            </div>
            <Tabs value={sortBy || ''} onValueChange={v => setSortBy(v || undefined)}>
              <TabsList>
                <TabsTrigger value="EquipmentName">Tên</TabsTrigger>
                <TabsTrigger value="Status">Trạng thái</TabsTrigger>
                <TabsTrigger value="IsAvailable">Khả dụng</TabsTrigger>
                <TabsTrigger value="LabRoomId">Phòng</TabsTrigger>
              </TabsList>
              <TabsContent value="EquipmentName" />
              <TabsContent value="Status" />
              <TabsContent value="IsAvailable" />
              <TabsContent value="LabRoomId" />
            </Tabs>
            <Button variant="outline" onClick={() => setSortDirection(sortDirection === 'Ascending' ? 'Descending' : 'Ascending')}>{sortDirection}</Button>
          </div>

          <EquipmentTable items={data?.items || []} loading={isLoading} />

          <div className="mt-4">
            <Pagination currentPage={pageNumber} totalPages={data?.totalPages || 1} onPageChange={setPageNumber} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}