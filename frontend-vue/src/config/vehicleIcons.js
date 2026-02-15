/**
 * لیست آیکون‌های خودرو/حمل‌ونقل برای انتخاب در فرم خودرو.
 * با Font Awesome Pro Duotone (fa-duotone fa-{name}) رندر می‌شوند.
 * قابل گسترش توسط برنامه‌نویس.
 */
export const VEHICLE_ICON_STYLES = [
  { value: 'duotone', labelKey: 'vehicles.iconStyleDuotone' }
]

export const VEHICLE_ICONS = [
  { name: 'car', labelKey: 'vehicles.iconCar' },
  { name: 'truck', labelKey: 'vehicles.iconTruck' },
  { name: 'van-shuttle', labelKey: 'vehicles.iconVan' },
  { name: 'car-side', labelKey: 'vehicles.iconCarSide' },
  { name: 'truck-pickup', labelKey: 'vehicles.iconPickup' },
  { name: 'bus', labelKey: 'vehicles.iconBus' },
  { name: 'motorcycle', labelKey: 'vehicles.iconMotorcycle' },
  { name: 'car-rear', labelKey: 'vehicles.iconCarRear' },
  { name: 'truck-fast', labelKey: 'vehicles.iconTruckFast' }
]

export const DEFAULT_VEHICLE_ICON = 'car'
export const DEFAULT_VEHICLE_ICON_STYLE = 'duotone'
export const DEFAULT_VEHICLE_ICON_COLOR = '#6b7280'

/** برای نمایش؛ فقط duotone لود شده، پس استایل‌های قدیمی (solid/regular) به duotone نرمال می‌شوند. */
export function getEffectiveIconStyle(style) {
  return style === 'duotone' ? style : 'duotone'
}
