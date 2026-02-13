import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { vehicleService } from '../services'

export const useVehicleStore = defineStore('vehicle', () => {
  // State
  const vehicles = ref([])
  const selectedVehicle = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const vehicleCount = computed(() => vehicles.value.length)
  const vehicleById = computed(() => (id) => vehicles.value.find(v => v.id === id))

  // Actions
  const fetchVehicles = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const data = await vehicleService.getAll()
      vehicles.value = data
      return data
    } catch (err) {
      error.value = err.message || 'خطا در دریافت لیست خودروها'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const getVehicleById = async (id) => {
    isLoading.value = true
    error.value = null
    
    try {
      const vehicle = await vehicleService.getById(id)
      const index = vehicles.value.findIndex(v => v.id === id)
      if (index !== -1) {
        vehicles.value[index] = vehicle
      } else {
        // ورود مستقیم یا رفرش: خودرو در لیست نبود، اضافه کن تا vehicleById آن را برگرداند
        vehicles.value.push(vehicle)
      }
      return vehicle
    } catch (err) {
      error.value = err.message || 'خطا در دریافت اطلاعات خودرو'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createVehicle = async (data) => {
    isLoading.value = true
    error.value = null
    
    try {
      const newVehicle = await vehicleService.create(data)
      vehicles.value.unshift(newVehicle)
      return newVehicle
    } catch (err) {
      error.value = err.message || 'خطا در افزودن خودرو'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateVehicle = async (id, data) => {
    isLoading.value = true
    error.value = null
    
    try {
      const updatedVehicle = await vehicleService.update(id, data)
      const index = vehicles.value.findIndex(v => v.id === id)
      if (index !== -1) {
        vehicles.value[index] = updatedVehicle
      }
      // Update selectedVehicle if it's the same vehicle
      if (selectedVehicle.value?.id === id) {
        selectedVehicle.value = updatedVehicle
      }
      return updatedVehicle
    } catch (err) {
      error.value = err.message || 'خطا در به‌روزرسانی خودرو'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateKm = async (id, km) => {
    isLoading.value = true
    error.value = null
    try {
      const updatedVehicle = await vehicleService.updateKm(id, Number(km))
      const index = vehicles.value.findIndex(v => v.id === id)
      if (index !== -1) {
        vehicles.value[index] = updatedVehicle
      }
      if (selectedVehicle.value?.id === id) {
        selectedVehicle.value = updatedVehicle
      }
      return updatedVehicle
    } catch (err) {
      error.value = err.message || 'خطا در به‌روزرسانی کیلومتر'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteVehicle = async (id) => {
    isLoading.value = true
    error.value = null
    
    try {
      await vehicleService.delete(id)
      const index = vehicles.value.findIndex(v => v.id === id)
      if (index !== -1) {
        vehicles.value.splice(index, 1)
      }
      // Clear selectedVehicle if it's the deleted vehicle
      if (selectedVehicle.value?.id === id) {
        selectedVehicle.value = null
      }
    } catch (err) {
      error.value = err.message || 'خطا در حذف خودرو'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const selectVehicle = (id) => {
    selectedVehicle.value = vehicleById.value(id)
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    vehicles,
    selectedVehicle,
    isLoading,
    error,
    // Getters
    vehicleCount,
    vehicleById,
    // Actions
    fetchVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    updateKm,
    deleteVehicle,
    selectVehicle,
    clearError
  }
})