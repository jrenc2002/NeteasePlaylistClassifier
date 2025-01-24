// src/i18n.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import translationEN from '@/i18n/locals/en/index.json'
import translationZH from '@/i18n/locals/zh/index.json'
import translationZH_HK from '@/i18n/locals/zh-HK/index.json'

// the translations
const resources = {
  'en': {
    translation: translationEN
  },
  'zh': {
    translation: translationZH
  },
  'zh-HK': {
    translation: translationZH_HK
  }
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'zh', // default language
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  })

export default i18n
