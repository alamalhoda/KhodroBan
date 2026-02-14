/**
 * Unit tests for Card.vue
 */
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Card from './Card.vue'

describe('Card', () => {
  it('renders as article', () => {
    const wrapper = mount(Card)
    expect(wrapper.find('article').exists()).toBe(true)
  })

  it('renders title when provided', () => {
    const wrapper = mount(Card, { props: { title: 'Card Title' } })
    expect(wrapper.find('.card-title').text()).toBe('Card Title')
  })

  it('renders subtitle when provided', () => {
    const wrapper = mount(Card, { props: { subtitle: 'Subtitle text' } })
    expect(wrapper.find('.card-subtitle').text()).toBe('Subtitle text')
  })

  it('renders default slot content', () => {
    const wrapper = mount(Card, {
      slots: { default: 'Card body content' }
    })
    expect(wrapper.find('.card-body').text()).toContain('Card body content')
  })

  it('renders footer slot when provided', () => {
    const wrapper = mount(Card, {
      slots: { footer: 'Footer content' }
    })
    expect(wrapper.find('.card-footer').text()).toContain('Footer content')
  })

  it('applies variant class', () => {
    const wrapper = mount(Card, { props: { variant: 'outline' } })
    expect(wrapper.find('article').classes()).toContain('card-outline')
  })

  it('has role button and tabindex when clickable', () => {
    const wrapper = mount(Card, { props: { clickable: true } })
    const article = wrapper.find('article')
    expect(article.attributes('role')).toBe('button')
    expect(article.attributes('tabindex')).toBe('0')
  })

  it('emits click when clickable and clicked', async () => {
    const wrapper = mount(Card, { props: { clickable: true } })
    await wrapper.find('article').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('does not emit click when not clickable', async () => {
    const wrapper = mount(Card, { props: { clickable: false } })
    await wrapper.find('article').trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })
})
