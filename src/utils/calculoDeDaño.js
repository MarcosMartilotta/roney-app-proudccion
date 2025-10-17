import { 
  danPorReduccion, 
  danPorNudos, 
  danPorDesfo, 
  danPorNudosR1, 
  danPorDesfoR1, 
  danPorDesfoR4, 
  trigo,
  girasolReduccion,
  girasolDesfo,
  desfoMaiz,
  reduccionMaiz,
  desfoMaizVR
} from './tablas';

/**
 * Calcula el porcentaje de daño basado en los parámetros de entrada
 * @param {Object} datos - Datos del modal
 * @param {string} fenologico - Valor del Picker ('1'-'13')
 * @param {string} cultivo - Tipo de cultivo ('soja', 'maiz', 'trigo', 'girasol')
 * @returns {number} Porcentaje de daño (0-100)
 */
export function calculoDeDaño(datos, fenologico, cultivo) {
  try {
    const fenologicoNum = parseInt(fenologico, 10);
    const cultivoNormalizado = cultivo?.toLowerCase().trim() || 'soja';

    console.log('🔍 Calculando daño para:', {
      cultivo: cultivoNormalizado,
      fenologico,
      fenologicoNum
    });

    // Routing por tipo de cultivo
    switch (cultivoNormalizado) {
      case 'trigo':
        return calcularDañoTrigo(datos, fenologico);
      
      case 'girasol':
        return calcularDañoGirasol(datos, fenologico);
      
      case 'maiz':
        return calcularDañoMaiz(datos, fenologico);
      
      case 'soja':
      default:
        return calcularDañoSoja(datos, fenologico);
    }

  } catch (error) {
    console.warn('Error en calculoDeDaño:', error);
    return 0;
  }
}

/**
 * ============================================================================
 * CÁLCULO DE DAÑO PARA SOJA
 * ============================================================================
 */
function calcularDañoSoja(datos, fenologico) {
  const fenologicoNum = parseInt(fenologico, 10);
  
  // Mapeo del valor del Picker a etiqueta de tabla
  let fenologicoLabel = 'r8'; 
    
    
    if (!isNaN(fenologicoNum)) {
      if (fenologicoNum === 1) {
        fenologicoLabel = 'v1';
      } else if (fenologicoNum === 2) {
        fenologicoLabel = 'v2';
      } else if (fenologicoNum === 3) {
        fenologicoLabel = 'v3';
      } else if (fenologicoNum === 4) {
        fenologicoLabel = 'v4';
      } else if (fenologicoNum === 5) {
        fenologicoLabel = 'v5';
      } else if (fenologicoNum === 6) {
        fenologicoLabel = 'v6';
      } else if (fenologicoNum === 7) {
        fenologicoLabel = 'v7';
      } else if (fenologicoNum === 8) {
        fenologicoLabel = 'v8';
      } else if (fenologicoNum === 9) {
        fenologicoLabel = 'v9-Vn';
      } else if (fenologicoNum === 10) {
        fenologicoLabel = 'r1';
      } else if (fenologicoNum === 11) {
        fenologicoLabel = 'r2';
      } else if (fenologicoNum === 12) {
        fenologicoLabel = 'r2.5';
      } else if (fenologicoNum === 13) {
        fenologicoLabel = 'r3';
      } else if (fenologicoNum === 14) {
        fenologicoLabel = 'r3.5';
      } else if (fenologicoNum === 15) {
        fenologicoLabel = 'r4';
      } else if (fenologicoNum === 16) {
        fenologicoLabel = 'r4.5';
      } else if (fenologicoNum === 17) {
        fenologicoLabel = 'r5';
      } else if (fenologicoNum === 18) {
        fenologicoLabel = 'r5.5';
      } else if (fenologicoNum === 19) {
        fenologicoLabel = 'r6';
      } else if (fenologicoNum === 20) {
        fenologicoLabel = 'r6.5';
      } else if (fenologicoNum === 21) { 
        fenologicoLabel = 'r8';
      }
    }

  console.log('🌱 Calculando daño SOJA para:', fenologicoLabel);

  // Determinar categoría del estado fenológico
  const esVegetativo = ['v1', 'v2', 'v3', 'v4', 'v5','v6', 'v7', 'v8','v9-Vn'].includes(fenologicoLabel);
  const esReproductivo = ['r1', 'r2', 'r2.5', 'r3', 'r3.5'].includes(fenologicoLabel);
  const esReproductivo47 = ['r4', 'r4.5', 'r5', 'r5.5', 'r6', 'r6.5'].includes(fenologicoLabel);

  if (esVegetativo) {
    return calcularDañoVegetativo(datos, fenologicoLabel);
  } else if (esReproductivo) {
    return calcularDañoReproductivo(datos, fenologicoLabel);
  } else if (esReproductivo47) {
    return calcularReproductivo47(datos, fenologicoLabel);
  } else {
    return calcularDañoAvanzado(datos, fenologicoLabel);
  }
}

/**
 * Cálculo para estados vegetativos V1-VN de SOJA
 * Usa: dato_1 (pérdida en D), dato_2 (restante en D), dato_3 (nudos perdidos), dato_4 (defoliación)
 */
function calcularDañoVegetativo(datos, fenologicoLabel) {
  const d1 = parseFloat(datos?.dato_1) || 0;
  const d2 = parseFloat(datos?.dato_2) || 0;
  const d3 = parseFloat(datos?.dato_3) || 0; // nudos perdidos
  const d4 = parseFloat(datos?.dato_4) || 0; // defoliación
  console.log("Entrada:", fenologicoLabel, datos)

  const totalD = d1 + d2;
  const porcePlantasPerdidas = totalD > 0 ? (d1 / totalD) * 100 : 0;

  // Coeficientes de tablas
  let coefi, coefi2, coefi3;
  
  switch (fenologicoLabel) {
    case 'v1':
    case 'v2':
    case 'v3':
    case 'v4':
    case 'v5':
        // Coeficientes que antes correspondían a 'v1-v5'
        coefi = danPorReduccion['v1-v5'].dan;
        coefi2 = danPorNudos['v1-v5'].dan;
        coefi3 = danPorDesfo['v1-v5'].dan;
        break;

    case 'v6':
    case 'v7':
    case 'v8':
        // Coeficientes que antes correspondían a 'v6-v8'
        coefi = danPorReduccion['v6-v8'].dan;
        coefi2 = danPorNudos['v6-v8'].dan;
        coefi3 = danPorDesfo['v6-v8'].dan;
        break;
    
    // Aquí se agrupan V9 y VN (excluyendo V10)
    case 'v9-Vn':
        // Coeficientes que antes correspondían a 'v9-vn'
        coefi = danPorReduccion['v9-vn'].dan;
        coefi2 = danPorNudos['v9-vn'].dan;
        coefi3 = danPorDesfo['v9-vn'].dan;
        break;

    default:
      break;
}

  // Cálculo por reducción de plantas
  const indiceA = Math.floor(porcePlantasPerdidas);
  const porcentajeA = parseFloat(coefi?.[indiceA] ?? 0) || 0;
  const cpr = 100 - porcentajeA;

  // Cálculo por nudos perdidos
  const indiceC = Math.floor(d3);
  const porcentajeC = parseFloat(coefi2?.[indiceC] ?? 0) || 0;
  const porcentajeE = parseFloat(((porcentajeC * cpr) / 100));

  // Cálculo por defoliación
  const cprf = 100 - porcentajeA - porcentajeE;
  const indiceD = Math.floor(d4);
  const porcentajeD = parseFloat(coefi3?.[indiceD] ?? 0) || 0;
  const porcentajeG = parseFloat(((porcentajeD * cprf) / 100));

  const porcentaje = porcentajeG + porcentajeE + porcentajeA;
  
  console.log('📊 Cálculo V (SOJA):', {
    porcePlantasPerdidas: porcentajeA,
    porNudos: porcentajeE,
    porDefoliacion: porcentajeG,
    total: porcentaje
  });

  return porcentaje.toFixed(1);
}

/**
 * Cálculo para estados reproductivos R1-R3.5 de SOJA
 */
function calcularDañoReproductivo(datos, fenologicoLabel) {
  const d1 = parseFloat(datos?.dato_1) || 0;
  const d2 = parseFloat(datos?.dato_2) || 0;
  const d3 = parseFloat(datos?.dato_3) || 0;
  const d4 = parseFloat(datos?.dato_4) || 0;
  const d5 = parseFloat(datos?.dato_5) || 0;
  const d6 = parseFloat(datos?.dato_6) || 0;
  const d7 = parseFloat(datos?.dato_7) || 0;
  const d8 = parseFloat(datos?.dato_8) || 0;
  const d9 = parseFloat(datos?.dato_9) || 0;

  const totalD = d1 + d2;
  const danA = totalD > 0 ? (d1 / totalD) * 100 : 0;
  const cpr = 100 - danA;

  const nudosRemanentes = [d4, d5, d6, d7, d8].filter(n => n > 0);
  const promedioNudosRemanentes = nudosRemanentes.length > 0 
      ? nudosRemanentes.reduce((a, b) => a + b, 0) / nudosRemanentes.length 
      : 0;

  const porcentajeNudosPerdidos = d3 > 0 ? (100 - ((promedioNudosRemanentes / d3) * 100)) : 0;
  const indiceNudos = Math.round(porcentajeNudosPerdidos);

  let coefi4 = {};
  let coefi5 = {};
  let claveTabla = fenologicoLabel;

  if (fenologicoLabel === 'r1' || fenologicoLabel === 'r2'){
    claveTabla = 'r1-r2';
  }

  if (['r1-r2', 'r2.5', 'r3', 'r3.5'].includes(claveTabla)) {
      coefi4 = danPorNudosR1?.[claveTabla]?.dan || {};
      coefi5 = danPorDesfoR1?.[claveTabla]?.dan || {};
  }

  
  const danC = parseFloat(coefi4?.[indiceNudos] ?? 0) || 0;
  const danNetoE = (danC * cpr) / 100;
  console.log("danC:", danC);
  
  const cprF = 100 - danA - danNetoE;
  const indiceDefoliacion = Math.round(d9);
  const danG = parseFloat(coefi5?.[indiceDefoliacion] ?? 0) || 0;
  const danH = (cprF * danG) / 100;

  const porcentaje = danA + danNetoE + danH;

  console.log('📊 Cálculo R (SOJA):', {
      porcePlantasPerdidas: danA,
      danC,
      danNetoE,
      danG,
      danH,
      total: porcentaje
  });

  return porcentaje.toFixed(1);
}

/**
 * Cálculo para estados R4-R6.5 de SOJA
 */
function calcularReproductivo47(datos, fenologicoLabel) {
  console.log('🔍 calcularReproductivo47 - Entrada:', {
    fenologicoLabel,
    datos
  });

  const d1 = parseFloat(datos?.dato_1) || 0;
  const d2 = parseFloat(datos?.dato_2) || 0;
  const d3 = parseFloat(datos?.dato_3) || 0;
  const d4 = parseFloat(datos?.dato_4) || 0;
  const d5 = parseFloat(datos?.dato_5) || 0;
  const d6 = parseFloat(datos?.dato_6) || 0;
  const d7 = parseFloat(datos?.dato_7) || 0;
  const d8 = parseFloat(datos?.dato_8) || 0;
  const d9 = parseFloat(datos?.dato_9) || 0;
  const d10 = parseFloat(datos?.dato_10) || 0;
  const d11 = parseFloat(datos?.dato_11) || 0;
  const d12 = parseFloat(datos?.dato_12) || 0;

  const vainasTotales = d1 + d2 + d3 + d4 + d5 + d6 + d7 + d8 + d9 + d10 + d11;
  const vainasDañadas = d1 + d2 + d4 + d6 + d8 + d10;
  const danA = vainasTotales > 0 ? (vainasDañadas / vainasTotales) * 100 : 0;
  const cprb = 100 - danA;

  const indiceDefoliacion = String(Math.round(d12));

  // ✅ Lista de estados válidos ANTES de mapear
  const fenologicosValidos = ['r4', 'r4.5', 'r5', 'r5.5', 'r6', 'r6.5'];
  
  // ✅ Verificar primero si es válido con el label original
  if (!fenologicosValidos.includes(fenologicoLabel)) {
    console.warn('⚠️ Estado fenológico no válido para R4-R6.5:', fenologicoLabel);
    return '0.0';
  }

  // ✅ Mapear después de validar
  let claveTabla = fenologicoLabel;
  
  if (fenologicoLabel === 'r5' || fenologicoLabel === 'r5.5') {
    claveTabla = 'r5-r5.5';
  }

  console.log('🔑 Buscando en danPorDesfoR4 con clave:', claveTabla);

  // ✅ Buscar en la tabla con la clave mapeada
  const coefiDefoliacion = danPorDesfoR4?.[claveTabla]?.dan || {};

  // ✅ Verificar que se encontró la tabla
  if (Object.keys(coefiDefoliacion).length === 0) {
    console.warn('⚠️ No se encontró danPorDesfoR4 para:', claveTabla);
    console.log('📋 Claves disponibles en danPorDesfoR4:', Object.keys(danPorDesfoR4 || {}));
  }

  const danG = indiceDefoliacion !== '0' 
      ? parseFloat(coefiDefoliacion?.[indiceDefoliacion] ?? 0) 
      : 0;

  const danNetoD = (cprb * danG) / 100;
  const porcentaje = danNetoD + danA;

  console.log('📊 Cálculo R4-R6.5 (SOJA):', {
      fenologicoLabel,
      claveTabla,
      dañoVainasAbiertas: danA.toFixed(1),
      cprRemanente: cprb.toFixed(1),
      indiceDefoliacion,
      danG_Tabla: danG.toFixed(1),
      danNetoD: danNetoD.toFixed(1),
      total: porcentaje.toFixed(1)
  });

  return Math.min(porcentaje, 100).toFixed(1); // ✅ No exceder 100%
}

/**
 * Cálculo para estados avanzados R8 de SOJA
 */
function calcularDañoAvanzado(datos, fenologicoLabel) {
  const d1 = parseFloat(datos?.dato_1) || 0;
  const d2 = parseFloat(datos?.dato_2) || 0;
  const d3 = parseFloat(datos?.dato_3) || 0;
  const d4 = parseFloat(datos?.dato_4) || 0;
  const d5 = parseFloat(datos?.dato_5) || 0;
  const d6 = parseFloat(datos?.dato_6) || 0;
  const d7 = parseFloat(datos?.dato_7) || 0;
  const d8 = parseFloat(datos?.dato_8) || 0;
  const d9 = parseFloat(datos?.dato_9) || 0;
  const d10 = parseFloat(datos?.dato_10) || 0;
  const d11 = parseFloat(datos?.dato_11) || 0;
  const d12 = parseFloat(datos?.dato_12) || 0;
  const d13 = parseFloat(datos?.dato_13) || 0;
  const d14 = parseFloat(datos?.dato_14) || 0;
  const d15 = parseFloat(datos?.dato_15) || 0;
  const d16 = parseFloat(datos?.dato_16) || 0;
  const d17 = parseFloat(datos?.dato_17) || 0;
  const d18 = parseFloat(datos?.dato_18) || 0;
  const d19 = parseFloat(datos?.dato_19) || 0;
  const d20 = parseFloat(datos?.dato_20) || 0;
  const d21 = parseFloat(datos?.dato_21) || 0;

  const condicionSuma = d1 + d2 + d3;
  if (condicionSuma <= 0) {
      return "";
  }

  const numerador = d1 + d2 + d4 + d6 + d8 + d10 + d12 + d14 + d16 + d18 + d20;
  const denominador = numerador + d3 + d5 + d7 + d9 + d11 + d13 + d15 + d17 + d19 + d21;
  
  if (denominador === 0) {
      return 0;
  }

  const resultado = (numerador / denominador) * 100;
  return parseFloat(resultado.toFixed(1));
}

/**
 * ============================================================================
 * CÁLCULO DE DAÑO PARA TRIGO
 * ============================================================================
 */
function calcularDañoTrigo(datos, estadoFenologico) {
  const fenologicoNum = parseInt(estadoFenologico, 10);
  
  // Mapeo de estados fenológicos de trigo
  let fenologicoLabel = 'Espigamiento (Z.50/59)'; // Default
  
  if (!isNaN(fenologicoNum)) {
    switch (fenologicoNum) {
      case 1:
        fenologicoLabel = 'Espigamiento (Z.50/59)'; // Espigamiento
        break;
      case 2:
        fenologicoLabel = 'Floración (Z.60/69)'; // Floración
        break;
      case 3:
        fenologicoLabel = 'Lechoso (Z.70/79)'; // Lechoso
        break;
      case 4:
        fenologicoLabel = 'Pastoso blando (Z.80/84)'; // Pastoso blando
        break;
      case 5:
        fenologicoLabel = 'Pastoso duro (Z.85/89)'; // Pastoso duro
        break;
      case 6:
        fenologicoLabel = 'Próx. a mudurez (Z.90/99)'; // Próx. a madurez
        break;
      default:
        fenologicoLabel = 'Espigamiento (Z.50/59)';
    }
  }

  console.log('🌾 Calculando daño TRIGO para:', fenologicoLabel);

// Extraer todos los datos (dato_1 a dato_23)
const data = {};
for (let i = 1; i <= 23; i++) {
    data[`d${i}`] = parseFloat(datos[`dato_${i}`]) || 0;
}

// Cálculo de espigas perdidas
const totenD = data.d1 + data.d2 + data.d3;
let espigasPerdidasA = 0;
if (totenD !== 0) {
  espigasPerdidasA = (data.d1 / totenD) * 100;
}

// Convertir a índice para buscar en la tabla

let porceColgadas;
if (espigasPerdidasA !== 0){
  porceColgadas = (data.d2/totenD) * 100;
}
const indiceDeTrigo = String(Math.floor(porceColgadas));

//const indiceDeTrigo = String(Math.floor(espigasPerdidasA));
console.log("indiceTrigoes: ",indiceDeTrigo);

// Obtener coeficientes de la tabla de trigo (similar a danPorDesfoR4)
// Asumiendo que tienes una tabla 'trigo' importada que tiene esta estructura:
// trigo = { 'z50-z59': { dan: { '0': 0, '1': 0.5, '2': 1.0, ... } }, ... }
let coefiTrigo = {};

// Lista de todos los estados fenológicos de trigo
const fenologicosTrigo = ['Espigamiento (Z.50/59)', 'Floración (Z.60/69)', 'Lechoso (Z.70/79)', 'Pastoso blando (Z.80/84)', 'Pastoso duro (Z.85/89)', 'Próx. a mudurez (Z.90/99)'];

if (fenologicosTrigo.includes(fenologicoLabel)) {
    coefiTrigo = trigo?.[fenologicoLabel]?.dan || {};
}

// Obtener el daño de la tabla usando el índice
const danB = indiceDeTrigo !== '0' 
    ? parseFloat(coefiTrigo?.[indiceDeTrigo] ?? 0) 
    : 0;
    console.log("danB es", danB);

const danC = espigasPerdidasA + danB;
// El resultado es el daño obtenido de la tabla
const resultado = danB;

const numerador = data.d4 + data.d6 + data.d8 + data.d10 + data.d12 + data.d14 + data.d16 + data.d18 + data.d20 + data.d22;
const denominador = data.d5 + data.d7 + data.d9 + data.d11 + data.d13 + data.d15 + data.d17 + data.d19 + data.d21 + data.d23;

let danE;
if (denominador!= 0){
  danE = (numerador/denominador)*100;
}

const danF = danE*(100-danC)/100
const danTot = danC + danF;

console.log('📊 Cálculo TRIGO:', {
    estadoFenologico: fenologicoLabel,
    totenD: totenD.toFixed(2),
    espigasPerdidasPorcentaje: espigasPerdidasA.toFixed(2),
    indiceTabla: indiceDeTrigo,
    danTabla: danB.toFixed(2),
    resultado: resultado
});

return parseFloat(danTot.toFixed(1));
}


/**
 * ============================================================================
 * CÁLCULO DE DAÑO PARA GIRASOL
 * ============================================================================
 */
function calcularDañoGirasol(datos, fenologico) {
  const fenologicoNum = parseInt(fenologico, 10);
  
  console.log('🌻 Calculando daño GIRASOL para estado:', fenologicoNum);

  let fenologicoLabel = "V1-V11";

  if (!isNaN(fenologicoNum)) {
    switch (fenologicoNum) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
      case 11:
        fenologicoLabel = 'V1-V11'; 
        break;
      case 12:
        fenologicoLabel = 'V12-Vn'; 
        break;
      case 13:
        fenologicoLabel = 'R1 (estrella)'; 
        break;
      case 14:
        fenologicoLabel = 'R2 (botón a 0,5 - 2 cm)'; 
        break;
      case 15:
        fenologicoLabel = 'R3 (botón a + de 2 cm)';
        break;
      case 16:
        fenologicoLabel = 'R4 (apertura inflorescencia)'; 
        break;
      case 17:
        fenologicoLabel = 'R5 (inicio floración)'; 
        break;
      case 18:
        fenologicoLabel = 'R6 (fin floración)'; 
        break;
      case 19:
        fenologicoLabel = 'R7 (envés capítulo inicio amarilleo)'; 
        break;
      case 20:
        fenologicoLabel = 'R8 (envés capítulo amarillo)'; 
        break;
      case 21:
        fenologicoLabel = 'R9 (brácteas amarillo/marrón)'; 
        break;
      default:
        fenologicoLabel = 'V1-V11';
    }
  }

  // Extraer todos los datos (dato_1 a dato_5)
const data = {};
for (let i = 1; i <= 5; i++) {
    data[`d${i}`] = parseFloat(datos[`dato_${i}`]) || 0;
}

// Cálculo de espigas perdidas
const totenD = data.d1 + data.d2 + data.d3;

let plantasPerdidas = 0;
if (totenD !== 0) {
  plantasPerdidas = (data.d1 / totenD) * 100;
}

let plantasImproduct = 0;
if (totenD !== 0) {
  plantasImproduct = (data.d2 / totenD) * 100;
}

// Convertir a índice para buscar en la tabla
const indiceGirasol = String(Math.floor(plantasPerdidas));

let coefiGirasol = {};

// Lista de todos los estados fenológicos de girasol
const fenologicosGirasol = ['V1-V11', 'V12-Vn', 'R1 (estrella)', 'R2 (botón a 0,5 - 2 cm)', 'R3 (botón a + de 2 cm)', 'R4 (apertura inflorescencia)', 'R5 (inicio floración)', 'R6 (fin floración)','R7 (envés capítulo inicio amarilleo)', 'R8 (envés capítulo amarillo)', 'R9 (brácteas amarillo/marrón)'];

if (fenologicosGirasol.includes(fenologicoLabel)) {
    coefiGirasol = girasolReduccion?.[fenologicoLabel]?.dan || {};
}

// Obtener el daño de la tabla usando el índice
let danA = indiceGirasol !== '0' 
    ? parseFloat(coefiGirasol?.[indiceGirasol] ?? 0) 
    : 0;
danA = danA + plantasImproduct;
console.log("DANA", danA, "fenologico label:", fenologicoLabel);
const cprB = 100-danA;
const danE = data.d4*cprB/100;
const cprF = 100 - danA - danE;

const indiceGirasolDesfo = String(Math.floor(data.d5));
let coefiDesfoGirasol = {};
if (fenologicosGirasol.includes(fenologicoLabel)) {
  coefiDesfoGirasol = girasolDesfo?.[fenologicoLabel]?.dan || {};
};

let danG = indiceGirasolDesfo !== '0' 
    ? parseFloat(coefiDesfoGirasol?.[indiceGirasolDesfo] ?? 0) 
    : 0;

const danH = danG * cprF / 100;

const danTot = danA + danE + danH;



return parseFloat(danTot.toFixed(1));
  
}


/**
 * ============================================================================
 * CÁLCULO DE DAÑO PARA MAÍZ
 * ============================================================================
 */
function calcularDañoMaiz(datos, fenologico) {
  const fenologicoNum = parseInt(fenologico, 10);
  
  console.log('🌽 Calculando daño MAÍZ para estado:', fenologicoNum);

  // Mapeo de estados fenológicos de maíz
  // 1: V1-V4, 2: V5, 3: V6, 4: V7, 5: V8, 6: V13-VT, 7: R1, 8: R2, 9: R3, 10: R4, 11: R5, 12: R6
  
  if (fenologicoNum >= 1 && fenologicoNum <= 8) {
    // Estados vegetativos
    return calcularDañoMaizVegetativo(datos, fenologicoNum);
  } else if (fenologicoNum >= 9 && fenologicoNum <= 26 ) {
    // Estados reproductivos
    return calcularDañoMaizReproductivo(datos, fenologicoNum);
  }
  
  return Math.random() * 50;
}

/**
 * Cálculo para estados vegetativos de MAÍZ
 */
function calcularDañoMaizVegetativo(datos, fenologicoNum) {
  // TODO: Implementar cuando tengas las tablas maizReduccion y maizDesfo
  
  const d1 = parseFloat(datos?.dato_1) || 0;
  const d2 = parseFloat(datos?.dato_2) || 0;
  const d3 = parseFloat(datos?.dato_3) || 0;

  console.log('📊 Cálculo V (MAÍZ):', {
    fenologico: fenologicoNum,
    d1: d1,
    d2: d2,
    d3: d3
  });
  //terminar despues
  let fenologicoLabel = 'V1-V4'; // Default
  
  if (!isNaN(fenologicoNum)) {
    switch (fenologicoNum) {
      case 1:
      case 2:
      case 3:
      case 4:
        fenologicoLabel = 'V1-V4'; 
        break;
      case 5:
        fenologicoLabel = 'V5'; 
        break;
      case 6:
        fenologicoLabel = 'V6'; 
        break;
      case 7:
        fenologicoLabel = 'V7'; 
        break;
      case 8:
        fenologicoLabel = 'V8'; 
        break;
      default:
        fenologicoLabel = 'V1-V4';
    }
  }



  const totalD = d1 + d2;
  let porcePlantasPerdidas = 0;
  if(totalD !== 0){
    porcePlantasPerdidas = (d1/totalD) * 100;
  };

  const indiceRedu = String(Math.floor(porcePlantasPerdidas));

  const fenologicosMaiz = ['V1-V4', 'V5', 'V6','V7', 'V8'];

  let coefiReduMaiz = {};

  if (fenologicosMaiz.includes(fenologicoLabel)) {
    coefiReduMaiz = reduccionMaiz?.[fenologicoLabel]?.dan || {};
  }
  
  let danA = indiceRedu !== '0' 
    ? parseFloat(coefiReduMaiz?.[indiceRedu] ?? 0) 
    : 0;

  const cpr = 100 -danA;

  const indiceDesfo = d3;

  let coefiDesfoMaiz = {};

  if (fenologicosMaiz.includes(fenologicoLabel)) {
    coefiDesfoMaiz = desfoMaiz?.[fenologicoLabel]?.dan || {};
  }

  let danC = indiceDesfo !== '0' 
    ? parseFloat(coefiDesfoMaiz?.[indiceDesfo] ?? 0) 
    : 0;
  
  const danE = danC * cpr / 100;

  const danTot = danE + danA;

  console.log('resultados:', {
    fenologico: fenologicoNum,
    cpr: cpr,
    danA: danA,
    indiceDesfo: indiceDesfo,
    danC: danC,
    danE: danE,
    danTot: danTot  
  });

  // Implementación temporal
  return danTot.toFixed(1);
}

/**
 * Cálculo para estados reproductivos de MAÍZ
 */
function calcularDañoMaizReproductivo(datos, fenologicoNum) {
    // TODO: Implementar cuando tengas las tablas maizReduccion y maizDesfo
    
    const d1 = parseFloat(datos?.dato_1) || 0;
    const d2 = parseFloat(datos?.dato_2) || 0;
    const d3 = parseFloat(datos?.dato_3) || 0;
    const d4 = parseFloat(datos?.dato_4) || 0;
    const d5 = parseFloat(datos?.dato_5) || 0;
    const d6 = parseFloat(datos?.dato_6) || 0;
  
    console.log('📊 Cálculo V (MAÍZ):', {
      fenologico: fenologicoNum,
      d1: d1,
      d2: d2,
      d3: d3,
      d4: d4,
      d5: d5,
      d6: d6
    });
    //terminar despues
    let fenologicoLabel = 'V9'; // Default
    
    if (!isNaN(fenologicoNum)) {
      switch (fenologicoNum) {
        case 9:
          fenologicoLabel = 'V9'; 
          break;
        case 10:
          fenologicoLabel = 'V10'; 
          break;
        case 11:
          fenologicoLabel = 'V11'; 
          break;
        case 12:
          fenologicoLabel = 'V12'; 
          break;
        case 13:
          fenologicoLabel = 'V13'; 
          break;
        case 14:
          fenologicoLabel = 'V14'; 
          break;
        case 15:
          fenologicoLabel = 'V15'; 
          break;
        case 16:
          fenologicoLabel = 'Inicio Florac.Fem (R1-)'; 
          break;
        case 17:
          fenologicoLabel = 'Flor Fem.Plena Barba Blanca (R1)'; 
          break;
        case 18:
          fenologicoLabel = 'Fin Flor Fem. Barba Marrón (R1+)'; 
          break;
        case 19:
          fenologicoLabel = 'Ampolla (R2)'; 
          break;
        case 20:
          fenologicoLabel = 'Lechoso Temprano (R3)'; 
          break;
        case 21:
          fenologicoLabel = 'Lechoso tardío (R3+)'; 
          break;
        case 22:
          fenologicoLabel = 'Pastoso Temprano (R4)'; 
          break;
        case 23:
          fenologicoLabel = 'Pastoso tardío (R4+)'; 
          break;
        case 24:
          fenologicoLabel = 'Identación/ Líneas Leche (R5)'; 
          break;
        case 25:
          fenologicoLabel = 'Madurez Fisiológica (R6)'; 
          break;
        case 26:
          fenologicoLabel = 'Madurez Comercial (R6+)'; 
          break;
        default:
          fenologicoLabel = '9';
      }
    }
  
  
  
    const totalD = d1 + d2;

    let danA = 0;

    if(totalD !== 0){
      danA = (d1/totalD) * 100;
    };
    
    const cprB = 100 - danA;

    const danC = (d5 / (d3*d4*5)) * 100;

    const danE = (danC * cprB) / 100;

    const cprF = 100 - danA - danE;
    const indiceDesfo = d6;
  
    const fenologicosMaiz = [
      "V1-V4",
      "V5",
      "V6",
      "V7",
      "V8",
      "V9",
      "V10",
      "V11",
      "V12",
      "V13",
      "V14",
      "V15",
      "Inicio Florac.Fem (R1-)",
      "Flor Fem.Plena Barba Blanca (R1)",
      "Fin Flor Fem. Barba Marrón (R1+)",
      "Ampolla (R2)",
      "Lechoso Temprano (R3)",
      "Lechoso tardío (R3+)",
      "Pastoso Temprano (R4)",
      "Pastoso tardío (R4+)",
      "Identación/ Líneas Leche (R5)",
      "Madurez Fisiológica (R6)",
      "Madurez Comercial (R6+)"
    ];
  
    let coefiDesfo = {};
  
    if (fenologicosMaiz.includes(fenologicoLabel)) {
      coefiDesfo = desfoMaizVR?.[fenologicoLabel]?.dan || {};
    }
    
    let danG = indiceDesfo !== '0' 
      ? parseFloat(coefiDesfo?.[indiceDesfo] ?? 0) 
      : 0;
  
    const danH = danG * cprF / 100;
  
    
    const danTot = danA + danE + danH;
  
    console.log('resultados:', {
      fenologico: fenologicoNum,
      cprF: cprF,
      danA: danA,
      indiceDesfo: indiceDesfo,
      danC: danC,
      danE: danE,
      danTot: danTot  
    });
  
    // Implementación temporal
    return danTot.toFixed(1);
  }

/**
 * ============================================================================
 * FUNCIONES AUXILIARES (mantener compatibilidad)
 * ============================================================================
 */

/**
 * Obtiene los subFenológicos disponibles para un tipo fenológico
 * @deprecated Esta función puede no ser necesaria con el nuevo sistema
 */
export function getSubFenologicosPorTipo(fenologico) {
  return [];
}

/**
 * Verifica si un subFenológico existe para un tipo fenológico dado
 * @deprecated Esta función puede no ser necesaria con el nuevo sistema
 */
export function existeSubFenologico(fenologico, subFenologico) {
  return false;
}

/**
 * Obtiene el primer subFenológico disponible para un tipo fenológico
 * @deprecated Esta función puede no ser necesaria con el nuevo sistema
 */
export function getPrimerSubFenologico(fenologico) {
  return 'sub1';
}