<script lang="ts">
  import { locale } from 'svelte-i18n';
  import { setLocale } from '$lib/i18n';
  import { Button } from '$lib/components/ui';
  import { _ } from 'svelte-i18n';

  // تعریف زبان‌ها به صورت reactive
  const languages = $derived([
    { code: 'fa', name: $_('language.persian'), flag: '🇮🇷' },
    { code: 'en', name: $_('language.english'), flag: '🇺🇸' },
    { code: 'ar', name: $_('language.arabic'), flag: '🇸🇦' }
  ]);

  function changeLanguage(langCode: string) {
    setLocale(langCode);
  }
</script>

<div class="language-switcher">
  <div class="language-label">{$_('language.selectLanguage')}</div>
  <div class="language-buttons">
    {#each languages as lang}
      <Button
        variant={$locale === lang.code ? 'primary' : 'default'}
        size="sm"
        onclick={() => changeLanguage(lang.code)}
        class="language-button"
      >
        <span class="flag">{lang.flag}</span>
        <span class="name">{lang.name}</span>
      </Button>
    {/each}
  </div>
</div>

<style>
  .language-switcher {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    align-items: flex-start;
  }

  .language-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-secondary, #6b7280);
  }

  .language-buttons {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    flex-wrap: wrap;
  }

  .language-button {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    min-width: auto;
    padding: 0.5rem 0.75rem;
    font-size: 0.8125rem;
  }

  .flag {
    font-size: 1em;
    line-height: 1;
  }

  .name {
    font-weight: 500;
  }

  /* RTL support */
  [dir="rtl"] .language-switcher {
    align-items: flex-end;
  }

  [dir="rtl"] .language-buttons {
    flex-direction: row-reverse;
  }

  /* Responsive */
  @media (max-width: 640px) {
    .language-buttons {
      flex-direction: column;
      align-items: stretch;
      gap: 0.375rem;
    }

    .language-button {
      justify-content: center;
      padding: 0.625rem 1rem;
    }
  }
</style>
