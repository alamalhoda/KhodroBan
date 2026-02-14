/**
 * Unit tests for ReminderForm
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { ref } from 'vue'
import ReminderForm from './ReminderForm.vue'

vi.mock('vue-i18n', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useI18n: () => ({ t: (key) => key, locale: ref('fa') })
  }
})

const vehicles = ref([{ id: 'v1', model: 'پژو', year: 1400, currentKm: 50000 }])
vi.mock('../stores/vehicle', () => ({
  useVehicleStore: () => ({
    get vehicles () { return vehicles.value },
    fetchVehicles: vi.fn()
  })
}))

describe('ReminderForm', () => {
  const defaultGlobal = {
    stubs: {
      Input: { template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />', props: ['modelValue', 'type', 'placeholder', 'disabled', 'min'] },
      Select: { template: '<select :value="modelValue" @change="$emit(\'update:modelValue\', $event.target.value)"><option value=""></option><option value="10">10</option><option value="custom">custom</option></select>', props: ['modelValue', 'options'] },
      Button: { template: '<button @click="$emit(\'click\')"><slot /></button>' },
      PersianDatePicker: {
        template: '<div data-testid="persian-date-picker"><input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" data-testid="due-date-input" /></div>',
        props: ['modelValue', 'placeholder'],
        emits: ['update:modelValue']
      }
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
  })

  it('renders title and vehicle fields', () => {
    const wrapper = mount(ReminderForm, { global: defaultGlobal })
    expect(wrapper.text()).toContain('reminders.form.title')
    expect(wrapper.text()).toContain('vehicles.selectVehicle')
  })

  it('emits cancel when cancel button clicked', async () => {
    const wrapper = mount(ReminderForm, { global: defaultGlobal })
    const cancelBtns = wrapper.findAll('button').filter(b => b.text().includes('common.cancel'))
    await cancelBtns[0].trigger('click')
    expect(wrapper.emitted('cancel').length).toBeGreaterThanOrEqual(1)
  })

  it('emits submit with payload including title and dueDate when preset is not custom', async () => {
    const wrapper = mount(ReminderForm, { global: defaultGlobal })
    const inputs = wrapper.findAll('input')
    const titleInput = inputs[0]
    if (titleInput) await titleInput.setValue('تعویض روغن')
    const submitBtn = wrapper.findAll('button').find(b => b.text().includes('common.save'))
    if (submitBtn) await submitBtn.trigger('click')
    expect(wrapper.emitted('submit')).toBeTruthy()
    const payload = wrapper.emitted('submit')[0][0]
    expect(payload.title).toBe('تعویض روغن')
    expect(payload.dueDate).toBeDefined()
  })

  it('shows PersianDatePicker when locale is fa and preset is custom', async () => {
    const wrapper = mount(ReminderForm, { global: defaultGlobal })
    const presetSelect = wrapper.findAll('select').find(s => s.element.innerHTML.includes('custom'))
    if (presetSelect) {
      await presetSelect.setValue('custom')
    }
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-testid="persian-date-picker"]').exists()).toBe(true)
  })
})
