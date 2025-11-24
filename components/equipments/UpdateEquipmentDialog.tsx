'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useUpdateEquipment } from '@/hooks/useEquipmentsApi'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UpdateEquipmentSchema, UpdateEquipmentRequest, EquipmentResponse } from '@/lib/zod/equipments'

export function UpdateEquipmentDialog({ equipment, children }: { equipment: EquipmentResponse; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const { mutateAsync, isPending } = useUpdateEquipment()

  const form = useForm<UpdateEquipmentRequest>({
    resolver: zodResolver(UpdateEquipmentSchema),
    defaultValues: {
      equipmentName: equipment.equipmentName,
      description: equipment.description ?? undefined,
      isAvailable: equipment.isAvailable,
      labRoomId: equipment.labRoomId,
      status: equipment.status
    }
  })

  const onSubmit = async (values: UpdateEquipmentRequest) => {
    await mutateAsync({ id: equipment.id, body: values })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cập nhật thiết bị</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label>Tên thiết bị</Label>
            <Input {...form.register('equipmentName')} />
          </div>
          <div className="space-y-2">
            <Label>Mô tả</Label>
            <Input {...form.register('description')} />
          </div>
          <div className="space-y-2">
            <Label>Khả dụng</Label>
            <select className="border rounded px-3 py-2" {...form.register('isAvailable')}> 
              <option value={true as any}>Có</option>
              <option value={false as any}>Không</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>LabRoomId</Label>
            <Input {...form.register('labRoomId')} />
          </div>
          <div className="space-y-2">
            <Label>Trạng thái</Label>
            <Select value={form.watch('status')} onValueChange={(v) => form.setValue('status', v as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Maintain">Maintain</SelectItem>
                <SelectItem value="Broken">Broken</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={isPending} className="w-full">Lưu</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}