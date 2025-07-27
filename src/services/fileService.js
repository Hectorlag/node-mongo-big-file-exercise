const fs = require('fs');
const path = require('path');
const Records = require('../records.model');

class FileService {
    
    async processFile(file) {
        try {
            console.log('Procesando archivo:', file.originalname);
            console.log('Tamaño:', file.size, 'bytes');
            
            // Leer archivo CSV
            const csvData = fs.readFileSync(file.path, 'utf8');
            
            // Dividir en líneas
            const lines = csvData.split('\n');
            
            // Remover header (primera línea)
            const headers = lines[0].split(',');
            const dataLines = lines.slice(1).filter(line => line.trim() !== '');
            
            console.log('Total de líneas a procesar:', dataLines.length);
            
            // Parsear y guardar registros
            const records = [];
            for (const line of dataLines) {
                const values = line.split(',');
                
                const record = {
                    id: parseInt(values[0]),
                    firstname: values[1],
                    lastname: values[2], 
                    email: values[3],
                    email2: values[4],
                    profession: values[5]
                };
                
                records.push(record);
            }
            
            // Guardar en MongoDB por lotes
            await Records.insertMany(records);
            
            console.log('Registros guardados:', records.length);
            
            return { message: 'Archivo procesado', count: records.length };
            
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
}

module.exports = new FileService();