import React, { useMemo, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// ✅ Configuraciones como constantes (fuera del componente)
const LABELS_CONFIG = {
  soja: {
    '1': ['Población perdida en D', 'Población restante en D', '% Nudos Perdidos', '% Defoliación'],
    '2': ['Población perdida en D', 'Población restante en D', '% Nudos Perdidos', '% Defoliación'],
    '3': ['Población perdida en D', 'Población restante en D', '% Nudos Perdidos', '% Defoliación'],
    '4': ['Población perdida en D', 'Población restante en D', '% Nudos Perdidos', '% Defoliación'],
    '5': ['Población perdida en D', 'Población restante en D', '% Nudos Perdidos', '% Defoliación'],
    '6': ['Población perdida en D', 'Población restante en D', '% Nudos Perdidos', '% Defoliación'],
    '7': ['Población perdida en D', 'Población restante en D', '% Nudos Perdidos', '% Defoliación'],
    '8': ['Población perdida en D', 'Población restante en D', '% Nudos Perdidos', '% Defoliación'],
    '9': ['Población perdida en D', 'Población restante en D', '% Nudos Perdidos', '% Defoliación'],

    '10': ['Población perdida en D', 'Población restante en D', 'Nudos originales por Planta:', 'Nudos remanentes 1', 'Nudos remanentes 2', 'Nudos remanentes 3', 'Nudos remanentes 4', 'Nudos remanentes 5', '% Defoliación'],
    '11': ['Población perdida en D', 'Población restante en D', 'Nudos originales por Planta:', 'Nudos remanentes 1', 'Nudos remanentes 2', 'Nudos remanentes 3', 'Nudos remanentes 4', 'Nudos remanentes 5', '% Defoliación'],
    '12': ['Población perdida en D', 'Población restante en D', 'Nudos originales por Planta:', 'Nudos remanentes 1', 'Nudos remanentes 2', 'Nudos remanentes 3', 'Nudos remanentes 4', 'Nudos remanentes 5', '% Defoliación'],
    '13': ['Población perdida en D', 'Población restante en D', 'Nudos originales por Planta:', 'Nudos remanentes 1', 'Nudos remanentes 2', 'Nudos remanentes 3', 'Nudos remanentes 4', 'Nudos remanentes 5', '% Defoliación'],
    '14': ['Población perdida en D', 'Población restante en D', 'Nudos originales por Planta:', 'Nudos remanentes 1', 'Nudos remanentes 2', 'Nudos remanentes 3', 'Nudos remanentes 4', 'Nudos remanentes 5', '% Defoliación'],
    
    '15': ['Vainas en el suelo', 'Vainas abiertas  1', 'Vainas Sanas  1', 'Vainas abiertas  2', 'Vainas Sanas  2', 'Vainas abiertas  3', 'Vainas Sanas  3', 'Vainas abiertas  4', 'Vainas Sanas  4', 'Vainas abiertas  5', 'Vainas Sanas  5', '% Defoliación'],
    '16': ['Vainas en el suelo', 'Vainas abiertas  1', 'Vainas Sanas  1', 'Vainas abiertas  2', 'Vainas Sanas  2', 'Vainas abiertas  3', 'Vainas Sanas  3', 'Vainas abiertas  4', 'Vainas Sanas  4', 'Vainas abiertas  5', 'Vainas Sanas  5', '% Defoliación'],
    '17': ['Vainas en el suelo', 'Vainas abiertas  1', 'Vainas Sanas  1', 'Vainas abiertas  2', 'Vainas Sanas  2', 'Vainas abiertas  3', 'Vainas Sanas  3', 'Vainas abiertas  4', 'Vainas Sanas  4', 'Vainas abiertas  5', 'Vainas Sanas  5', '% Defoliación'],
    '18': ['Vainas en el suelo', 'Vainas abiertas  1', 'Vainas Sanas  1', 'Vainas abiertas  2', 'Vainas Sanas  2', 'Vainas abiertas  3', 'Vainas Sanas  3', 'Vainas abiertas  4', 'Vainas Sanas  4', 'Vainas abiertas  5', 'Vainas Sanas  5', '% Defoliación'],
    '19': ['Vainas en el suelo', 'Vainas abiertas  1', 'Vainas Sanas  1', 'Vainas abiertas  2', 'Vainas Sanas  2', 'Vainas abiertas  3', 'Vainas Sanas  3', 'Vainas abiertas  4', 'Vainas Sanas  4', 'Vainas abiertas  5', 'Vainas Sanas  5', '% Defoliación'],
    '20': ['Vainas en el suelo', 'Vainas abiertas  1', 'Vainas Sanas  1', 'Vainas abiertas  2', 'Vainas Sanas  2', 'Vainas abiertas  3', 'Vainas Sanas  3', 'Vainas abiertas  4', 'Vainas Sanas  4', 'Vainas abiertas  5', 'Vainas Sanas  5', '% Defoliación'],
    
    '21': ['Granos en el suelo', 'Granos en vainas abiertas 1', 'Granos en vainas Sanas 1', 'Granos en vainas abiertas 2', 'Granos en vainas Sanas 2', 'Granos en vainas abiertas 3', 'Granos en vainas sanas 3', 'Granos en vainas abiertas 4', 'Granos en vainas sanas 4', 'Granos en vainas abiertas 5', 'Granos en vainas sanas 5', 'Granos en vainas abiertas 6', 'Granos en vainas sanas 6', 'Granos en vainas abiertas 7', 'Granos en vainas sanas 7', 'Granos en vainas abiertas 8', 'Granos en vainas sanas 8', 'Granos en vainas abiertas 9', 'Granos en vainas sanas 9', 'Granos en vainas abiertas 10', 'Granos en vainas sanas 10']
  },
  trigo: {
    '1': ['Espigas perdidas', 'Espigas colgadas', 'Espigas restantes', 'Granos perdidos 1', 'Granos totales 1', 'Granos perdidos 2', 'Granos totales 2', 'Granos perdidos 3', 'Granos totales 3', 'Granos perdidos 4', 'Granos totales 4', 'Granos perdidos 5', 'Granos totales 5', 'Granos perdidos 6', 'Granos totales 6', 'Granos perdidos 7', 'Granos totales 7', 'Granos perdidos 8', 'Granos totales 8', 'Granos perdidos 9', 'Granos totales 9', 'Granos perdidos 10', 'Granos totales 10'],
    '2': ['Espigas perdidas', 'Espigas colgadas', 'Espigas restantes', 'Granos perdidos 1', 'Granos totales 1', 'Granos perdidos 2', 'Granos totales 2', 'Granos perdidos 3', 'Granos totales 3', 'Granos perdidos 4', 'Granos totales 4', 'Granos perdidos 5', 'Granos totales 5', 'Granos perdidos 6', 'Granos totales 6', 'Granos perdidos 7', 'Granos totales 7', 'Granos perdidos 8', 'Granos totales 8', 'Granos perdidos 9', 'Granos totales 9', 'Granos perdidos 10', 'Granos totales 10'],
    '3': ['Espigas perdidas', 'Espigas colgadas', 'Espigas restantes', 'Granos perdidos 1', 'Granos totales 1', 'Granos perdidos 2', 'Granos totales 2', 'Granos perdidos 3', 'Granos totales 3', 'Granos perdidos 4', 'Granos totales 4', 'Granos perdidos 5', 'Granos totales 5', 'Granos perdidos 6', 'Granos totales 6', 'Granos perdidos 7', 'Granos totales 7', 'Granos perdidos 8', 'Granos totales 8', 'Granos perdidos 9', 'Granos totales 9', 'Granos perdidos 10', 'Granos totales 10'],
    '4': ['Espigas perdidas', 'Espigas colgadas', 'Espigas restantes', 'Granos perdidos 1', 'Granos totales 1', 'Granos perdidos 2', 'Granos totales 2', 'Granos perdidos 3', 'Granos totales 3', 'Granos perdidos 4', 'Granos totales 4', 'Granos perdidos 5', 'Granos totales 5', 'Granos perdidos 6', 'Granos totales 6', 'Granos perdidos 7', 'Granos totales 7', 'Granos perdidos 8', 'Granos totales 8', 'Granos perdidos 9', 'Granos totales 9', 'Granos perdidos 10', 'Granos totales 10'],
    '5': ['Espigas perdidas', 'Espigas colgadas', 'Espigas restantes', 'Granos perdidos 1', 'Granos totales 1', 'Granos perdidos 2', 'Granos totales 2', 'Granos perdidos 3', 'Granos totales 3', 'Granos perdidos 4', 'Granos totales 4', 'Granos perdidos 5', 'Granos totales 5', 'Granos perdidos 6', 'Granos totales 6', 'Granos perdidos 7', 'Granos totales 7', 'Granos perdidos 8', 'Granos totales 8', 'Granos perdidos 9', 'Granos totales 9', 'Granos perdidos 10', 'Granos totales 10'],
    '6': ['Espigas perdidas', 'Espigas colgadas', 'Espigas restantes', 'Granos perdidos 1', 'Granos totales 1', 'Granos perdidos 2', 'Granos totales 2', 'Granos perdidos 3', 'Granos totales 3', 'Granos perdidos 4', 'Granos totales 4', 'Granos perdidos 5', 'Granos totales 5', 'Granos perdidos 6', 'Granos totales 6', 'Granos perdidos 7', 'Granos totales 7', 'Granos perdidos 8', 'Granos totales 8', 'Granos perdidos 9', 'Granos totales 9', 'Granos perdidos 10', 'Granos totales 10']
  },
  girasol: {
    '1': ['Población perdida en D', 'Población improductiva en D', 'Población restante en D', '% Promedio daño capít.', '% Defoliacion'],
    '2': ['Población perdida en D', 'Población improductiva en D', 'Población restante en D', '% Promedio daño capít.', '% Defoliacion'],
    '3': ['Población perdida en D', 'Población improductiva en D', 'Población restante en D', '% Promedio daño capít.', '% Defoliacion'],
    '4': ['Población perdida en D', 'Población improductiva en D', 'Población restante en D', '% Promedio daño capít.', '% Defoliacion'],
    '5': ['Población perdida en D', 'Población improductiva en D', 'Población restante en D', '% Promedio daño capít.', '% Defoliacion'],
    '6': ['Población perdida en D', 'Población improductiva en D', 'Población restante en D', '% Promedio daño capít.', '% Defoliacion'],
    '7': ['Población perdida en D', 'Población improductiva en D', 'Población restante en D', '% Promedio daño capít.', '% Defoliacion'],
    '8': ['Población perdida en D', 'Población improductiva en D', 'Población restante en D', '% Promedio daño capít.', '% Defoliacion'],
    '9': ['Población perdida en D', 'Población improductiva en D', 'Población restante en D', '% Promedio daño capít.', '% Defoliacion'],
    '10': ['Población perdida en D', 'Población improductiva en D', 'Población restante en D', '% Promedio daño capít.', '% Defoliacion'],
    '11': ['Población perdida en D', 'Población improductiva en D', 'Población restante en D', '% Promedio daño capít.', '% Defoliacion'],
    '11': ['Población perdida en D', 'Población improductiva en D', 'Población restante en D', '% Promedio daño capít.', '% Defoliacion'],
    '12': ['Población perdida en D', 'Población improductiva en D', 'Población restante en D', '% Promedio daño capít.', '% Defoliacion'],
    '13': ['Población perdida en D', 'Población improductiva en D', 'Población restante en D', '% Promedio daño capít.', '% Defoliacion'],
    '14': ['Población perdida en D', 'Población improductiva en D', 'Población restante en D', '% Promedio daño capít.', '% Defoliacion'],
    '15': ['Población perdida en D', 'Población improductiva en D', 'Población restante en D', '% Promedio daño capít.', '% Defoliacion'],
    '16': ['Población perdida en D', 'Población improductiva en D', 'Población restante en D', '% Promedio daño capít.', '% Defoliacion'],
    '17': ['Población perdida en D', 'Población improductiva en D', 'Población restante en D', '% Promedio daño capít.', '% Defoliacion'],
    '18': ['Población perdida en D', 'Población improductiva en D', 'Población restante en D', '% Promedio daño capít.', '% Defoliacion'],
    '19': ['Población perdida en D', 'Población improductiva en D', 'Población restante en D', '% Promedio daño capít.', '% Defoliacion'],
    '20': ['Población perdida en D', 'Población improductiva en D', 'Población restante en D', '% Promedio daño capít.', '% Defoliacion'],
    '21': ['Población perdida en D', 'Población improductiva en D', 'Población restante en D', '% Promedio daño capít.', '% Defoliacion']
  },
  maiz: {
    '1': ['Población perdida en D', 'Población restante en D', '% Defoliacion'],
    '2': ['Población perdida en D', 'Población restante en D', '% Defoliacion'],
    '3': ['Población perdida en D', 'Población restante en D', '% Defoliacion'],
    '4': ['Población perdida en D', 'Población restante en D', '% Defoliacion'],
    '5': ['Población perdida en D', 'Población restante en D', '% Defoliacion'],
    '6': ['Población perdida en D', 'Población restante en D', '% Defoliacion'],
    '7': ['Población perdida en D', 'Población restante en D', '% Defoliacion'],
    '8': ['Población perdida en D', 'Población restante en D', '% Defoliacion'],
    '9': ['Población perdida en D', 'Población restante en D', 'Nº hileras promedio', 'Granos perdidos Totales', '% Defoliacion'],
    '10': ['Población perdida en D', 'Población restante en D', 'Nº hileras promedio', 'Granos perdidos Totales', '% Defoliacion'],
    '11': ['Población perdida en D', 'Población restante en D', 'Nº hileras promedio', 'Granos perdidos Totales', '% Defoliacion'],
    '11': ['Población perdida en D', 'Población restante en D', 'Nº hileras promedio', 'Granos perdidos Totales', '% Defoliacion'],
    '12': ['Población perdida en D', 'Población restante en D', 'Nº hileras promedio', 'Granos perdidos Totales', '% Defoliacion'],
    '13': ['Población perdida en D', 'Población restante en D', 'Nº hileras promedio', 'Granos perdidos Totales', '% Defoliacion'],
    '14': ['Población perdida en D', 'Población restante en D', 'Nº hileras promedio', 'Granos perdidos Totales', '% Defoliacion'],
    '15': ['Población perdida en D', 'Población restante en D', 'Nº hileras promedio', 'Granos perdidos Totales', '% Defoliacion'],
    '16': ['Población perdida en D', 'Población restante en D', 'Nº hileras promedio', 'Granos perdidos Totales', '% Defoliacion'],
    '17': ['Población perdida en D', 'Población restante en D', 'Nº hileras promedio', 'Granos perdidos Totales', '% Defoliacion'],
    '18': ['Población perdida en D', 'Población restante en D', 'Nº hileras promedio', 'Granos perdidos Totales', '% Defoliacion'],
    '19': ['Población perdida en D', 'Población restante en D', 'Nº hileras promedio', 'Granos perdidos Totales', '% Defoliacion'],
    '20': ['Población perdida en D', 'Población restante en D', 'Nº hileras promedio', 'Granos perdidos Totales', '% Defoliacion'],
    '21': ['Población perdida en D', 'Población restante en D', 'Nº hileras promedio', 'Granos perdidos Totales', '% Defoliacion'],
    '22': ['Población perdida en D', 'Población restante en D', 'Nº hileras promedio', 'Granos perdidos Totales', '% Defoliacion'],
    '23': ['Población perdida en D', 'Población restante en D', 'Nº hileras promedio', 'Granos perdidos Totales', '% Defoliacion'],
    '24': ['Población perdida en D', 'Población restante en D', 'Nº hileras promedio', 'Granos perdidos Totales', '% Defoliacion'],
    '25': ['Población perdida en D', 'Población restante en D', 'Nº hileras promedio', 'Granos perdidos Totales', '% Defoliacion'],
    '26': ['Población perdida en D', 'Población restante en D', 'Nº hileras promedio', 'Granos perdidos Totales', '% Defoliacion']
  }
};

const ESTADOS_NOMBRES = {
  soja: {
    '1': 'V1-Vn',
    '2': 'R1-R2',
    '3': 'R3-R4',
    '4': 'R5-R6'
  },
  trigo: {
    '1': 'Espigamiento (Z.50/59)',
    '2': 'Floración (Z.60/69)',
    '3': 'Lechoso (Z.70/79)',
    '4': 'Pastoso blando (Z.80/84)',
    '5': 'Pastoso duro (Z.85/89)',
    '6': 'Próx. a madurez (Z.90/99)'
  },
  girasol: {
    '1': 'V1-V11',
    '2': 'V12-Vn',
    '3': 'R1 (estrella)',
    '4': 'R2 (botón a 0,5 - 2 cm)',
    '5': 'R3 (botón a + de 2 cm)',
    '6': 'R4 (apertura inflorescencia)',
    '7': 'R5 (inicio floración)',
    '8': 'R6 (fin floración)',
    '9': 'R7 (envés capítulo inicio amarilleo)',
    '10': 'R8 (envés capítulo amarillo)',
    '11': 'R9 (brácteas amarillo/marrón)',
  },
  maiz: {
    '1':'V1',
    '2':'V2', 
    '3':'V3', 
    '4':'V4',
    '5':'V5',
    '6':'V6',
    '7':'V7',
    '8':'V8', 
    '9':'V9', 
    '10':'V10', 
    '11':'V11', 
    '12':'V12', 
    '13':'V13', 
    '14':'V14', 
    '15':'V15', 
    '16': "Inicio Florac.Fem (R1-)",
    '17': "Flor Fem.Plena Barba Blanca (R1)",
    '18': "Fin Flor Fem. Barba Marrón (R1+)",
    '19': "Ampolla (R2)",
    '20': "Lechoso Temprano (R3)",
    '21': "Lechoso tardío (R3+)",
    '22': "Pastoso Temprano (R4)",
    '23': "Pastoso tardío (R4+)",
    '24': "Identación/ Líneas Leche (R5)",
    '25': "Madurez Fisiológica (R6)",
    '26': "Madurez Comercial (R6+)"
  }
};

export default function VerMuestraModal({ 
  visible, 
  onClose, 
  muestra,
  cultivo = 'soja',
  tipoFenologico = '1'
}) {
  // ✅ Labels memoizados
  const labels = useMemo(() => {
    const cultivoConfig = LABELS_CONFIG[cultivo];
    if (!cultivoConfig) return [];
    
    const tipoConfig = cultivoConfig[tipoFenologico];
    if (!tipoConfig) return [];
    
    return tipoConfig;
  }, [cultivo, tipoFenologico]);

  // ✅ Nombre del estado fenológico memoizado
  const nombreEstado = useMemo(() => {
    const cultivoEstados = ESTADOS_NOMBRES[cultivo];
    if (!cultivoEstados) return `Tipo ${tipoFenologico}`;
    
    return cultivoEstados[tipoFenologico] || `Tipo ${tipoFenologico}`;
  }, [cultivo, tipoFenologico]);

  // ✅ Datos de la muestra memoizados
  const datos = useMemo(() => {
    return muestra?.datos || {};
  }, [muestra]);

  // ✅ Verificar si hay coordenadas memoizado
  const tieneCoordenas = useMemo(() => {
    return Boolean(datos.coordenada);
  }, [datos.coordenada]);

  // ✅ Verificar si hay porcentaje de daño memoizado
  const tienePorcentajeDano = useMemo(() => {
    return datos.porcentajeDaño !== undefined;
  }, [datos.porcentajeDaño]);

  // ✅ Renderizar campo de dato memoizado
  const renderDataField = useCallback((label, key, index) => {
    const value = datos[key];
    
    return (
      <View key={key} style={styles.dataRow}>
        <View style={styles.dataIconContainer}>
          <Text style={styles.dataIcon}>📊</Text>
        </View>
        <View style={styles.dataContent}>
          <Text style={styles.dataLabel}>{label}:</Text>
          <Text style={styles.dataValue}>{value || '-'}</Text>
        </View>
      </View>
    );
  }, [datos]);

  // ✅ Renderizar lista de campos memoizada
  const dataFields = useMemo(() => {
    return labels.map((label, index) => {
      const key = `dato_${index + 1}`;
      return renderDataField(label, key, index);
    });
  }, [labels, renderDataField]);

  // ✅ Estilo del valor de daño memoizado
  const danioValueStyle = useMemo(() => [
    styles.infoValue, 
    styles.danioValue
  ], []);

  if (!muestra) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.title}>Ver Muestra</Text>
              {/* <Text style={styles.subtitle}>{nombreEstado}</Text> */}
            </View>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Cerrar"
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              {/* Información General */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>ℹ️ Información General</Text>
                
                <View style={styles.infoCard}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Nombre:</Text>
                    <Text style={styles.infoValue}>{muestra.nombre}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Fecha:</Text>
                    <Text style={styles.infoValue}>{muestra.fecha}</Text>
                  </View>
                  
                  {tienePorcentajeDano && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Daño Calculado:</Text>
                      <Text style={danioValueStyle}>
                        {datos.porcentajeDaño}%
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {tieneCoordenas && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>📍 Coordenadas GPS</Text>
                  <View style={styles.gpsCard}>
                    <Ionicons name="location" size={20} color="#007bff" />
                    <Text style={styles.gpsText}>{datos.coordenada}</Text>
                  </View>
                </View>
              )}

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>📊 Datos de la Muestra</Text>
                <View style={styles.dataContainer}>
                  {dataFields}
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.closeFooterButton} 
              onPress={onClose}
            >
              <Text style={styles.closeFooterButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  scrollView: {
    maxHeight: '100%',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  danioValue: {
    color: '#dc3545',
    fontSize: 16,
  },
  gpsCard: {
    backgroundColor: '#e7f3ff',
    borderRadius: 10,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
  },
  gpsText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  dataContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dataIconContainer: {
    width: 32,
    alignItems: 'center',
  },
  dataIcon: {
    fontSize: 16,
  },
  dataContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 12,
  },
  dataLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    flex: 1,
  },
  dataValue: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: 'bold',
    textAlign: 'right',
    marginLeft: 8,
  },
  footer: {
    padding: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  closeFooterButton: {
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeFooterButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});