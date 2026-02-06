/**
 * Unit tests for Modal.vue
 */
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import Modal from './Modal.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: { common: { close: 'Close' } }
  }
})

describe('Modal', () => {
  it('does not render when open is false', () => {
    const wrapper = mount(Modal, {
      props: { open: false },
      global: { plugins: [i18n] },
      attachTo: document.body
    })
    expect(wrapper.find('.modal-overlay').exists()).toBe(false)
    wrapper.unmount()
  })

  it('renders when open is true', () => {
    const wrapper = mount(Modal, {
      props: { open: true },
      global: { plugins: [i18n] },
      attachTo: document.body
    })
    const overlay = document.body.querySelector('.modal-overlay')
    const modal = document.body.querySelector('.modal')
    expect(!!overlay).toBe(true)
    expect(!!modal).toBe(true)
    wrapper.unmount()
  })

  it('renders title when provided', () => {
    const wrapper = mount(Modal, {
      props: { open: true, title: 'Modal Title' },
      global: { plugins: [i18n] },
      attachTo: document.body
    })
    const titleEl = document.body.querySelector('.modal-title')
    expect(titleEl).toBeTruthy()
    expect(titleEl?.textContent).toBe('Modal Title')
    wrapper.unmount()
  })

  it('has role dialog and aria-modal', () => {
    const wrapper = mount(Modal, {
      props: { open: true },
      global: { plugins: [i18n] },
      attachTo: document.body
    })
    const overlay = document.body.querySelector('.modal-overlay')
    expect(overlay?.getAttribute('role')).toBe('dialog')
    expect(overlay?.getAttribute('aria-modal')).toBe('true')
    wrapper.unmount()
  })

  it('emits update:open and close when close button clicked', async () => {
    const wrapper = mount(Modal, {
      props: { open: true, showClose: true },
      global: { plugins: [i18n] },
      attachTo: document.body
    })
    const closeBtn = document.body.querySelector('.modal-close')
    expect(closeBtn).toBeTruthy()
    await closeBtn?.dispatchEvent(new Event('click'))
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:open')).toBeTruthy()
    expect(wrapper.emitted('update:open')[0]).toEqual([false])
    expect(wrapper.emitted('close')).toHaveLength(1)
    wrapper.unmount()
  })
})
