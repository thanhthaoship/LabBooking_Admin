'use client'

import { Badge } from '@/components/ui/badge'
import { EquipmentResponse } from '@/lib/zod/equipments'
import { Button } from '@/components/ui/button'
import { UpdateEquipmentDialog } from './UpdateEquipmentDialog'
import { DeleteEquipmentDialog } from './DeleteEquipmentDialog'

export function EquipmentTable({ items, loading }: { items: EquipmentResponse[]; loading: boolean }) {
  if (loading) return <div className="py-10 text-center">Đang tải...</div>
  return (
    <div className="rounded-lg overflow-hidden border">
      <div className="grid grid-cols-6 bg-orange-500 text-white px-4 py-2 text-sm">
        <div>Tên thiết bị</div>
        <div>Mô tả</div>
        <div>Trạng thái</div>
        <div>Khả dụng</div>
        <div>Phòng Lab</div>
        <div></div>
      </div>
      <ul className="divide-y">
        {items.map(item => (
          <li key={item.id} className="grid grid-cols-6 items-center px-4 py-3">
            <div className="font-medium">{item.equipmentName}</div>
            <div className="text-muted-foreground truncate">{item.description || 'Không có'}</div>
            <div><Badge variant="outline">{item.status}</Badge></div>
            <div>{item.isAvailable ? 'Có' : 'Không'}</div>
            <div className="truncate">{item.labRoomId}</div>
            <div className="flex justify-end gap-2">
              <UpdateEquipmentDialog equipment={item}>
                <Button variant="outline" size="sm">Sửa</Button>
              </UpdateEquipmentDialog>
              <DeleteEquipmentDialog id={item.id}>
                <Button variant="destructive" size="sm">Xóa</Button>
              </DeleteEquipmentDialog>
            </div>
          </li>
        ))}
        {items.length === 0 && <li className="px-4 py-6 text-center text-muted-foreground">Không có dữ liệu</li>}
      </ul>
    </div>
  )
}