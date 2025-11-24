'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/common/pagination'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Search } from 'lucide-react'
import { useLabRoomsList } from '@/hooks/useLabRoomsApi'
import { LabRoomFormDialog } from '@/components/lab-rooms/LabRoomFormDialog'
import { LabRoomTable } from '@/components/lab-rooms/LabRoomTable'
import { SiteHeader } from '@/components/sidebar/site-header'

export default function LabRoomsPage() {
  const [searchPhrase, setSearchPhrase] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortBy, setSortBy] = useState<string | undefined>(undefined)
  const [sortDirection, setSortDirection] = useState<'Ascending' | 'Descending'>('Ascending')

  const { data, isLoading } = useLabRoomsList({ searchPhrase, pageNumber, pageSize, sortBy, sortDirection })

  return (
    <>
    <SiteHeader title="QUẢN LÝ PHÒNG LAB" />
    <div className="px-6 py-6 bg-[#FBE8D2]">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-orange-600 uppercase tracking-wide">Quản lý phòng lab</CardTitle>
          <LabRoomFormDialog>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" /> Thêm phòng Lab
            </Button>
          </LabRoomFormDialog>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Tìm phòng lab" value={searchPhrase} onChange={e => setSearchPhrase(e.target.value)} className="pl-9" />
            </div>
            <Tabs value={sortBy || ''} onValueChange={v => setSortBy(v || undefined)}>
              <TabsList>
                <TabsTrigger value="">Mặc định</TabsTrigger>
                <TabsTrigger value="LabName">Tên</TabsTrigger>
                <TabsTrigger value="Location">Vị trí</TabsTrigger>
                <TabsTrigger value="CreatedDate">Ngày tạo</TabsTrigger>
              </TabsList>
              <TabsContent value="" />
              <TabsContent value="LabName" />
              <TabsContent value="Location" />
              <TabsContent value="CreatedDate" />
            </Tabs>
            <Button variant="outline" onClick={() => setSortDirection(sortDirection === 'Ascending' ? 'Descending' : 'Ascending')}>{sortDirection}</Button>
          </div>

          <LabRoomTable items={data?.items || []} loading={isLoading} />

          <div className="mt-4">
            <Pagination currentPage={pageNumber} totalPages={data?.totalPages || 1} onPageChange={setPageNumber} />
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  )
}