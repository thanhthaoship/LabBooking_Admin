import labsData from '@/lib/mock-data/labs.json'
import devicesData from '@/lib/mock-data/devices.json'
import securityData from '@/lib/mock-data/security-systems.json'
import bookingsData from '@/lib/mock-data/bookings.json'
import { Lab, CreateLabRequest, UpdateLabRequest, LabResponse, LabDetailResponse } from '@/lib/api/services/fetchLab'
import { Device, CreateDeviceRequest, UpdateDeviceRequest, DeviceResponse, DeleteDeviceResponse, DeviceDetailResponse } from '@/lib/api/services/fetchDevice'
import { SecuritySystem, CreateSecurityRequest, UpdateSecurityRequest, SecurityResponse, SecurityDetailResponse, DeleteSecurityResponse } from '@/lib/api/services/fetchSecurity'

// Mock API service to simulate API calls
export const mockApiService = {
  // Simulate network delay
  delay: (ms: number = 100) => new Promise(resolve => setTimeout(resolve, ms)),

  // Labs API
  labs: {
    getAll: async () => {
      await mockApiService.delay()
      return {
        code: '200',
        status: true,
        message: 'Success',
        data: labsData.labs as Lab[]
      } as LabResponse;
    },

    getById: async (id: string) => {
      await mockApiService.delay()
      const lab = labsData.labs.find(l => l.id === id)
      return {
        code: lab ? '200' : '404',
        status: !!lab,
        message: lab ? 'Success' : 'Lab not found',
        data: lab as Lab
      } as LabDetailResponse;
    },

    search: async (query: string) => {
      await mockApiService.delay()
      const filteredLabs = labsData.labs.filter(lab =>
        lab.roomName.toLowerCase().includes(query.toLowerCase()) ||
        lab.roomCode.toLowerCase().includes(query.toLowerCase()) ||
        lab.manager.name.toLowerCase().includes(query.toLowerCase())
      )
      return {
        code: '200',
        status: true,
        message: 'Success',
        data: filteredLabs as Lab[]
      } as LabResponse;
    },

    getByStatus: async (status: string) => {
      await mockApiService.delay()
      const filteredLabs = labsData.labs.filter(lab => lab.status === status)
      return {
        code: '200',
        status: true,
        message: 'Success',
        data: filteredLabs as Lab[]
      } as LabResponse;
    },

    getByManager: async (managerId: string) => {
      await mockApiService.delay()
      const filteredLabs = labsData.labs.filter(lab => lab.manager.id === managerId)
      return {
        code: '200',
        status: true,
        message: 'Success',
        data: filteredLabs as Lab[]
      } as LabResponse;
    },

    create: async (labData: CreateLabRequest) => {
      await mockApiService.delay()
      const newLab: Lab = {
        id: (labsData.labs.length + 1).toString(),
        ...labData,
        manager: {
          id: labData.managerId,
          name: 'Quản lý mới',
          email: 'manager@university.edu.vn',
          phone: '0123456789',
          department: 'Khoa mới'
        },
        status: 'available',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      labsData.labs.push(newLab)
      return {
        code: '201',
        status: true,
        message: 'Lab created successfully',
        data: newLab as Lab
      } as LabDetailResponse;
    },

    update: async (id: string, labData: UpdateLabRequest) => {
      await mockApiService.delay()
      const labIndex = labsData.labs.findIndex(lab => lab.id === id)
      if (labIndex === -1) {
        return {
          code: '404',
          status: false,
          message: 'Lab not found',
          data: null as Lab | null
        } as LabDetailResponse;
      }
      
      const updatedLab = {
        ...labsData.labs[labIndex],
        ...labData,
        updatedAt: new Date().toISOString()
      }
      labsData.labs[labIndex] = updatedLab
      
      return {
        code: '200',
        status: true,
        message: 'Lab updated successfully',
        data: updatedLab as Lab
      } as LabDetailResponse;
    },

    delete: async (id: string) => {
      await mockApiService.delay()
      const labIndex = labsData.labs.findIndex(lab => lab.id === id)
      if (labIndex === -1) {
        return {
          code: '404',
          status: false,
          message: 'Lab not found',
          data: null as Lab | null
        } as LabDetailResponse;
      }
      
      labsData.labs.splice(labIndex, 1)
      return {
        code: '200',
        status: true,
        message: 'Lab deleted successfully',
        data: null as null
      } as DeleteDeviceResponse;
    }
  },

  // Devices API
  devices: {
    getAll: async (): Promise<DeviceResponse> => {
      await mockApiService.delay()
      return {
        code: '200',
        status: true,
        message: 'Success',
        data: devicesData.devices as Device[]
      } as DeviceResponse;
    },

    getById: async (id: string) => {
      await mockApiService.delay()
      const device = devicesData.devices.find(d => d.id === id)
      return {
        code: device ? '200' : '404',
        status: !!device,
        message: device ? 'Success' : 'Device not found',
        data: device as Device
      } as DeviceDetailResponse;
    },

    search: async (query: string) => {
      await mockApiService.delay()
      const filteredDevices = devicesData.devices.filter(device =>
        device.name.toLowerCase().includes(query.toLowerCase()) ||
        device.code.toLowerCase().includes(query.toLowerCase()) ||
        device.ownedByLab.toLowerCase().includes(query.toLowerCase()) ||
        device.type.toLowerCase().includes(query.toLowerCase())
      )
      return {
        code: '200',
        status: true,
        message: 'Success',
        data: filteredDevices as Device[]
      } as DeviceResponse;
    },

    getByLab: async (labCode: string) => {
      await mockApiService.delay()
      const filteredDevices = devicesData.devices.filter(device => device.ownedByLab === labCode)
      return {
        code: '200',
        status: true,
        message: 'Success',
        data: filteredDevices as Device[]
      } as DeviceResponse;
    },

    getByStatus: async (status: string) => {
      await mockApiService.delay()
      const filteredDevices = devicesData.devices.filter(device => device.status === status)
      return {
        code: '200',
        status: true,
        message: 'Success',
        data: filteredDevices as Device[]
      } as DeviceResponse;
    },

    getByType: async (type: string) => {
      await mockApiService.delay()
      const filteredDevices = devicesData.devices.filter(device => device.type === type)
      return {
        code: '200',
        status: true,
        message: 'Success',
        data: filteredDevices as Device[]
      } as DeviceResponse;
    },

    create: async (deviceData: CreateDeviceRequest) => {
      await mockApiService.delay()
      const newDevice: Device = {
        id: (devicesData.devices.length + 1).toString(),
        ...deviceData,
        status: 'available',
        lastMaintenance: new Date().toISOString(),
        nextMaintenance: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      devicesData.devices.push(newDevice as any)
      return {
        code: '201',
        status: true,
        message: 'Device created successfully',
        data: newDevice as Device
      } as DeviceDetailResponse;
    },

    update: async (id: string, deviceData: UpdateDeviceRequest) => {
      await mockApiService.delay()
      const deviceIndex = devicesData.devices.findIndex(device => device.id === id)
      if (deviceIndex === -1) {
        return {
          code: '404',
          status: false,
          message: 'Device not found',
          data: null as Device | null
        } as DeviceDetailResponse;
      }
      
      const updatedDevice = {
        ...devicesData.devices[deviceIndex],
        ...deviceData,
        updatedAt: new Date().toISOString()
      }
      devicesData.devices[deviceIndex] = updatedDevice as any
      
      return {
        code: '200',
        status: true,
        message: 'Device updated successfully',
        data: updatedDevice as Device
      } as DeviceDetailResponse;
    },

    delete: async (id: string) => {
      await mockApiService.delay()
      const deviceIndex = devicesData.devices.findIndex(device => device.id === id)
      if (deviceIndex === -1) {
        return {
          code: '404',
          status: false,
          message: 'Device not found',
          data: null as Device | null
        } as DeviceDetailResponse;
      }
      
      devicesData.devices.splice(deviceIndex, 1)
      return {
        code: '200',
        status: true,
        message: 'Device deleted successfully',
        data: null as null
      } as DeleteDeviceResponse;
    },

    updateStatus: async (id: string, status: string) => {
      await mockApiService.delay()
      const deviceIndex = devicesData.devices.findIndex(device => device.id === id)
      if (deviceIndex === -1) {
        return {
          code: '404',
          status: false,
          message: 'Device not found',
          data: null as Device | null
        } as DeviceDetailResponse;
      }
      
      const updatedDevice = {
        ...devicesData.devices[deviceIndex],
        status: status as Device['status'],
        updatedAt: new Date().toISOString()
      }
      devicesData.devices[deviceIndex] = updatedDevice as any
      
      return {
        code: '200',
        status: true,
        message: 'Device status updated successfully',
        data: updatedDevice as Device
      } as DeviceDetailResponse;
    },

    scheduleMaintenance: async (id: string, maintenanceDate: string) => {
      await mockApiService.delay()
      const deviceIndex = devicesData.devices.findIndex(device => device.id === id)
      if (deviceIndex === -1) {
        return {
          code: '404',
          status: false,
          message: 'Device not found',
          data: null as Device | null
        } as DeviceDetailResponse;
      }
      
      const updatedDevice = {
        ...devicesData.devices[deviceIndex],
        lastMaintenance: new Date().toISOString(),
        nextMaintenance: maintenanceDate,
        updatedAt: new Date().toISOString()
      }
      devicesData.devices[deviceIndex] = updatedDevice as any
      
      return {
        code: '200',
        status: true,
        message: 'Maintenance scheduled successfully',
        data: updatedDevice as Device
      } as DeviceDetailResponse;
    }
  },

  // Security Systems API
  security: {
    getAll: async () => {
      await mockApiService.delay()
      return {
        code: '200',
        status: true,
        message: 'Success',
        data: securityData.securitySystems as SecuritySystem[]
      } as SecurityResponse;
    },

    getById: async (id: string) => {
      await mockApiService.delay()
      const system = securityData.securitySystems.find(s => s.id === id)
      return {
        code: system ? '200' : '404',
        status: !!system,
        message: system ? 'Success' : 'Security system not found',
        data: system as SecuritySystem
      } as SecurityDetailResponse;
    },

    search: async (query: string) => {
      await mockApiService.delay()
      const filteredSystems = securityData.securitySystems.filter(system =>
        system.name.toLowerCase().includes(query.toLowerCase()) ||
        system.role.toLowerCase().includes(query.toLowerCase()) ||
        system.type.toLowerCase().includes(query.toLowerCase()) ||
        system.department.toLowerCase().includes(query.toLowerCase())
      )
      return {
        code: '200',
        status: true,
        message: 'Success',
        data: filteredSystems as SecuritySystem[]
      } as SecurityResponse;
    },

    getByStatus: async (status: string) => {
      await mockApiService.delay()
      const filteredSystems = securityData.securitySystems.filter(system => system.status === status)
      return {
        code: '200',
        status: true,
        message: 'Success',
        data: filteredSystems as SecuritySystem[]
      } as SecurityResponse;
    },

    getByType: async (type: string) => {
      await mockApiService.delay()
      const filteredSystems = securityData.securitySystems.filter(system => system.type === type)
      return {
        code: '200',
        status: true,
        message: 'Success',
        data: filteredSystems as SecuritySystem[]
      } as SecurityResponse;
    },

    create: async (systemData: CreateSecurityRequest) => {
      await mockApiService.delay()
      const newSystem: SecuritySystem = {
        id: (securityData.securitySystems.length + 1).toString(),
        ...systemData,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      securityData.securitySystems.push(newSystem as any)
      return {
        code: '201',
        status: true,
        message: 'Security system created successfully',
        data: newSystem as SecuritySystem
      } as SecurityDetailResponse;
    },

    update: async (id: string, systemData: UpdateSecurityRequest) => {
      await mockApiService.delay()
      const systemIndex = securityData.securitySystems.findIndex(system => system.id === id)
      if (systemIndex === -1) {
        return {
          code: '404',
          status: false,
          message: 'Security system not found',
          data: null as SecuritySystem | null
        } as SecurityDetailResponse;
      }
      
      const updatedSystem = {
        ...securityData.securitySystems[systemIndex],
        ...systemData,
        updatedAt: new Date().toISOString()
      }
      securityData.securitySystems[systemIndex] = updatedSystem as any
      
      return {
        code: '200',
        status: true,
        message: 'Security system updated successfully',
        data: updatedSystem as SecuritySystem
      } as SecurityDetailResponse;
    },

    delete: async (id: string) => {
      await mockApiService.delay()
      const systemIndex = securityData.securitySystems.findIndex(system => system.id === id)
      if (systemIndex === -1) {
        return {
          code: '404',
          status: false,
          message: 'Security system not found',
          data: null as SecuritySystem | null
        } as SecurityDetailResponse;
      }
      
      securityData.securitySystems.splice(systemIndex, 1)
      return {
        code: '200',
        status: true,
        message: 'Security system deleted successfully',
        data: null as null
      } as DeleteSecurityResponse;
    },

    updateStatus: async (id: string, status: string) => {
      await mockApiService.delay()
      const systemIndex = securityData.securitySystems.findIndex(system => system.id === id)
      if (systemIndex === -1) {
        return {
          code: '404',
          status: false,
          message: 'Security system not found',
          data: null as SecuritySystem | null
        } as SecurityDetailResponse;
      }
      
      const updatedSystem = {
        ...securityData.securitySystems[systemIndex],
        status: status as SecuritySystem['status'],
        updatedAt: new Date().toISOString()
      }
      securityData.securitySystems[systemIndex] = updatedSystem as any
      
      return {
        code: '200',
        status: true,
        message: 'Security system status updated successfully',
        data: updatedSystem as SecuritySystem
      } as SecurityDetailResponse;
    }
  },

  // Bookings API
  bookings: {
    getAllBookings: async () => {
      await mockApiService.delay()
      return {
        code: '200',
        status: true,
        message: 'Success',
        data: bookingsData.bookings
      }
    },

    getLabBookings: async (labId: string) => {
      await mockApiService.delay()
      const labBookings = bookingsData.bookings.filter(booking => booking.labId === labId)
      return {
        code: '200',
        status: true,
        message: 'Success',
        data: labBookings
      }
    },

    getDeviceBookings: async (deviceId: string) => {
      await mockApiService.delay()
      // For device bookings, we'll create a mapping based on lab devices
      // This is a simplified approach - in real app, you'd have separate device booking data
      const deviceBookings = [
        {
          id: 'device-booking-1',
          deviceId: deviceId,
          userId: 'user-1',
          userName: 'Nguyễn Văn A',
          userEmail: 'nguyenvana@example.com',
          userPhone: '0901234567',
          startTime: '09:00',
          endTime: '11:00',
          date: '2024-01-25',
          purpose: 'Sử dụng kính hiển vi để quan sát mẫu vật',
          status: 'in_use',
          createdAt: '2024-01-20T10:00:00Z'
        },
        {
          id: 'device-booking-2',
          deviceId: deviceId,
          userId: 'user-2',
          userName: 'Trần Thị B',
          userEmail: 'tranthib@example.com',
          userPhone: '0907654321',
          startTime: '14:00',
          endTime: '16:00',
          date: '2024-01-25',
          purpose: 'Nghiên cứu cấu trúc tế bào',
          status: 'scheduled',
          createdAt: '2024-01-21T14:30:00Z'
        },
        {
          id: 'device-booking-3',
          deviceId: deviceId,
          userId: 'user-3',
          userName: 'Lê Văn C',
          userEmail: 'levanc@example.com',
          userPhone: '0912345678',
          startTime: '10:00',
          endTime: '12:00',
          date: '2024-01-24',
          purpose: 'Phân tích mẫu vi khuẩn',
          status: 'completed',
          createdAt: '2024-01-22T09:15:00Z'
        }
      ]
      
      return {
        code: '200',
        status: true,
        message: 'Success',
        data: deviceBookings
      }
    }
  }
}
