# Accessibility Utilities

مجموعه composableها و utility functions برای پشتیبانی از WCAG 2.1 AA compliance.

## 📚 فهرست

1. [useKeyboardNavigation](#usekeyboardnavigation)
2. [useFocusTrap](#usefocustrap)
3. [useFocus](#usefocus)
4. [useSkipLink](#useskiplink)
5. [useAria](#usearia)
6. [useReducedMotion](#usereducedmotion)
7. [useColorContrast](#usecolorcontrast)

---

## useKeyboardNavigation

مدیریت keyboard navigation و event handling.

### مثال استفاده:

```vue
<script setup>
import { useKeyboardNavigation } from '@/composables'

const { onKeyPress, handleArrowKeys } = useKeyboardNavigation()

// Listen for Escape key
onKeyPress('Escape', () => {
  closeModal()
}, { preventDefault: true })

// Handle arrow keys in a list
handleArrowKeys({
  onUp: () => moveUp(),
  onDown: () => moveDown(),
  preventDefault: true
})
</script>
```

### API:

- `onKeyPress(keys, callback, options)` - Register keyboard event handler
- `onKeyDown(keys, callback, options)` - Register keydown handler
- `onKeyUp(keys, callback, options)` - Register keyup handler
- `handleArrowKeys(options)` - Handle arrow key navigation
- `cleanup()` - Cleanup all handlers

---

## useFocusTrap

Trap کردن focus در یک container (مثل modal یا dropdown).

### مثال استفاده:

```vue
<script setup>
import { ref } from 'vue'
import { useFocusTrap } from '@/composables'

const { trapRef, activate, deactivate } = useFocusTrap()

const showModal = ref(false)

watch(showModal, (isOpen) => {
  if (isOpen) {
    activate()
  } else {
    deactivate()
  }
})
</script>

<template>
  <div v-if="showModal" ref="trapRef" class="modal">
    <!-- Modal content -->
  </div>
</template>
```

### API:

- `trapRef` - Ref برای container element
- `isActive` - State of focus trap
- `activate()` - Activate focus trap
- `deactivate()` - Deactivate focus trap

---

## useFocus

مدیریت programmatic focus.

### مثال استفاده:

```vue
<script setup>
import { ref } from 'vue'
import { useFocus } from '@/composables'

const { focus, focusFirst, focusLast } = useFocus()
const inputRef = ref(null)

// Focus an element
focus(inputRef)

// Focus first element in container
focusFirst('.form-container')

// Focus last element in container
focusLast('.form-container')
</script>
```

### API:

- `focus(element, options)` - Focus an element
- `blur()` - Blur currently focused element
- `focusFirst(container)` - Focus first focusable element
- `focusLast(container)` - Focus last focusable element
- `isFocusable(element)` - Check if element is focusable
- `getFocused()` - Get currently focused element

---

## useSkipLink

ایجاد skip links برای keyboard navigation.

### مثال استفاده:

```vue
<script setup>
import { onMounted } from 'vue'
import { useSkipLink } from '@/composables'

const { addSkipLink, addDefaultSkipLinks } = useSkipLink()

onMounted(() => {
  // Add default skip links (main content, navigation)
  addDefaultSkipLinks()

  // Or add custom skip link
  addSkipLink('main-content', 'Skip to main content', {
    position: 'top-left'
  })
})
</script>
```

### API:

- `addSkipLink(targetId, label, options)` - Add a skip link
- `removeSkipLink(targetId)` - Remove a skip link
- `addDefaultSkipLinks()` - Add default skip links
- `removeAllSkipLinks()` - Remove all skip links

---

## useAria

مدیریت ARIA attributes.

### مثال استفاده:

```vue
<script setup>
import { ref } from 'vue'
import { useAria } from '@/composables'

const { setAriaLabel, setAriaExpanded, createAriaAttrs } = useAria()
const isOpen = ref(false)
const buttonRef = ref(null)

watch(isOpen, (open) => {
  setAriaExpanded(buttonRef, open)
})

// Or use computed attributes
const ariaAttrs = createAriaAttrs({
  label: 'Close dialog',
  expanded: isOpen.value,
  role: 'button'
})
</script>

<template>
  <button ref="buttonRef" v-bind="ariaAttrs">
    Toggle
  </button>
</template>
```

### API:

- `setAriaLabel(element, label)` - Set aria-label
- `setAriaExpanded(element, expanded)` - Set aria-expanded
- `setAriaHidden(element, hidden)` - Set aria-hidden
- `setAriaLive(element, politeness)` - Set aria-live
- `setAriaBusy(element, busy)` - Set aria-busy
- `setAriaInvalid(element, invalid)` - Set aria-invalid
- `setAriaRequired(element, required)` - Set aria-required
- `setRole(element, role)` - Set role attribute
- `createAriaAttrs(props)` - Create computed ARIA attributes object

---

## useReducedMotion

پشتیبانی از `prefers-reduced-motion`.

### مثال استفاده:

```vue
<script setup>
import { useReducedMotion } from '@/composables'

const { prefersReducedMotion, shouldReduceMotion } = useReducedMotion()
</script>

<template>
  <div :class="{ 'no-animation': shouldReduceMotion }">
    <!-- Content with conditional animations -->
  </div>
</template>

<style>
.no-animation * {
  animation: none !important;
  transition: none !important;
}
</style>
```

### API:

- `prefersReducedMotion` - Ref indicating reduced motion preference
- `shouldReduceMotion` - Computed property for easier access
- `checkReducedMotion()` - Check current preference
- `init()` - Initialize detection
- `cleanup()` - Cleanup listeners

---

## useColorContrast

بررسی color contrast برای WCAG compliance.

### مثال استفاده:

```vue
<script setup>
import { useColorContrast } from '@/composables'

const { getContrastRatio, isAACompliant, getContrastLevel } = useColorContrast()

// Check contrast ratio
const ratio = getContrastRatio('#000000', '#ffffff') // 21:1

// Check WCAG AA compliance
const isCompliant = isAACompliant('#000000', '#ffffff', 'normal') // true

// Get contrast level
const level = getContrastLevel(ratio) // 'AAA (Enhanced)'
</script>
```

### API:

- `getContrastRatio(color1, color2)` - Get contrast ratio (1-21)
- `isAACompliant(foreground, background, textSize)` - Check AA compliance
- `isAAACompliant(foreground, background, textSize)` - Check AAA compliance
- `getContrastLevel(ratio)` - Get level description
- `findCompliantColor(foreground, background, textSize)` - Find compliant color
- `hexToRgb(hex)` - Convert hex to RGB
- `getLuminance(r, g, b)` - Get relative luminance

---

## 🎯 Best Practices

1. **همیشه از Semantic HTML استفاده کنید** - قبل از استفاده از ARIA
2. **Keyboard Navigation** - همه interactive elements باید keyboard-accessible باشند
3. **Focus Management** - Focus trap را در modalها استفاده کنید
4. **Skip Links** - برای صفحات طولانی skip links اضافه کنید
5. **Reduced Motion** - به ترجیحات کاربر احترام بگذارید
6. **Color Contrast** - حداقل 4.5:1 برای normal text و 3:1 برای large text

---

## 📖 منابع

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

