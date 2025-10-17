// import * as Application from 'expo-application';
// import * as Crypto from 'expo-crypto';
// import { Platform } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// class LicenseManager {
 
//   static SECRET_KEY = 'Roney2025-APP-83693!!!dj$-qmcywalcye';
  
//   static LICENSE_STORAGE_KEY = '@app_license_validated';

//   /**
//    * Obtiene el Device ID único del dispositivo
//    */
//   static async getDeviceId() {
//     try {
//       // Intentar IDs nativos
//       let deviceId = null;
//       if (Platform.OS === 'android') {
//         deviceId = await Application.getAndroidId();
//       } else if (Platform.OS === 'ios') {
//         deviceId = await Application.getIosIdForVendorAsync();
//       }

//       // Fallback: Si no toma el id del dispositivo genera uno aleatorio
//       if (!deviceId) {
//         const FALLBACK_KEY = '@fallback_device_id';
//         const saved = await AsyncStorage.getItem(FALLBACK_KEY);
//         if (saved) return saved;

//         const randomBytes = await Crypto.getRandomBytesAsync(16);
//         const hex = Array.from(randomBytes).map((b) => b.toString(16).padStart(2, '0')).join('');
//         const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, hex);
//         const fallbackId = hash.substring(0, 32);
//         await AsyncStorage.setItem(FALLBACK_KEY, fallbackId);
//         return fallbackId;
//       }

//       return deviceId;
//     } catch (error) {
//       console.error('Error obteniendo Device ID:', error);
//       // Último recurso: un ID fijo efímero en memoria (no persistente)
//       return 'expo-go-fallback-id';
//     }
//   }

//   /**
//    * Genera la clave de licencia válida para un Device ID
//    * Mismo algoritmo que en licence-generator.js
//    */
//   static async generateLicenseKey(deviceId) {
//     const data = `${deviceId}:${this.SECRET_KEY}`;
    
//     const hash = await Crypto.digestStringAsync(
//       Crypto.CryptoDigestAlgorithm.SHA256,
//       data
//     );
    
//     const key = hash.substring(0, 20).toUpperCase();
//     return `${key.slice(0,5)}-${key.slice(5,10)}-${key.slice(10,15)}-${key.slice(15,20)}`;
//   }

//   /**
//    * Valida que la clave ingresada sea correcta para este dispositivo
//    */
//   static async validateLicenseKey(inputKey) {
//     try {
//       const deviceId = await this.getDeviceId();
//       if (!deviceId) return false;

//       // Generar la clave correcta para este dispositivo
//       const correctKey = await this.generateLicenseKey(deviceId);
      
//       const cleanInput = inputKey.replace(/[-\s]/g, '').toUpperCase();
//       const cleanCorrect = correctKey.replace(/[-\s]/g, '').toUpperCase();
      
//       return cleanInput === cleanCorrect;
//     } catch (error) {
//       console.error('Error validando licencia:', error);
//       return false;
//     }
//   }

//   /**
//    * Guarda que la licencia fue validada exitosamente
//    */
//   static async saveLicenseValidation() {
//     try {
//       const deviceId = await this.getDeviceId();
//       await AsyncStorage.setItem(this.LICENSE_STORAGE_KEY, deviceId);
//       return true;
//     } catch (error) {
//       console.error('Error guardando validación:', error);
//       return false;
//     }
//   }

//   /**
//    * Verifica si el dispositivo ya fue activado previamente
//    */
//   static async isLicenseActivated() {
//     try {
//       const deviceId = await this.getDeviceId();
//       const savedDeviceId = await AsyncStorage.getItem(this.LICENSE_STORAGE_KEY);
      
//       return savedDeviceId === deviceId;
//     } catch (error) {
//       console.error('Error verificando activación:', error);
//       return false;
//     }
//   }

//   /**
//    * Información del dispositivo para mostrar al usuario
//    */
//   static async getDeviceInfo() {
//     const deviceId = await this.getDeviceId();
//     let deviceName = null;
//     try {
//       deviceName = await Application.getDeviceNameAsync();
//     } catch (_) {
//       deviceName = 'Unknown Device';
//     }
//     return {
//       deviceId,
//       platform: Platform.OS,
//       model: deviceName,
//     };
//   }

//   /**
//    * Resetear licencia (solo para desarrollo/testing)
//    */
//   static async resetLicense() {
//     try {
//       await AsyncStorage.removeItem(this.LICENSE_STORAGE_KEY);
//       return true;
//     } catch (error) {
//       console.error('Error reseteando licencia:', error);
//       return false;
//     }
//   }
// }

// export default LicenseManager;

import * as Application from 'expo-application';
import * as Crypto from 'expo-crypto';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LicenseManager {
 
  static SECRET_KEY = 'Roney2025-APP-83693!!!dj$-qmcywalcye';
  
  static LICENSE_STORAGE_KEY = '@app_license_validated';
  static LICENSE_ACTIVATION_DATE_KEY = '@app_license_activation_date';
  static USED_LICENSES_KEY = '@app_used_licenses';
  
  static LICENSE_DURATION_DAYS = 30; // Duración de la licencia en días
  static LICENSE_DURATION_MINUTES = 1; // Para pruebas: duración en minutos
  static USE_MINUTES_FOR_TESTING = false; // Cambiar a false para producción

  /**
   * Obtiene el Device ID único del dispositivo
   */
  static async getDeviceId() {
    try {
      // Intentar IDs nativos
      let deviceId = null;
      if (Platform.OS === 'android') {
        deviceId = await Application.getAndroidId();
      } else if (Platform.OS === 'ios') {
        deviceId = await Application.getIosIdForVendorAsync();
      }

      // Fallback: Si no toma el id del dispositivo genera uno aleatorio
      if (!deviceId) {
        const FALLBACK_KEY = '@fallback_device_id';
        const saved = await AsyncStorage.getItem(FALLBACK_KEY);
        if (saved) return saved;

        const randomBytes = await Crypto.getRandomBytesAsync(16);
        const hex = Array.from(randomBytes).map((b) => b.toString(16).padStart(2, '0')).join('');
        const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, hex);
        const fallbackId = hash.substring(0, 32);
        await AsyncStorage.setItem(FALLBACK_KEY, fallbackId);
        return fallbackId;
      }

      return deviceId;
    } catch (error) {
      console.error('Error obteniendo Device ID:', error);
      // Último recurso: un ID fijo efímero en memoria (no persistente)
      return 'expo-go-fallback-id';
    }
  }

  /**
   * Genera la clave de licencia válida para un Device ID con fecha de expiración embebida
   * La clave incluye la fecha de expiración, haciéndola única por período
   */
  static async generateLicenseKey(deviceId, activationDate) {
    // Calcular fecha de expiración
    const expiration = new Date(activationDate);
    
    if (this.USE_MINUTES_FOR_TESTING) {
      expiration.setMinutes(expiration.getMinutes() + this.LICENSE_DURATION_MINUTES);
    } else {
      expiration.setDate(expiration.getDate() + this.LICENSE_DURATION_DAYS);
    }
    
    // Formato: YYYYMMDD o YYYYMMDDHHMM para minutos
    let expirationStr;
    if (this.USE_MINUTES_FOR_TESTING) {
      const year = expiration.getFullYear();
      const month = String(expiration.getMonth() + 1).padStart(2, '0');
      const day = String(expiration.getDate()).padStart(2, '0');
      const hour = String(expiration.getHours()).padStart(2, '0');
      const minute = String(expiration.getMinutes()).padStart(2, '0');
      expirationStr = `${year}${month}${day}${hour}${minute}`;
    } else {
      expirationStr = expiration.toISOString().split('T')[0].replace(/-/g, '');
    }
    
    // Incluir la fecha de expiración en el hash
    const data = `${deviceId}:${expirationStr}:${this.SECRET_KEY}`;
    
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      data
    );
    
    // Generar clave con formato: XXXXX-XXXXX-XXXXX-TIMESTAMP
    const key = hash.substring(0, 15).toUpperCase();
    return `${key.slice(0,5)}-${key.slice(5,10)}-${key.slice(10,15)}-${expirationStr}`;
  }

  /**
   * Extrae la fecha de expiración de una clave de licencia
   */
  static extractExpirationFromKey(licenseKey) {
    try {
      // El formato es XXXXX-XXXXX-XXXXX-TIMESTAMP
      const parts = licenseKey.split('-');
      if (parts.length !== 4) return null;
      
      const dateStr = parts[3];
      
      // Formato con minutos: YYYYMMDDHHMM (12 dígitos)
      if (dateStr.length === 12) {
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        const hour = dateStr.substring(8, 10);
        const minute = dateStr.substring(10, 12);
        return new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
      }
      
      // Formato con días: YYYYMMDD (8 dígitos)
      if (dateStr.length === 8) {
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        return new Date(`${year}-${month}-${day}`);
      }
      
      return null;
    } catch (error) {
      console.error('Error extrayendo fecha:', error);
      return null;
    }
  }

  /**
   * Verifica si una licencia ya fue usada anteriormente
   */
  static async isLicenseUsed(licenseKey) {
    try {
      const usedLicensesStr = await AsyncStorage.getItem(this.USED_LICENSES_KEY);
      if (!usedLicensesStr) return false;
      
      const usedLicenses = JSON.parse(usedLicensesStr);
      const cleanKey = licenseKey.replace(/[-\s]/g, '').toUpperCase();
      
      return usedLicenses.includes(cleanKey);
    } catch (error) {
      console.error('Error verificando licencia usada:', error);
      return false;
    }
  }

  /**
   * Marca una licencia como usada
   */
  static async markLicenseAsUsed(licenseKey) {
    try {
      const usedLicensesStr = await AsyncStorage.getItem(this.USED_LICENSES_KEY);
      let usedLicenses = usedLicensesStr ? JSON.parse(usedLicensesStr) : [];
      
      const cleanKey = licenseKey.replace(/[-\s]/g, '').toUpperCase();
      
      if (!usedLicenses.includes(cleanKey)) {
        usedLicenses.push(cleanKey);
        await AsyncStorage.setItem(this.USED_LICENSES_KEY, JSON.stringify(usedLicenses));
      }
      
      return true;
    } catch (error) {
      console.error('Error marcando licencia como usada:', error);
      return false;
    }
  }

  /**
   * Valida que la clave ingresada sea correcta para este dispositivo
   */
  static async validateLicenseKey(inputKey) {
    try {
      const deviceId = await this.getDeviceId();
      if (!deviceId) return { valid: false, error: 'No se pudo obtener ID del dispositivo' };

      // Verificar si la licencia ya fue usada
      const alreadyUsed = await this.isLicenseUsed(inputKey);
      if (alreadyUsed) {
        return { valid: false, error: 'Esta licencia ya fue utilizada anteriormente' };
      }

      // Extraer fecha de expiración de la clave
      const expirationDate = this.extractExpirationFromKey(inputKey);
      if (!expirationDate) {
        return { valid: false, error: 'Formato de licencia inválido' };
      }

      // NO verificar expiración al validar - solo al momento de usar
      // La clave puede validarse aunque esté "técnicamente" expirada
      // Lo importante es que coincida con el dispositivo

      // Calcular la fecha de activación que fue usada para generar esta clave
      const activationDate = new Date(expirationDate);
      if (this.USE_MINUTES_FOR_TESTING) {
        activationDate.setMinutes(activationDate.getMinutes() - this.LICENSE_DURATION_MINUTES);
      } else {
        activationDate.setDate(activationDate.getDate() - this.LICENSE_DURATION_DAYS);
      }

      // Generar la clave correcta para este dispositivo con esta fecha
      const correctKey = await this.generateLicenseKey(deviceId, activationDate);
      
      const cleanInput = inputKey.replace(/[-\s]/g, '').toUpperCase();
      const cleanCorrect = correctKey.replace(/[-\s]/g, '').toUpperCase();
      
      if (cleanInput === cleanCorrect) {
        // Verificar si ya pasó la fecha de expiración
        const now = new Date();
        if (now > expirationDate) {
          return { valid: false, error: 'Esta licencia ha expirado. Solicita una nueva.' };
        }
        
        return { valid: true, expirationDate, licenseKey: inputKey };
      }
      
      return { valid: false, error: 'Licencia inválida para este dispositivo' };
    } catch (error) {
      console.error('Error validando licencia:', error);
      return { valid: false, error: 'Error al validar la licencia' };
    }
  }

  /**
   * Guarda que la licencia fue validada exitosamente con la fecha de activación
   */
  static async saveLicenseValidation(licenseKey) {
    try {
      const deviceId = await this.getDeviceId();
      
      // Calcular fecha de activación (ahora)
      const activationDate = new Date();
      
      await AsyncStorage.setItem(this.LICENSE_STORAGE_KEY, deviceId);
      await AsyncStorage.setItem(this.LICENSE_ACTIVATION_DATE_KEY, activationDate.toISOString());
      
      // Marcar la licencia como usada
      await this.markLicenseAsUsed(licenseKey);
      
      return true;
    } catch (error) {
      console.error('Error guardando validación:', error);
      return false;
    }
  }

  /**
   * Verifica si el dispositivo ya fue activado previamente y si la licencia sigue vigente
   */
  static async isLicenseActivated() {
    try {
      const deviceId = await this.getDeviceId();
      const savedDeviceId = await AsyncStorage.getItem(this.LICENSE_STORAGE_KEY);
      
      // Verificar que el dispositivo coincida
      if (savedDeviceId !== deviceId) {
        return false;
      }

      // Verificar la fecha de activación
      const activationDateStr = await AsyncStorage.getItem(this.LICENSE_ACTIVATION_DATE_KEY);
      if (!activationDateStr) {
        return false;
      }

      const activationDate = new Date(activationDateStr);
      const now = new Date();
      
      let timePassed, duration;
      if (this.USE_MINUTES_FOR_TESTING) {
        timePassed = (now - activationDate) / (1000 * 60); // minutos
        duration = this.LICENSE_DURATION_MINUTES;
      } else {
        timePassed = (now - activationDate) / (1000 * 60 * 60 * 24); // días
        duration = this.LICENSE_DURATION_DAYS;
      }

      // Si pasó el tiempo de duración, la licencia expiró
      if (timePassed > duration) {
        await this.resetLicense(); // Limpiar licencia expirada
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error verificando activación:', error);
      return false;
    }
  }

  /**
   * Obtiene los días restantes de la licencia
   */
  static async getRemainingDays() {
    try {
      const activationDateStr = await AsyncStorage.getItem(this.LICENSE_ACTIVATION_DATE_KEY);
      if (!activationDateStr) {
        return 0;
      }

      const activationDate = new Date(activationDateStr);
      const now = new Date();
      
      let remaining;
      if (this.USE_MINUTES_FOR_TESTING) {
        const minutesPassed = (now - activationDate) / (1000 * 60);
        remaining = Math.max(0, Math.ceil(this.LICENSE_DURATION_MINUTES - minutesPassed));
      } else {
        const daysPassed = (now - activationDate) / (1000 * 60 * 60 * 24);
        remaining = Math.max(0, Math.ceil(this.LICENSE_DURATION_DAYS - daysPassed));
      }

      return remaining;
    } catch (error) {
      console.error('Error calculando tiempo restante:', error);
      return 0;
    }
  }

  /**
   * Obtiene la fecha de expiración de la licencia
   */
  static async getExpirationDate() {
    try {
      const activationDateStr = await AsyncStorage.getItem(this.LICENSE_ACTIVATION_DATE_KEY);
      if (!activationDateStr) {
        return null;
      }

      const activationDate = new Date(activationDateStr);
      const expirationDate = new Date(activationDate);
      
      if (this.USE_MINUTES_FOR_TESTING) {
        expirationDate.setMinutes(expirationDate.getMinutes() + this.LICENSE_DURATION_MINUTES);
      } else {
        expirationDate.setDate(expirationDate.getDate() + this.LICENSE_DURATION_DAYS);
      }

      return expirationDate;
    } catch (error) {
      console.error('Error obteniendo fecha de expiración:', error);
      return null;
    }
  }

  /**
   * Información del dispositivo para mostrar al usuario
   */
  static async getDeviceInfo() {
    const deviceId = await this.getDeviceId();
    let deviceName = null;
    try {
      deviceName = await Application.getDeviceNameAsync();
    } catch (_) {
      deviceName = 'Unknown Device';
    }
    
    const remainingDays = await this.getRemainingDays();
    const expirationDate = await this.getExpirationDate();
    
    return {
      deviceId,
      platform: Platform.OS,
      model: deviceName,
      remainingDays,
      expirationDate,
    };
  }

  /**
   * Resetear licencia (solo para desarrollo/testing o cuando expira)
   * NO elimina las licencias usadas para evitar reutilización
   */
  static async resetLicense() {
    try {
      await AsyncStorage.removeItem(this.LICENSE_STORAGE_KEY);
      await AsyncStorage.removeItem(this.LICENSE_ACTIVATION_DATE_KEY);
      return true;
    } catch (error) {
      console.error('Error reseteando licencia:', error);
      return false;
    }
  }

  /**
   * Limpiar COMPLETAMENTE (incluye licencias usadas) - Solo para desarrollo
   */
  static async fullReset() {
    try {
      await AsyncStorage.removeItem(this.LICENSE_STORAGE_KEY);
      await AsyncStorage.removeItem(this.LICENSE_ACTIVATION_DATE_KEY);
      await AsyncStorage.removeItem(this.USED_LICENSES_KEY);
      return true;
    } catch (error) {
      console.error('Error en reset completo:', error);
      return false;
    }
  }

  /**
   * Debug: Información detallada para troubleshooting
   */
  static async getDebugInfo() {
    try {
      const deviceId = await this.getDeviceId();
      const activated = await this.isLicenseActivated();
      const activationDateStr = await AsyncStorage.getItem(this.LICENSE_ACTIVATION_DATE_KEY);
      const usedLicensesStr = await AsyncStorage.getItem(this.USED_LICENSES_KEY);
      
      let activationDate = null;
      let expirationDate = null;
      let timeLeft = null;
      
      if (activationDateStr) {
        activationDate = new Date(activationDateStr);
        expirationDate = new Date(activationDate);
        
        if (this.USE_MINUTES_FOR_TESTING) {
          expirationDate.setMinutes(expirationDate.getMinutes() + this.LICENSE_DURATION_MINUTES);
          const now = new Date();
          const diff = expirationDate - now;
          timeLeft = Math.floor(diff / 1000); // segundos
        } else {
          expirationDate.setDate(expirationDate.getDate() + this.LICENSE_DURATION_DAYS);
          const now = new Date();
          const diff = expirationDate - now;
          timeLeft = Math.floor(diff / (1000 * 60 * 60 * 24)); // días
        }
      }
      
      return {
        deviceId,
        mode: this.USE_MINUTES_FOR_TESTING ? 'TESTING (1 min)' : 'PRODUCTION (30 days)',
        activated,
        activationDate: activationDate ? activationDate.toISOString() : null,
        expirationDate: expirationDate ? expirationDate.toISOString() : null,
        timeLeft: timeLeft !== null ? `${timeLeft} ${this.USE_MINUTES_FOR_TESTING ? 'segundos' : 'días'}` : null,
        usedLicensesCount: usedLicensesStr ? JSON.parse(usedLicensesStr).length : 0
      };
    } catch (error) {
      console.error('Error obteniendo debug info:', error);
      return { error: error.message };
    }
  }
}

export default LicenseManager;