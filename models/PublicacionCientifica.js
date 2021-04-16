const mongoose = require('mongoose');

const PublicacionesCientificasSchema = mongoose.Schema({
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
    tipoPublicacion: {
        type: String,
        trim: true
    },
    authors: {
        type: String,
        trim: true
    },

    year: {
        type: String,
        trim: true
    },
    revista: {
        type: String,
        trim: true
    },
    volumen: {
        type: String,
        trim: true
    },
    factorImpacto: {
        type: Number,
        trim: true
    },
    q: {
        type: Number,
        trim: true
    },
    creado: {
        type: Date,
        default: Date.now()
    }
});
PublicacionesCientificasSchema.index({ authors: 'text' });

module.exports = mongoose.model('PublicacionCientifica', PublicacionesCientificasSchema);