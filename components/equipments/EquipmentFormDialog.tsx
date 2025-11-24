'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateEquipment } from '@/hooks/useEquipmentsApi'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateEquipmentSchema, CreateEquipmentRequest } from '@/lib/zod/equipments'

export function EquipmentFormDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const { mutateAsync, isPending } = useCreateEquipment()
  const form = useForm<CreateEquipmentRequest>({ resolver: zodResolver(CreateEquipmentSchema), defaultValues: { equipmentName: '', description: '', labRoomId: '' } })

  const onSubmit = async (values: CreateEquipmentRequest) => {
    await mutateAsync(values)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm thiết bị</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label>Tên thiết bị</Label>
            <Input {...form.register('equipmentName')} placeholder="VD: Kính hiển vi" />
          </div>
          <div className="space-y-2">
            <Label>Mô tả</Label>
            <Input {...form.register('description')} placeholder="Mô tả" />
          </div>
          <div className="space-y-2">
            <Label>LabRoomId</Label>
            <Input {...form.register('labRoomId')} placeholder="UUID phòng" />
          </div>
          <Button type="submit" disabled={isPending} className="w-full bg-orange-500 hover:bg-orange-600">Lưu</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}