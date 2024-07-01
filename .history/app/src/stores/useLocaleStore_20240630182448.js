import { defineStore } from 'pinia';

export const useLocaleStore = defineStore('localeStore', {
  state: () => ({
    $i18n.locale: 'VI',
  }),
  actions: {
    setLocale(newLocale) {
      this.locale = newLocale;
    }
  }
});
