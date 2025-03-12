import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend) // Permite cargar archivos JSON de traducciones
  .use(initReactI18next)
  .init({
    lng: localStorage.getItem("language") || "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json" // Ruta a los archivos de traducción
    },
    ns: ["login","footer","welcome","header"], // Lista de namespaces
  });

export default i18n;