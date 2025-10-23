"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { SecuritySystem, UpdateSecurityRequest } from "@/lib/api/services/fetchSecurity"
import { securityService } from "@/lib/api/services/fetchSecurity"

interface EditSecuritySheetProps {
  system: SecuritySystem
  open: boolean
  onOpenChange: (open: boolean) => void
  onSystemUpdated?: (updatedSystem: SecuritySystem) => void
}

export function EditSecuritySheet({ system, open, onOpenChange, onSystemUpdated }: EditSecuritySheetProps) {
  const [formData, setFormData] = useState({
    name: system.name,
    role: system.role,
    type: system.type,
    description: system.description,
    department: system.department,
    contact: system.contact,
    priority: system.priority,
    status: system.status,
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const updateData: UpdateSecurityRequest = {
        name: formData.name,
        role: formData.role,
        type: formData.type,
        description: formData.description,
        department: formData.department,
        contact: formData.contact,
        priority: formData.priority as 'low' | 'medium' | 'high',
        status: formData.status as 'active' | 'inactive' | 'warning' | 'offline',
      }

      const response = await securityService.updateSecuritySystem(system.id, updateData)
      
      if (response.status && response.data) {
        onSystemUpdated?.(response.data)
        onOpenChange(false)
      }
    } catch (error) {
      console.error("Error updating security system:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Chỉnh sửa hệ thống an ninh</SheetTitle>
          <SheetDescription>
            Cập nhật thông tin hệ thống {system.name}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên hệ thống</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Nhập tên hệ thống"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Vai trò</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => handleInputChange("role", e.target.value)}
                placeholder="Nhập vai trò"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Loại hệ thống</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại hệ thống" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="An ninh con người">An ninh con người</SelectItem>
                    <SelectItem value="Bảo mật dữ liệu">Bảo mật dữ liệu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                    <SelectItem value="warning">Cảnh báo</SelectItem>
                    <SelectItem value="offline">Tắt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Mức độ ưu tiên</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn mức độ ưu tiên" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Cao</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="low">Thấp</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Phòng ban</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => handleInputChange("department", e.target.value)}
                placeholder="Nhập phòng ban"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Liên hệ</Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) => handleInputChange("contact", e.target.value)}
                placeholder="Nhập số điện thoại"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Nhập mô tả hệ thống"
                rows={3}
              />
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
