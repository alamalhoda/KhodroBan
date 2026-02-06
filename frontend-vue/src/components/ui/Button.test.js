/**
 * Unit tests for Button.vue
 */
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from './Button.vue'

describe('Button', () => {
  it('renders with default props', () => {
    const wrapper = mount(Button)
    const btn = wrapper.find('button')
    expect(btn.exists()).toBe(true)
    expect(btn.attributes('type')).toBe('button')
    expect(btn.classes()).toContain('btn-primary')
    expect(btn.classes()).toContain('btn-md')
  })

  it('renders slot content', () => {
    const wrapper = mount(Button, {
      slots: { default: 'Click me' }
    })
    expect(wrapper.text()).toContain('Click me')
  })

  it('applies variant prop', () => {
    const wrapper = mount(Button, { props: { variant: 'secondary' } })
    expect(wrapper.find('button').classes()).toContain('btn-secondary')
  })

  it('applies size prop', () => {
    const wrapper = mount(Button, { props: { size: 'lg' } })
    expect(wrapper.find('button').classes()).toContain('btn-lg')
  })

  it('is disabled when disabled prop is true', () => {
    const wrapper = mount(Button, { props: { disabled: true } })
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('is disabled when loading prop is true', () => {
    const wrapper = mount(Button, { props: { loading: true } })
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('shows loading state', () => {
    const wrapper = mount(Button, { props: { loading: true } })
    expect(wrapper.find('.btn-spinner').exists()).toBe(true)
  })

  it('emits click when clicked and not disabled', async () => {
    const wrapper = mount(Button)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('does not emit click when disabled', async () => {
    const wrapper = mount(Button, { props: { disabled: true } })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('does not emit click when loading', async () => {
    const wrapper = mount(Button, { props: { loading: true } })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('has aria-busy when loading', () => {
    const wrapper = mount(Button, { props: { loading: true } })
    expect(wrapper.find('button').attributes('aria-busy')).toBe('true')
  })

  it('uses ariaLabel when provided', () => {
    const wrapper = mount(Button, { props: { ariaLabel: 'Submit form' } })
    expect(wrapper.find('button').attributes('aria-label')).toBe('Submit form')
  })

  it('renders icon when icon prop is set', () => {
    const wrapper = mount(Button, { props: { icon: 'add' } })
    expect(wrapper.find('.btn-icon').exists()).toBe(true)
    expect(wrapper.html()).toContain('add')
  })
})
