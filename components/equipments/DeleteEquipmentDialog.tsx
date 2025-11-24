'use client'

import { useState } from 'react'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogAction } from '@/components/ui/alert-dialog'
import { useDeleteEquipment } from '@/hooks/useEquipmentsApi'

export function DeleteEquipmentDialog({ id, children }: { id: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const { mutateAsync, isPending } = useDeleteEquipment()

  const onConfirm = async () => {
    await mutateAsync(id)
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa thiết bị?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={onConfirm}>Xóa</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}