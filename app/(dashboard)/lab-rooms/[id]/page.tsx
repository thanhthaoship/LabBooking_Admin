'use client'

import { notFound } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useLabRoom } from '@/hooks/useLabRoomsApi'

export default function LabRoomDetail({ params }: { params: { id: string } }) {
  const { data, isLoading, error } = useLabRoom(params.id)
  if (error) return notFound()
  if (isLoading) return <div className="p-6">Đang tải...</div>
  if (!data) return notFound()

  return (
    <div className="px-6 py-6">
      <Card>
        <CardHeader>
          <CardTitle>{data.labName || 'Phòng lab'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>Vị trí: {data.location || 'Chưa cập nhật'}</div>
            <div>Sức chứa: {data.maximumLimit ?? 0}</div>
            <div>Quản lý chính: {data.mainManagerId ?? 'Chưa cập nhật'}</div>
            <div>
              Trạng thái: <Badge variant={data.isActive ? 'default' : 'outline'}>{data.isActive ? 'Đang hoạt động' : 'Không hoạt động'}</Badge>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="font-medium mb-2">Thiết bị</h3>
            <ul className="space-y-2">
              {(data.equipments || []).map(e => (
                <li key={e.id} className="border rounded p-3 flex items-center justify-between">
                  <div className="font-medium">{e.equipmentName}</div>
                  <div className="text-sm">{e.status}</div>
                </li>
              ))}
              {(data.equipments || []).length === 0 && <li className="text-muted-foreground">Chưa có thiết bị</li>}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}