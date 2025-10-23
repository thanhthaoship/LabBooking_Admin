"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Lab, UpdateLabRequest } from "@/lib/api/services/fetchLab"
import { labService } from "@/lib/api/services/fetchLab"

interface EditLabSheetProps {
  lab: Lab
  open: boolean
  onOpenChange: (open: boolean) => void
  onLabUpdated?: (updatedLab: Lab) => void
}

export function EditLabSheet({ lab, open, onOpenChange, onLabUpdated }: EditLabSheetProps) {
  const [formData, setFormData] = useState({
    roomName: lab.roomName,
    roomCode: lab.roomCode,
    capacity: lab.capacity,
    location: lab.location,
    description: lab.description,
    status: lab.status,
    equipment: lab.equipment,
  })
  const [newEquipment, setNewEquipment] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddEquipment = () => {
    if (newEquipment.trim() && !formData.equipment.includes(newEquipment.trim())) {
      setFormData(prev => ({
        ...prev,
        equipment: [...prev.equipment, newEquipment.trim()]
      }))
      setNewEquipment("")
    }
  }

  const handleRemoveEquipment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const updateData: UpdateLabRequest = {
        roomName: formData.roomName,
        roomCode: formData.roomCode,
        capacity: formData.capacity,
        location: formData.location,
        description: formData.description,
        status: formData.status,
        equipment: formData.equipment,
      }

      const response = await labService.updateLab(lab.id, updateData)
      
      if (response.status && response.data) {
        onLabUpdated?.(response.data)
        onOpenChange(false)
      }
    } catch (error) {
      console.error("Error updating lab:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Chỉnh sửa phòng lab</SheetTitle>
          <SheetDescription>
            Cập nhật thông tin phòng lab {lab.roomName}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 p-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="roomName">Tên phòng</Label>
                <Input
                  id="roomName"
                  value={formData.roomName}
                  onChange={(e) => handleInputChange("roomName", e.target.value)}
                  placeholder="Nhập tên phòng"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomCode">Mã phòng</Label>
                <Input
                  id="roomCode"
                  value={formData.roomCode}
                  onChange={(e) => handleInputChange("roomCode", e.target.value)}
                  placeholder="Nhập mã phòng"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Sức chứa</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange("capacity", parseInt(e.target.value) || 0)}
                  placeholder="Nhập sức chứa"
                  min="1"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Có sẵn</SelectItem>
                    <SelectItem value="occupied">Đang sử dụng</SelectItem>
                    <SelectItem value="maintenance">Bảo trì</SelectItem>
                    <SelectItem value="closed">Đóng cửa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Vị trí</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Nhập vị trí"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Nhập mô tả phòng lab"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Thiết bị</Label>
              <div className="flex gap-2">
                <Input
                  value={newEquipment}
                  onChange={(e) => setNewEquipment(e.target.value)}
                  placeholder="Nhập thiết bị mới"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddEquipment()
                    }
                  }}
                />
                <Button type="button" onClick={handleAddEquipment} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.equipment.map((item, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {item}
                    <button
                      type="button"
                      onClick={() => handleRemoveEquipment(index)}
                      className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <SheetFooter className="p-0">
            <div className="flex gap-2 w-full">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
