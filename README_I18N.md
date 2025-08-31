# Sistema de Internacionalización (i18n) - ArquiSoft

## Descripción

Este proyecto implementa un sistema completo de internacionalización que permite a los usuarios cambiar entre tres idiomas:

- 🇪🇸 **Español** (idioma por defecto)
- 🏔️ **Quechua** (Runa Simi)
- 🏔️ **Aymara** (Aymar Aru)

## Características

✅ **Soporte completo para 3 idiomas indígenas**
✅ **Interfaz de usuario intuitiva para cambio de idioma**
✅ **Persistencia del idioma seleccionado**
✅ **Traducciones automáticas en toda la aplicación**
✅ **Componentes reutilizables**
✅ **Soporte para TypeScript**

## Estructura de Archivos

```
locales/
├── es.json          # Traducciones en Español
├── qu.json          # Traducciones en Quechua
└── ay.json          # Traducciones en Aymara

lib/
└── i18n.ts          # Configuración principal de i18n

components/
├── LanguageSelector.tsx    # Modal selector de idioma
└── LanguageButton.tsx      # Botón compacto de cambio de idioma

types/
└── i18n.d.ts        # Declaraciones de tipos para TypeScript
```

## Instalación

Las dependencias ya están instaladas:

```bash
npm install react-i18next i18next i18next-http-backend i18next-browser-languagedetector
```

## Uso Básico

### 1. Importar y usar traducciones

```tsx
import { useTranslation } from 'react-i18next';

export default function MiComponente() {
  const { t } = useTranslation();
  
  return (
    <Text>{t('common.welcome')}</Text>
  );
}
```

### 2. Cambiar idioma programáticamente

```tsx
import { changeLanguage } from '@/lib/i18n';

// Cambiar a Quechua
await changeLanguage('qu');

// Cambiar a Aymara
await changeLanguage('ay');

// Cambiar a Español
await changeLanguage('es');
```

### 3. Obtener idioma actual

```tsx
import { getCurrentLanguage } from '@/lib/i18n';

const currentLang = getCurrentLanguage(); // 'es', 'qu', o 'ay'
```

## Componentes Disponibles

### LanguageButton

Botón compacto para cambiar idioma:

```tsx
import LanguageButton from '@/components/LanguageButton';

// Botón compacto (solo bandera)
<LanguageButton compact={true} />

// Botón completo (bandera + texto)
<LanguageButton />
```

### LanguageSelector

Modal completo para seleccionar idioma:

```tsx
import LanguageSelector from '@/components/LanguageSelector';

<LanguageSelector
  visible={showSelector}
  onClose={() => setShowSelector(false)}
/>
```

## Estructura de Traducciones

Las traducciones están organizadas por categorías:

```json
{
  "common": {
    "welcome": "Bienvenido",
    "login": "Iniciar Sesión",
    "save": "Guardar"
  },
  "auth": {
    "email": "Correo Electrónico",
    "password": "Contraseña"
  },
  "userTypes": {
    "driver": "Conductor",
    "passenger": "Pasajero"
  }
}
```

## Agregar Nuevas Traducciones

### 1. Agregar texto en español (es.json)

```json
{
  "common": {
    "newText": "Nuevo texto en español"
  }
}
```

### 2. Agregar traducción en Quechua (qu.json)

```json
{
  "common": {
    "newText": "Musuq qillqa quechua simipi"
  }
}
```

### 3. Agregar traducción en Aymara (ay.json)

```json
{
  "common": {
    "newText": "Musuq qillqa aymar arupi"
  }
}
```

### 4. Usar en el código

```tsx
const { t } = useTranslation();
<Text>{t('common.newText')}</Text>
```

## Agregar Nuevos Idiomas

Para agregar un nuevo idioma (ej: Guaraní):

### 1. Crear archivo de traducción

```json
// locales/gn.json
{
  "common": {
    "welcome": "Mba'éichapa",
    "login": "Jeike"
  }
}
```

### 2. Modificar lib/i18n.ts

```tsx
import gn from '../locales/gn.json';

const resources = {
  es: { translation: es },
  qu: { translation: qu },
  ay: { translation: ay },
  gn: { translation: gn }, // Nuevo idioma
};
```

### 3. Actualizar funciones helper

```tsx
export const getLanguageName = (code: string) => {
  const languageNames: { [key: string]: string } = {
    es: 'Español',
    qu: 'Runa Simi (Quechua)',
    ay: 'Aymar Aru (Aymara)',
    gn: 'Avañe\'ẽ (Guaraní)', // Nuevo idioma
  };
  return languageNames[code] || code;
};
```

## Mejores Prácticas

1. **Usar claves descriptivas**: `userTypes.driver` en lugar de `driver`
2. **Organizar por categorías**: Agrupar traducciones relacionadas
3. **Mantener consistencia**: Usar la misma estructura en todos los idiomas
4. **Validar traducciones**: Verificar que todas las claves existan en todos los idiomas
5. **Usar pluralización**: Para textos que cambien según cantidad

## Solución de Problemas

### Error: "Module not found"

Verificar que las rutas de importación sean correctas:

```tsx
// ✅ Correcto
import '../lib/i18n';

// ❌ Incorrecto
import '@/lib/i18n';
```

### Traducciones no se cargan

Verificar que el archivo i18n.ts se importe en el layout principal:

```tsx
// app/_layout.tsx
import '../lib/i18n';
```

### TypeScript no reconoce traducciones

Verificar que el archivo `types/i18n.d.ts` esté configurado correctamente y que `tsconfig.json` incluya:

```json
{
  "compilerOptions": {
    "resolveJsonModule": true,
    "esModuleInterop": true
  }
}
```

## Contribución

Para contribuir con traducciones:

1. Revisar la precisión de las traducciones en Quechua y Aymara
2. Agregar nuevas traducciones siguiendo la estructura existente
3. Mantener consistencia en el uso de términos técnicos
4. Considerar las variaciones dialectales de cada idioma

## Recursos Adicionales

- [Documentación de react-i18next](https://react.i18next.com/)
- [Documentación de i18next](https://www.i18next.com/)
- [Quechua Online](https://quechuaonline.com/)
- [Aymara Uta](https://aymara.uta.cl/)

## Licencia

Este sistema de internacionalización es parte del proyecto ArquiSoft y está disponible bajo la misma licencia del proyecto principal. 