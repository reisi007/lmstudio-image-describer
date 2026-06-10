
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    de: { 
      translation: { 
        title: 'Bildbeschreiber', 
        upload: 'Bild hochladen', 
        shortMode: 'Kurzfassung', 
        longMode: 'Langfassung', 
        describe: 'Beschreiben',
        connected: 'LM Studio Verbunden',
        disconnected: 'LM Studio Getrennt',
        compressing: 'Komprimiere {{filename}}...',
        analyzing: 'Analysiere {{filename}}...',
        jsonOutput: 'JSON Ausgabe',
        previewAlt: 'Hochgeladene Vorschau'
      } 
    },
    en: { 
      translation: { 
        title: 'Image Describer', 
        upload: 'Upload Image', 
        shortMode: 'Short Version', 
        longMode: 'Long Version', 
        describe: 'Describe',
        connected: 'LM Studio Connected',
        disconnected: 'LM Studio Disconnected',
        compressing: 'Compressing {{filename}}...',
        analyzing: 'Analyzing {{filename}}...',
        jsonOutput: 'JSON Output',
        previewAlt: 'Uploaded preview'
      } 
    },
    hu: { 
      translation: { 
        title: 'Képleíró', 
        upload: 'Kép feltöltése', 
        shortMode: 'Rövid verzió', 
        longMode: 'Hosszú verzió', 
        describe: 'Leírás',
        connected: 'LM Studio Csatlakoztatva',
        disconnected: 'LM Studio Leválasztva',
        compressing: 'Tömörítés: {{filename}}...',
        analyzing: 'Elemzés: {{filename}}...',
        jsonOutput: 'JSON Kimenet',
        previewAlt: 'Feltöltött előnézet'
      } 
    }
  },
  lng: 'de',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

export default i18n;
