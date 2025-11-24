'use client'

import { useState } from 'react'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogAction } from '@/components/ui/alert-dialog'
import { useDeleteLabRoom } from '@/hooks/useLabRoomsApi'

export function DeleteLabRoomDialog({ id, children }: { id: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const { mutateAsync, isPending } = useDeleteLabRoom()

  const onConfirm = async () => {
    await mutateAsync(id)
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa phòng lab?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={onConfirm}>Xóa</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}