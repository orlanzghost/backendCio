const mongoose = require('mongoose');

const PublicacionCientificaSchema = mongoose.Schema({

    doi: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'PublicacionCientifica'
    },
    factorImpacto: {
        type: Array,
        required: true
    },
    q: {
        type: Array,
        required: true
    },

    creado: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Impacto', PublicacionCientificaSchema);