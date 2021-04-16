const mongoose = require('mongoose');

const PublicacionesSchema = mongoose.Schema({
    doi: {
        type: String,
        trim: true
    },
    title: {
        type: String,
        trim: true
    },
    unidad: {
        type: String,
        trim: true
    },
    year: {
        type: String,
        trim: true
    },
    authors: {
        type: String,
        trim: true
    },
    revista: {
        type: String,
        trim: true
    },

    tipoPublicacion: {
        type: String,
        trim: true
    },
    creado: {
        type: Date,
        default: Date.now()
    }
});
PublicacionesSchema.index({ authors: 'text' });
module.exports = mongoose.model('Publicacion', PublicacionesSchema);