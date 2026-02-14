/**
 * Unit tests for PersianDatePicker (انتخابگر تاریخ شمسی)
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PersianDatePicker from './PersianDatePicker.vue'

const StubDatePicker = {
  name: 'DatePicker',
  template: '<div class="stub-datepicker"><input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" data-testid="picker-input" /></div>',
  props: ['modelValue', 'placeholder', 'format', 'inline', 'name'],
  emits: ['update:modelValue']
}

describe('PersianDatePicker', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('renders wrapper with label when label prop is provided', () => {
    const wrapper = mount(PersianDatePicker, {
      props: { modelValue: '', label: 'تاریخ انجام' },
      global: {
        stubs: {
          DatePicker: StubDatePicker
        }
      }
    })
    expect(wrapper.text()).toContain('تاریخ انجام')
  })

  it('shows error message when error prop is set', () => {
    const wrapper = mount(PersianDatePicker, {
      props: { modelValue: '', error: 'تاریخ الزامی است' },
      global: {
        stubs: {
          DatePicker: StubDatePicker
        }
      }
    })
    expect(wrapper.text()).toContain('تاریخ الزامی است')
    expect(wrapper.find('.persian-datepicker-error').exists()).toBe(true)
  })

  it('has required mark when required prop is true', () => {
    const wrapper = mount(PersianDatePicker, {
      props: { modelValue: '', label: 'تاریخ', required: true },
      global: {
        stubs: {
          DatePicker: StubDatePicker
        }
      }
    })
    expect(wrapper.find('.required-mark').exists()).toBe(true)
  })

  it('emits update:modelValue when inner picker emits', async () => {
    const wrapper = mount(PersianDatePicker, {
      props: { modelValue: '' },
      global: {
        stubs: {
          DatePicker: StubDatePicker
        }
      }
    })
    const input = wrapper.find('[data-testid="picker-input"]')
    await input.setValue('1403/07/15')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['1403/07/15'])
  })

  it('passes modelValue to inner date picker', () => {
    const wrapper = mount(PersianDatePicker, {
      props: { modelValue: '1403/06/16' },
      global: {
        stubs: {
          DatePicker: StubDatePicker
        }
      }
    })
    const picker = wrapper.findComponent(StubDatePicker)
    expect(picker.props('modelValue')).toBe('1403/06/16')
  })

  it('applies has-error class when error is set', () => {
    const wrapper = mount(PersianDatePicker, {
      props: { modelValue: '', error: 'خطا' },
      global: {
        stubs: {
          DatePicker: StubDatePicker
        }
      }
    })
    expect(wrapper.find('.persian-datepicker-wrapper').classes()).toContain('has-error')
  })
})
