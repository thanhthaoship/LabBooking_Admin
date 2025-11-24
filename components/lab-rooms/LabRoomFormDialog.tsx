'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateLabRoom } from '@/hooks/useLabRoomsApi'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateLabRoomSchema, CreateLabRoomRequest } from '@/lib/zod/labRooms'

export function LabRoomFormDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const { mutateAsync, isPending } = useCreateLabRoom()
  const form = useForm<CreateLabRoomRequest>({ resolver: zodResolver(CreateLabRoomSchema), defaultValues: { labName: '', location: '', maximumLimit: undefined, mainManagerId: undefined } })

  const onSubmit = async (values: CreateLabRoomRequest) => {
    await mutateAsync(values)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm phòng Lab</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label>Tên phòng</Label>
            <Input {...form.register('labName')} placeholder="VD: LAB A101" />
          </div>
          <div className="space-y-2">
            <Label>Vị trí</Label>
            <Input {...form.register('location')} placeholder="VD: Tòa A, Tầng 3" />
          </div>
          <div className="space-y-2">
            <Label>Sức chứa</Label>
            <Input type="number" {...form.register('maximumLimit', { valueAsNumber: true })} placeholder="VD: 40" />
          </div>
          <div className="space-y-2">
            <Label>ID quản lý chính</Label>
            <Input {...form.register('mainManagerId')} placeholder="UUID" />
          </div>
          <Button type="submit" disabled={isPending} className="w-full bg-orange-500 hover:bg-orange-600">Lưu</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}