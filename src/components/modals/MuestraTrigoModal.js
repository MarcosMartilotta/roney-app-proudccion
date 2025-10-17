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



// --- CONFIGURACIÓN DE LOS 23 CAMPOS DE DATOS PARA TRIGO ---
const DATOS_COUNT = 23;
const DATOS_FIELDS = Array.from({ length: DATOS_COUNT }, (_, i) => `dato_${i + 1}`);

const LABELS = [
  'Espigas perdidas',  // dato_1
  'Espigas colgadas',  // dato_2
  'Espigas restantes', // dato_3
  'Granos perdidos 1',     // dato_4
  'Granos totales 1',     // dato_5
  'Granos perdidos 2',     // dato_6
  'Granos totales 2',     // dato_7
  'Granos perdidos 3',     // dato_8
  'Granos totales 3',     // dato_9
  'Granos perdidos 4',     // dato_10
  'Granos totales 4',     // dato_11
  'Granos perdidos 5',     // dato_12
  'Granos totales 5',     // dato_13
  'Granos perdidos 6',     // dato_14
  'Granos totales 6',     // dato_15
  'Granos perdidos 7',     // dato_16
  'Granos totales 7',     // dato_17
  'Granos perdidos 8',     // dato_18
  'Granos totales 8',     // dato_19
  'Granos perdidos 9',     // dato_20
  'Granos totales 9',     // dato_21
  'Granos perdidos 10',    // dato_22
  'Granos totales 10'   // dato_23
];
// ------------------------------------------------

export default function MuestraTrigoModal({ 
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

  // Sincroniza estado al cambiar valoresIniciales
  useEffect(() => {
    setData(initializeDataState(valoresIniciales));
    setCoordenada(valoresIniciales.coordenada || '');
  }, [valoresIniciales]);

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
    const d1 = parseFloat(data.dato_1) || 0;
    const d2 = parseFloat(data.dato_2) || 0;
    const d3 = parseFloat(data.dato_3) || 0;
    
    // Validar que al menos uno de los tres primeros datos tenga valor
    const totenD = d1 + d2 + d3;
    if (totenD === 0) {
      Alert.alert(
        'Error', 
        'Al menos uno de los campos "' + LABELS[0] + '", "' + LABELS[1] + '" o "' + LABELS[2] + '" debe tener un valor mayor a 0'
      );
      return;
    }
    
    // Validar denominador (suma de campos pares desde d5 hasta d23)
    const denominador = 
      (parseFloat(data.dato_5) || 0) +
      (parseFloat(data.dato_7) || 0) +
      (parseFloat(data.dato_9) || 0) +
      (parseFloat(data.dato_11) || 0) +
      (parseFloat(data.dato_13) || 0) +
      (parseFloat(data.dato_15) || 0) +
      (parseFloat(data.dato_17) || 0) +
      (parseFloat(data.dato_19) || 0) +
      (parseFloat(data.dato_21) || 0) +
      (parseFloat(data.dato_23) || 0);
    
    if (denominador === 0) {
      Alert.alert(
        'Error', 
        'Al menos uno de los campos de "Total de granos" (datos 5, 7, 9, 11, 13, 15, 17, 19, 21, 23) debe tener un valor mayor a 0'
      );
      return;
    }
    
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

      //const coords = `${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`;
      const latitudDMS = convertirADMS(location.coords.latitude, true);
      const longitudDMS = convertirADMS(location.coords.longitude, false);
      const coords = `${latitudDMS}, ${longitudDMS}`;
      setCoordenada(coords);
      // Alert.alert('Éxito', 'Coordenadas GPS actualizadas');
    } catch (error) {
      console.error('Error obteniendo coordenadas:', error);
      Alert.alert('Error', 'No se pudieron obtener las coordenadas GPS');
      setCoordenada('Error obteniendo coordenadas');
    }

    setLoadingGPS(false);
  };

  const getTituloEstado = () => {
    const estados = {
      '1': 'Espigamiento (Z.50/59)',
      '2': 'Floración (Z.60/69)',
      '3': 'Lechoso (Z.70/79)',
      '4': 'Pastoso blando (Z.80/84)',
      '5': 'Pastoso duro (Z.85/89)',
      '6': 'Próx. a mudurez (Z.90/99)',
    };
    return estados[estadoFenologico] || 'Trigo';
  };

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

    {(index === 0 || index === 1 || index === 2 || (index > 2 && index % 2 === 0)) && index !== DATOS_COUNT - 1 && (
      <View style={styles.separator} />
    )}
        </React.Fragment>
      );
    });
  };

  // const isSaveDisabled = !DATOS_FIELDS.every(key => data[key].trim());
 // const isSaveDisabled = false;

 const totenD = (parseFloat(data.dato_1) || 0) + (parseFloat(data.dato_2) || 0) + (parseFloat(data.dato_3) || 0);

 const denominador = 
   (parseFloat(data.dato_5) || 0) +
   (parseFloat(data.dato_7) || 0) +
   (parseFloat(data.dato_9) || 0) +
   (parseFloat(data.dato_11) || 0) +
   (parseFloat(data.dato_13) || 0) +
   (parseFloat(data.dato_15) || 0) +
   (parseFloat(data.dato_17) || 0) +
   (parseFloat(data.dato_19) || 0) +
   (parseFloat(data.dato_21) || 0) +
   (parseFloat(data.dato_23) || 0);
 
 const isSaveDisabled = totenD === 0 || denominador === 0;

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