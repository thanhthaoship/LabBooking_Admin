'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUpdateLabRoom } from '@/hooks/useLabRoomsApi'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UpdateLabRoomSchema, UpdateLabRoomRequest, LabRoomResponse } from '@/lib/zod/labRooms'

export function UpdateLabRoomDialog({ labRoom, children }: { labRoom: LabRoomResponse; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const { mutateAsync, isPending } = useUpdateLabRoom()

  const form = useForm<UpdateLabRoomRequest>({
    resolver: zodResolver(UpdateLabRoomSchema),
    defaultValues: {
      labName: labRoom.labName || '',
      location: labRoom.location || undefined,
      maximumLimit: labRoom.maximumLimit ?? undefined,
      mainManagerId: labRoom.mainManagerId || undefined,
      isActive: labRoom.isActive
    }
  })

  const onSubmit = async (values: UpdateLabRoomRequest) => {
    await mutateAsync({ id: labRoom.id, body: values })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cập nhật phòng Lab</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label>Tên phòng</Label>
            <Input {...form.register('labName')} />
          </div>
          <div className="space-y-2">
            <Label>Vị trí</Label>
            <Input {...form.register('location')} />
          </div>
          <div className="space-y-2">
            <Label>Sức chứa</Label>
            <Input type="number" {...form.register('maximumLimit', { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label>ID quản lý chính</Label>
            <Input {...form.register('mainManagerId')} />
          </div>
          <div className="space-y-2">
            <Label>Trạng thái</Label>
            <select className="border rounded px-3 py-2" {...form.register('isActive')}> 
              <option value={true as any}>Đang hoạt động</option>
              <option value={false as any}>Không hoạt động</option>
            </select>
          </div>
          <Button type="submit" disabled={isPending} className="w-full">Lưu</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}