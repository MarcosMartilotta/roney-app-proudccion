// ============================================
// numberUtils.js - Utilidades para formateo de números
// ============================================

/**
 * Normaliza un string con coma o punto a número
 * Acepta: "10,5" o "10.5" y devuelve 10.5
 */
export const parseDecimalInput = (value) => {
    if (!value) return 0;
    
    // Convertir a string y eliminar espacios
    const cleanValue = String(value).trim();
    
    // Reemplazar coma por punto para parseFloat
    const normalized = cleanValue.replace(',', '.');
    
    const parsed = parseFloat(normalized);
    return isNaN(parsed) ? 0 : parsed;
  };
  
  /**
   * Formatea un número para mostrar con coma como separador decimal
   * 10.5 -> "10,5"
   */
  export const formatDecimalDisplay = (value, decimals = 1) => {
    if (value === null || value === undefined || value === '') return '0';
    
    const num = typeof value === 'string' ? parseDecimalInput(value) : value;
    
    // Formatear con decimales específicos y reemplazar punto por coma
    return num.toFixed(decimals).replace('.', ',');
  };
  
  /**
   * Permite solo números, coma y punto en inputs
   */
  export const validateDecimalInput = (text) => {
    // Permitir solo números, punto, coma y un solo separador decimal
    const cleaned = text.replace(/[^0-9.,]/g, '');
    
    // Contar cuántos separadores hay
    const commaCount = (cleaned.match(/,/g) || []).length;
    const dotCount = (cleaned.match(/\./g) || []).length;
    
    // Si hay más de un separador decimal, mantener solo el primero
    if (commaCount + dotCount > 1) {
      const firstSeparatorIndex = Math.min(
        cleaned.indexOf(',') >= 0 ? cleaned.indexOf(',') : Infinity,
        cleaned.indexOf('.') >= 0 ? cleaned.indexOf('.') : Infinity
      );
      
      const beforeSeparator = cleaned.substring(0, firstSeparatorIndex + 1);
      const afterSeparator = cleaned.substring(firstSeparatorIndex + 1).replace(/[.,]/g, '');
      
      return beforeSeparator + afterSeparator;
    }
    
    return cleaned;
  };