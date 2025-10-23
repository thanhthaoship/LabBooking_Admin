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
import { Device, UpdateDeviceRequest, DeviceSpecifications } from "@/lib/api/services/fetchDevice"
import { deviceService } from "@/lib/api/services/fetchDevice"

interface EditDeviceSheetProps {
  device: Device
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeviceUpdated?: (updatedDevice: Device) => void
}

export function EditDeviceSheet({ device, open, onOpenChange, onDeviceUpdated }: EditDeviceSheetProps) {
  const [formData, setFormData] = useState({
    name: device.name,
    code: device.code,
    ownedByLab: device.ownedByLab,
    type: device.type,
    brand: device.brand,
    model: device.model,
    serialNumber: device.serialNumber,
    purchaseDate: device.purchaseDate.split('T')[0], // Convert to YYYY-MM-DD format
    warrantyExpiry: device.warrantyExpiry.split('T')[0], // Convert to YYYY-MM-DD format
    location: device.location,
    description: device.description,
    status: device.status,
    specifications: device.specifications,
  })
  const [newSpecKey, setNewSpecKey] = useState("")
  const [newSpecValue, setNewSpecValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSpecificationChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value
      }
    }))
  }

  const handleAddSpecification = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      handleSpecificationChange(newSpecKey.trim(), newSpecValue.trim())
      setNewSpecKey("")
      setNewSpecValue("")
    }
  }

  const handleRemoveSpecification = (key: string) => {
    setFormData(prev => {
      const newSpecs = { ...prev.specifications }
      delete newSpecs[key]
      return {
        ...prev,
        specifications: newSpecs
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const updateData: UpdateDeviceRequest = {
        name: formData.name,
        code: formData.code,
        ownedByLab: formData.ownedByLab,
        type: formData.type,
        brand: formData.brand,
        model: formData.model,
        serialNumber: formData.serialNumber,
        purchaseDate: formData.purchaseDate,
        warrantyExpiry: formData.warrantyExpiry,
        location: formData.location,
        description: formData.description,
        status: formData.status,
        specifications: formData.specifications,
      }

      const response = await deviceService.updateDevice(device.id, updateData)
      
      if (response.status && response.data) {
        onDeviceUpdated?.(response.data)
        onOpenChange(false)
      }
    } catch (error) {
      console.error("Error updating device:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Chỉnh sửa thiết bị</SheetTitle>
          <SheetDescription>
            Cập nhật thông tin thiết bị {device.name}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 p-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên thiết bị</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Nhập tên thiết bị"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Mã thiết bị</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => handleInputChange("code", e.target.value)}
                  placeholder="Nhập mã thiết bị"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Loại thiết bị</Label>
                <Input
                  id="type"
                  value={formData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  placeholder="Nhập loại thiết bị"
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
                    <SelectItem value="in_use">Đang sử dụng</SelectItem>
                    <SelectItem value="maintenance">Bảo trì</SelectItem>
                    <SelectItem value="broken">Hỏng</SelectItem>
                    <SelectItem value="retired">Ngừng sử dụng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Hãng</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleInputChange("brand", e.target.value)}
                  placeholder="Nhập hãng"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => handleInputChange("model", e.target.value)}
                  placeholder="Nhập model"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serialNumber">Số seri</Label>
                <Input
                  id="serialNumber"
                  value={formData.serialNumber}
                  onChange={(e) => handleInputChange("serialNumber", e.target.value)}
                  placeholder="Nhập số seri"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ownedByLab">Thuộc phòng</Label>
                <Input
                  id="ownedByLab"
                  value={formData.ownedByLab}
                  onChange={(e) => handleInputChange("ownedByLab", e.target.value)}
                  placeholder="Nhập tên phòng"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="purchaseDate">Ngày mua</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => handleInputChange("purchaseDate", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="warrantyExpiry">Hết bảo hành</Label>
                <Input
                  id="warrantyExpiry"
                  type="date"
                  value={formData.warrantyExpiry}
                  onChange={(e) => handleInputChange("warrantyExpiry", e.target.value)}
                  required
                />
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
                placeholder="Nhập mô tả thiết bị"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Thông số kỹ thuật</Label>
              <div className="flex gap-2">
                <Input
                  value={newSpecKey}
                  onChange={(e) => setNewSpecKey(e.target.value)}
                  placeholder="Tên thông số"
                />
                <Input
                  value={newSpecValue}
                  onChange={(e) => setNewSpecValue(e.target.value)}
                  placeholder="Giá trị"
                />
                <Button type="button" onClick={handleAddSpecification} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.entries(formData.specifications).map(([key, value]) => (
                  <Badge key={key} variant="outline" className="flex items-center gap-1">
                    {key}: {value}
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecification(key)}
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
