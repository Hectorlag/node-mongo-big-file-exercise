const Records = require('./records.model');
const fileService = require('./services/fileService');

const upload = async (req, res) => {
    try {
        const { file } = req;
        
        // Validar que se subió un archivo
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        // Delegar al servicio (como Spring Boot)
        const result = await fileService.processFile(file);
        
        return res.status(200).json({
            message: 'File processed successfully',
            recordsProcessed: result.count,
            fileName: file.originalname,
            fileSize: file.size
        });
        
    } catch (error) {
        console.error('Error processing file:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            details: error.message 
        });
    }
};

const list = async (_, res) => {
    try {
        const data = await Records
            .find({})
            .limit(10)
            .lean();
                 
        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json(err);
    }
};

module.exports = {
    upload,
    list,
};