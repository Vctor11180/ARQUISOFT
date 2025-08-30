# Instrucciones para probar el mapa

## ✅ Estado actual: 
- Java 17 instalado ✓
- Aplicación compilada e instalada ✓  
- Metro bundler iniciado ✓

## 🗺️ Probar el mapa:

### Opción 1: Pantalla de prueba directa
1. Abre el emulador donde se ejecuta ArquiSoft
2. En la consola del Metro bundler, presiona `j` para abrir el debugger
3. En la consola JavaScript del navegador, ejecuta:
   ```javascript
   import { router } from 'expo-router';
   router.push('/(tabs)/maptest');
   ```
4. Deberías ver una pantalla con "Test Mapa Básico" y un mapa con marcador en Santa Cruz

### Opción 2: Flujo completo de pago
1. En la app, navega a "Pasajeros" 
2. Toca el botón "Pagar por NFC"
3. Presiona "Iniciar" 
4. Espera el flujo: Escaneando → Procesando → Éxito
5. En el estado de éxito debería aparecer el mapa a pantalla completa con:
   - Ruta marcada en verde
   - Marcador de inicio
   - Marcador de destino
   - Animación de micro que se convierte en check

### 🔧 Si el mapa aparece en blanco:

1. **API Key pendiente**: En `app.json`, reemplaza:
   ```json
   "apiKey": "AIzaSyB0wI5s-PLACEHOLDER-REPLACE-ME"
   ```
   Por tu API key real de Google Maps.

2. **Rebuilds necesarios**: Después de cambiar la API key:
   ```powershell
   cd android
   .\gradlew.bat clean
   .\gradlew.bat app:assembleDebug
   .\gradlew.bat app:installDebug
   ```

3. **Emulador sin Google Play**: Asegúrate de usar un AVD con "Google APIs" o "Google Play Store".

## 📱 Navegación en la app:
- **Landing**: Selecciona rol "Pasajero" 
- **Pasajero**: Scroll hacia abajo → botón "Pagar por NFC"
- **Pago NFC**: Iniciar → Escaneando → Procesando → Mapa completo

¡Ahora deberías poder ver el mapa funcionando!
