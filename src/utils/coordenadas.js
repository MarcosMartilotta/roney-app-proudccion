export const convertirADMS = (decimal, esLatitud) => {
    const absoluto = Math.abs(decimal);
    const grados = Math.floor(absoluto);
    const minutosDecimal = (absoluto - grados) * 60;
    const minutos = Math.floor(minutosDecimal);
    const segundos = ((minutosDecimal - minutos) * 60).toFixed(2);
    
    // Determinar dirección
    let direccion;
    if (esLatitud) {
      direccion = decimal >= 0 ? 'N' : 'S';
    } else {
      direccion = decimal >= 0 ? 'E' : 'O';
    }
    
    return `${grados}° ${minutos}' ${segundos}" ${direccion}`;
  };