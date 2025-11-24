'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { LabRoomResponse } from '@/lib/zod/labRooms'
import { Button } from '@/components/ui/button'
import { UpdateLabRoomDialog } from './UpdateLabRoomDialog'
import { DeleteLabRoomDialog } from './DeleteLabRoomDialog'

export function LabRoomTable({ items, loading }: { items: LabRoomResponse[]; loading: boolean }) {
  if (loading) return <div className="py-10 text-center">Đang tải...</div>
  return (
    <div className="rounded-lg overflow-hidden border">
      <div className="grid grid-cols-7 bg-orange-500 text-white px-4 py-2 text-sm">
        <div>Tên phòng</div>
        <div>Mã phòng</div>
        <div>Sức chứa</div>
        <div>Trạng thái</div>
        <div>Người quản lý</div>
        <div>Thiết bị</div>
        <div></div>
      </div>
      <ul className="divide-y">
        {items.map(item => (
          <li key={item.id} className="grid grid-cols-7 items-center px-4 py-3">
            <div className="font-medium">{item.labName || 'Chưa đặt tên'}</div>
            <div className="text-muted-foreground">{`LAB-${item.id.substring(0, 4).toUpperCase()}`}</div>
            <div>{item.maximumLimit ?? 0}</div>
            <div>
              <Badge variant={item.isActive ? 'default' : 'outline'}>{item.isActive ? 'Đang hoạt động' : 'Không hoạt động'}</Badge>
            </div>
            <div className="truncate">{item.mainManagerId ?? 'Chưa cập nhật'}</div>
            <div>{item.equipments?.length ?? 0}</div>
            <div className="flex justify-end gap-2">
              <Link href={`/(dashboard)/lab-rooms/${item.id}`} className="text-orange-600 hover:underline">Xem</Link>
              <UpdateLabRoomDialog labRoom={item}>
                <Button variant="outline" size="sm">Sửa</Button>
              </UpdateLabRoomDialog>
              <DeleteLabRoomDialog id={item.id}>
                <Button variant="destructive" size="sm">Xóa</Button>
              </DeleteLabRoomDialog>
            </div>
          </li>
        ))}
        {items.length === 0 && <li className="px-4 py-6 text-center text-muted-foreground">Không có dữ liệu</li>}
      </ul>
    </div>
  )
}