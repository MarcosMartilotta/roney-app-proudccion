import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { convertirADMS } from '../../utils/coordenadas';

// --- CONFIGURACIÓN DE LOS 6 CAMPOS DE DATOS PARA GIRASOL ---
const DATOS_COUNT = 5;
const DATOS_FIELDS = Array.from({ length: DATOS_COUNT }, (_, i) => `dato_${i + 1}`);

// Etiquetas específicas para trigo (ajusta según tus necesidades)
const LABELS = [
  'Población perdida en D',
  'Población improductiva en D',
  'Población restante en D',
  '% Promedio daño capít.',
  '% Defoliacion'
];
// ------------------------------------------------

export default function MuestraGirasolModal({ 
  visible, 
  onClose, 
  onGuardar, 
  valoresIniciales = {},
  estadoFenologico = '', 
  esEdicion = false 
}) {
  
  // Función para inicializar el estado de los datos (dato_1 a dato_23)
  const initializeDataState = (initialValues) => {
    return DATOS_FIELDS.reduce((acc, key) => {
      acc[key] = initialValues[key] || '';
      return acc;
    }, {});
  };

  const [data, setData] = useState(initializeDataState(valoresIniciales));
  const [coordenada, setCoordenada] = useState(valoresIniciales.coordenada || '');
  const [loadingGPS, setLoadingGPS] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sincronizar estado al cambiar valoresIniciales
  useEffect(() => {
    setData(initializeDataState(valoresIniciales));
    setCoordenada(valoresIniciales.coordenada || '');
  }, [valoresIniciales]);

  // Obtener GPS solo en creación
  useEffect(() => {
    if (!esEdicion && visible && !valoresIniciales.coordenada) {
      actualizarCoordenada();
    }
  }, [visible, esEdicion]);

  // Función para actualizar un campo específico
  const handleDataChange = (key, text) => {
    setData(prev => ({ ...prev, [key]: text }));
  };

  const handleGuardar = () => {
    // Valida que todos los 23 campos estén completos
    // const allFieldsValid = DATOS_FIELDS.every(key => data[key].trim());
    
    // if (!allFieldsValid) {
    //   Alert.alert('Error', 'Todos los campos de datos son obligatorios');
    //   return;
    // }
    
    const datosCompletos = { ...data, coordenada };
    
    onGuardar(datosCompletos);
  };

  const handleCerrar = () => {
    setData(initializeDataState(valoresIniciales));
    setCoordenada(valoresIniciales.coordenada || '');
    onClose();
  };

  const actualizarCoordenada = async () => {
    if (esEdicion) return;
    
    setLoadingGPS(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Error', 'Se necesita permiso de ubicación para obtener las coordenadas GPS');
        setCoordenada('Error: Sin permisos de ubicación');
        setLoadingGPS(false);
        return;
      }

      // const location = await Location.getCurrentPositionAsync({
      //   accuracy: Location.Accuracy.High,
      // });

      const location = await Promise.race([
        Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('GPS timeout')), 10000)
        )
      ]);

      // const coords = `${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`;

      const latitudDMS = convertirADMS(location.coords.latitude, true);
      const longitudDMS = convertirADMS(location.coords.longitude, false);
      const coords = `${latitudDMS}, ${longitudDMS}`;

      setCoordenada(coords);
      //Alert.alert('Éxito', 'Coordenadas GPS actualizadas');
    } catch (error) {
      console.error('Error obteniendo coordenadas:', error);
      Alert.alert('Error', 'No se pudieron obtener las coordenadas GPS');
      setCoordenada('Error obteniendo coordenadas');
    }

    setLoadingGPS(false);
  };

  // Obtiene el nombre del estado fenológico para el título
  const getTituloEstado = () => {
    // Mapea el valor del estado a su nombre legible
    const estados = {
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
    };
    return estados[estadoFenologico] || 'Girasol';
  };

  // Renderiza los 6 inputs
  const renderDataInputs = () => {
    return DATOS_FIELDS.map((key, index) => {
      const labelText = LABELS[index];

      return (
        <React.Fragment key={key}>
          <Text style={styles.label}>{labelText}:</Text>
          <TextInput
            style={styles.input}
            placeholder={labelText}
            value={data[key]}
            onChangeText={(text) => handleDataChange(key, text)}
            keyboardType="numeric"
            returnKeyType={index === DATOS_COUNT - 1 ? 'done' : 'next'}
          />
          <View style={styles.separator} />  
        </React.Fragment>
      );
    });
  };

  //const isSaveDisabled = !DATOS_FIELDS.every(key => data[key].trim());
  const isSaveDisabled = false; //comentar esto y descomentar arriba para habilitar la obligatoriedad

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      presentationStyle="overFullScreen"
      statusBarTranslucent
      onRequestClose={handleCerrar}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <View style={styles.header}>
              <Text style={styles.titulo}>
                {esEdicion 
                  ? `Editar Muestra - ${getTituloEstado()}` 
                  : `Nueva Muestra - ${getTituloEstado()}`}
              </Text>
              <TouchableOpacity 
                onPress={handleCerrar} 
                accessibilityRole="button" 
                accessibilityLabel="Cerrar"
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.label}>Coordenadas GPS:</Text>
              <View style={styles.gpsContainer}>
                {loading ? (
                  <ActivityIndicator style={styles.loadingCoords} />
                ) : (
                  <>
                    <TextInput
                      style={[
                        styles.input, 
                        styles.coordsInput,
                        esEdicion && styles.coordsInputDisabled
                      ]}
                      placeholder="Coordenadas GPS (lat, long)"
                      value={coordenada}
                      onChangeText={setCoordenada}
                      editable={!esEdicion}
                    />
                    
                    {!esEdicion && (
                      <TouchableOpacity
                        style={styles.gpsButton}
                        onPress={actualizarCoordenada}
                        disabled={loadingGPS}
                      >
                        {loadingGPS ? (
                          <ActivityIndicator size="small" color="white" />
                        ) : (
                          <Ionicons name="location" size={20} color="white" />
                        )}
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </View>
  
              {renderDataInputs()}
              
              <View style={styles.botones}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleCerrar}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.button, 
                    styles.saveButton,
                    isSaveDisabled && styles.saveButtonDisabled
                  ]}
                  onPress={handleGuardar}
                  disabled={isSaveDisabled}
                >
                  <Text style={styles.saveButtonText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
  
  const styles = StyleSheet.create({
    safeArea: { 
      flex: 1,
    },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 60,
    },
    separator: {
      height: 1, 
      backgroundColor: '#333', 
      marginVertical: 12,
    },
    modalContainer: {
      width: '100%',
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 24,
      elevation: 5,
      maxHeight: '85%',
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: 20,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    titulo: {
      fontSize: 20,
      fontWeight: 'bold',
      flex: 1,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
      marginTop: 10,
      marginBottom: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      padding: 12,
      marginBottom: 14,
      fontSize: 16,
    },
    coordsInput: {
      flex: 1,
      marginBottom: 0,
      backgroundColor: '#f8f9fa',
      color: '#666',
    },
    coordsInputDisabled: {
      backgroundColor: '#f0f0f0',
      color: '#999',
    },
    gpsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 14,
    },
    gpsButton: {
      backgroundColor: '#007bff',
      padding: 12,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 10,
      minWidth: 50,
    },
    loadingCoords: {
      padding: 20,
    },
    botones: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
      gap: 10,
    },
    button: {
      flex: 1,
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: '#6c757d',
    },
    cancelButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    saveButton: {
      backgroundColor: '#28a745',
    },
    saveButtonDisabled: {
      backgroundColor: '#ccc',
    },
    saveButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });