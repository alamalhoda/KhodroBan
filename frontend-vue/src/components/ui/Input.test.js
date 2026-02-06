/**
 * Unit tests for Input.vue
 */
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import Input from './Input.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: { common: { close: 'Close' } }
  }
})

describe('Input', () => {
  it('renders with default props', () => {
    const wrapper = mount(Input, {
      global: { plugins: [i18n] }
    })
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('input').attributes('type')).toBe('text')
  })

  it('renders label when provided', () => {
    const wrapper = mount(Input, {
      props: { label: 'Email' },
      global: { plugins: [i18n] }
    })
    expect(wrapper.text()).toContain('Email')
  })

  it('renders placeholder', () => {
    const wrapper = mount(Input, {
      props: { placeholder: 'Enter value' },
      global: { plugins: [i18n] }
    })
    expect(wrapper.find('input').attributes('placeholder')).toBe('Enter value')
  })

  it('shows error message when error prop is set', () => {
    const wrapper = mount(Input, {
      props: { error: 'Invalid value' },
      global: { plugins: [i18n] }
    })
    expect(wrapper.text()).toContain('Invalid value')
  })

  it('shows hint when hint prop is set', () => {
    const wrapper = mount(Input, {
      props: { hint: 'Help text' },
      global: { plugins: [i18n] }
    })
    expect(wrapper.text()).toContain('Help text')
  })

  it('has aria-invalid when error is set', () => {
    const wrapper = mount(Input, {
      props: { error: 'Error' },
      global: { plugins: [i18n] }
    })
    expect(wrapper.find('input').attributes('aria-invalid')).toBe('true')
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(Input, {
      props: { modelValue: '' },
      global: { plugins: [i18n] }
    })
    await wrapper.find('input').setValue('test')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['test'])
  })

  it('is disabled when disabled prop is true', () => {
    const wrapper = mount(Input, {
      props: { disabled: true },
      global: { plugins: [i18n] }
    })
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })
})
