import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { serviceService } from '../services'

export const useServiceStore = defineStore('service', () => {
  // State
  const services = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  
  // Filter and search state
  const searchQuery = ref('')
  const filterVehicleId = ref(null)
  const filterType = ref(null)
  const filterDateFrom = ref(null)
  const filterDateTo = ref(null)
  
  // Pagination state
  const currentPage = ref(1)
  const pageSize = ref(10)
  const totalItems = ref(0)

  // Getters
  const servicesByVehicle = computed(() => (vehicleId) => 
    services.value.filter(s => String(s.vehicleId) === String(vehicleId))
  )
  
  const recentServices = computed(() => 
    services.value
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
  )
  
  const totalServiceCost = computed(() => 
    services.value.reduce((total, service) => total + (service.cost || 0), 0)
  )
  
  // Filtered services based on search and filters
  const filteredServices = computed(() => {
    let result = [...services.value]
    
    // Search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(service => 
        service.note?.toLowerCase().includes(query) ||
        service.type?.toLowerCase().includes(query) ||
        service.date?.includes(query) ||
        service.cost?.toString().includes(query)
      )
    }
    
    // Vehicle filter
    if (filterVehicleId.value) {
      result = result.filter(s => s.vehicleId === filterVehicleId.value)
    }
    
    // Type filter
    if (filterType.value) {
      result = result.filter(s => s.type === filterType.value)
    }
    
    // Date range filter
    if (filterDateFrom.value) {
      result = result.filter(s => {
        const serviceDate = new Date(s.date)
        return serviceDate >= new Date(filterDateFrom.value)
      })
    }
    
    if (filterDateTo.value) {
      result = result.filter(s => {
        const serviceDate = new Date(s.date)
        return serviceDate <= new Date(filterDateTo.value)
      })
    }
    
    return result
  })
  
  // Paginated services
  const paginatedServices = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return filteredServices.value.slice(start, end)
  })
  
  // Total pages
  const totalPages = computed(() => 
    Math.ceil(filteredServices.value.length / pageSize.value)
  )

  // Actions
  const fetchServices = async (vehicleId) => {
    isLoading.value = true
    error.value = null
    
    try {
      const data = await serviceService.getAll(vehicleId)
      services.value = data
      totalItems.value = data.length
      // Reset pagination when fetching new data
      currentPage.value = 1
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createService = async (data) => {
    isLoading.value = true
    error.value = null
    
    try {
      const newService = await serviceService.create(data)
      services.value.unshift(newService)
      totalItems.value = services.value.length
      return newService
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateService = async (id, data) => {
    isLoading.value = true
    error.value = null
    
    try {
      const updatedService = await serviceService.update(id, data)
      const index = services.value.findIndex(s => s.id === id)
      if (index !== -1) {
        services.value[index] = updatedService
      }
      return updatedService
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteService = async (id) => {
    isLoading.value = true
    error.value = null
    
    try {
      await serviceService.delete(id)
      const index = services.value.findIndex(s => s.id === id)
      if (index !== -1) {
        services.value.splice(index, 1)
        totalItems.value = services.value.length
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const getServiceById = (id) => {
    return services.value.find(s => s.id === id)
  }

  // Filter actions
  const setSearchQuery = (query) => {
    searchQuery.value = query
    currentPage.value = 1 // Reset to first page when searching
  }
  
  const setFilterVehicle = (vehicleId) => {
    filterVehicleId.value = vehicleId
    currentPage.value = 1
  }
  
  const setFilterType = (type) => {
    filterType.value = type
    currentPage.value = 1
  }
  
  const setDateRange = (from, to) => {
    filterDateFrom.value = from
    filterDateTo.value = to
    currentPage.value = 1
  }
  
  const clearFilters = () => {
    searchQuery.value = ''
    filterVehicleId.value = null
    filterType.value = null
    filterDateFrom.value = null
    filterDateTo.value = null
    currentPage.value = 1
  }
  
  // Pagination actions
  const setPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }
  
  const setPageSize = (size) => {
    pageSize.value = size
    currentPage.value = 1
  }
  
  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
    }
  }
  
  const previousPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    services,
    isLoading,
    error,
    searchQuery,
    filterVehicleId,
    filterType,
    filterDateFrom,
    filterDateTo,
    currentPage,
    pageSize,
    totalItems,
    // Getters
    servicesByVehicle,
    recentServices,
    totalServiceCost,
    filteredServices,
    paginatedServices,
    totalPages,
    // Actions
    fetchServices,
    createService,
    updateService,
    deleteService,
    getServiceById,
    setSearchQuery,
    setFilterVehicle,
    setFilterType,
    setDateRange,
    clearFilters,
    setPage,
    setPageSize,
    nextPage,
    previousPage,
    clearError
  }
})