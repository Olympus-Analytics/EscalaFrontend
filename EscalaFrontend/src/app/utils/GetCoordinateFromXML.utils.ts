export async function getCoordinatesFromAuxXml(xmlData: string, imageWidth: number, imageHeight: number) {
  try {
    // Hacer solicitud HTTP para obtener el contenido del archivo XML


    // Parsear el archivo XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, 'application/xml');

    // Extraer el texto de la etiqueta <GeoTransform>
    const geoTransformText = xmlDoc.querySelector('GeoTransform')?.textContent;
    if (!geoTransformText) throw new Error('No se encontró GeoTransform en el XML.');

    // Convertir la cadena de GeoTransform en un array de números
    const geoTransform = geoTransformText.split(',').map(Number);
    const [x0, xRes, , y0, , yRes] = geoTransform;

    // Calcular las coordenadas de las esquinas
    const xmin = x0;
    const ymax = y0;
    const xmax = x0 + imageWidth * xRes;
    const ymin = y0 + imageHeight * yRes;

    return {
      topLeft: [ymax, xmin],
      topRight: [ymax, xmax],
      bottomLeft: [ymin, xmin],
      bottomRight: [ymin, xmax]
    };
  } catch (error) {
    console.error('Error al obtener coordenadas desde el archivo XML:', error);
    throw error;
  }
}
