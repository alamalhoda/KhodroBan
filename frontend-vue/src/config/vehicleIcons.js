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

/** آیکون‌های ترجیحی برای نمایش در ابتدای لیست انتخابگر (خودرو/حمل‌ونقل). ترتیب این آرایه در UI حفظ می‌شود. */
export const VEHICLE_PREFERRED_ICON_NAMES = [
  // آیکون‌های پایه و رایج (اغلب Free یا خیلی پراستفاده)
  'car',
  'car-side',
  'car-rear',
  'truck',
  'truck-pickup',
  'van-shuttle',
  'bus',
  'bus-simple',
  'motorcycle',          // اضافه شده اگر مرتبط باشه (در Automotive هست)
  'car-battery',
  'car-burst',
  'car-garage',
  'car-wash',
  'caravan',
  'gas-pump',
  'oil-can',
  'gauge',
  'wrench',
  'tire',
  'engine',

  // بقیه آیکون‌های Automotive Solid (Pro + Free اضافی، بدون تکرار)
  'brake-warning',
  'bus-side',
  'bus-stop',
  'car-bolt',
  'car-building',
  'car-bump',
  'car-bus',
  'car-crash',
  'car-mechanic',
  'car-on',
  'car-tilt',
  'car-tunnel',
  'car-wrench',
  'caravan-simple',
  'carpool',
  'cars',
  'charging-station',
  'engine-exclamation',
  'engine-warning',
  'garage',
  'garage-car',
  'garage-open',
  'gas-pump-slash',
  'gauge-high',
  'gauge-low',
  'gauge-max',
  'gauge-med',
  'gauge-min',
  'gauge-simple',
  'gauge-simple-high',
  'gauge-simple-low',
  'gauge-simple-max',
  'gauge-simple-med',
  'gauge-simple-min',
  'key',
  'keys',
  'license-plate',
  'oil-temperature',
  'parking',
  'parking-circle',
  'parking-circle-slash',
  'parking-slash',
  'pump',
  'radiation',
  'radiation-alt',
  'road',
  'road-barrier',
  'road-spikes',
  'rocket',
  'seat-airline',
  'seat-car',
  'seat-couch',
  'seat-school',
  'seat-school-bus',
  'seatbus',
  'shield-car',
  'sign-parking',
  'sign-parking-slash',
  'sign-stop',
  'sign-traffic',
  'sign-traffic-light',
  'sign-traffic-light-slash',
  'siren',
  'siren-on',
  'speedometer',
  'square-parking',
  'square-parking-slash',
  'steering-wheel',
  'tachometer',
  'tachometer-alt',
  'tachometer-average',
  'tachometer-fast',
  'tachometer-fastest',
  'tachometer-slow',
  'tachometer-slowest',
  'taxi',
  'taxi-bus',
  'tire-flat',
  'tire-pressure-warning',
  'tire-rugged',
  'trailer',
  'transmission',
  'truck-bolt',
  'truck-container',
  'truck-couch',
  'truck-field',
  'truck-field-un',
  'truck-flatbed',
  'truck-front',
  'truck-ladder',
  'truck-medical',
  'truck-monster',
  'truck-plow',
  'truck-ramp',
  'truck-tow',
  'truck-utensils',
  'utility-can',
  'van',
  'wheelchair',
  'windshield'
];

export const DEFAULT_VEHICLE_ICON = 'car'
export const DEFAULT_VEHICLE_ICON_STYLE = 'duotone'
export const DEFAULT_VEHICLE_ICON_COLOR = '#6b7280'
/** رنگ لایه دوم آیکون Duotone (پیش‌فرض کمی تیره‌تر/شفاف). */
export const DEFAULT_VEHICLE_ICON_COLOR_SECONDARY = '#9ca3af'

/** برای نمایش؛ فقط duotone لود شده، پس استایل‌های قدیمی (solid/regular) به duotone نرمال می‌شوند. */
export function getEffectiveIconStyle(style) {
  return style === 'duotone' ? style : 'duotone'
}

/**
 * استایل CSS برای آیکون Duotone با دو رنگ (primary و secondary).
 * برای اعمال روی المنت آیکون: :style="getVehicleIconDuotoneStyle(primaryColor, secondaryColor)"
 * @param {string} [primaryColor] - رنگ لایه اصلی (--fa-primary-color)
 * @param {string} [secondaryColor] - رنگ لایه دوم (--fa-secondary-color)
 * @returns {Record<string, string>}
 */
export function getVehicleIconDuotoneStyle(primaryColor, secondaryColor) {
  const primary = primaryColor || DEFAULT_VEHICLE_ICON_COLOR
  const secondary = secondaryColor ?? primary
  return {
    '--fa-primary-color': primary,
    '--fa-secondary-color': secondary,
    '--fa-primary-opacity': '1',
    '--fa-secondary-opacity': '0.4'
  }
}
