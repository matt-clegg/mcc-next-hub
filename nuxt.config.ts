// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: [
    "@nuxt/ui-pro",
    "@nuxthub/core",
    "@nuxt/eslint",
    "nuxt-auth-utils",
    "@nuxt/fonts",
    "@nuxt/image",
    "nuxt-tiptap-editor"
  ],

  devtools: { enabled: true },

  css: [
    "~/assets/css/main.css"
  ],

  runtimeConfig: {
    public: {
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL || "http://localhost:3000"
    }
  },

  future: { compatibilityVersion: 4 },

  experimental: {
    componentIslands: true
  },
  compatibilityDate: "2024-07-30",

  hub: {
    database: true
  },

  eslint: {
    config: {
      stylistic: {
        semi: true,
        quotes: "double",
        commaDangle: "never"
      }
    }
  },

  tiptap: {
    prefix: "Tiptap"
  }
});
