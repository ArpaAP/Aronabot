"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentModel = exports.StudentSchema = void 0;
const mongoose_1 = require("mongoose");
exports.StudentSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    shortName: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    stars: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    ments: {
        intro: {
            type: String,
            required: true
        }
    },
    belong: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Organization'
    },
    club: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Club'
    },
    grade: {
        type: Number,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    birth: {
        type: String,
        required: true
    },
    hobby: {
        type: String
    },
    defaultStats: {
        health: {
            type: Number,
            required: true
        },
        attack: {
            type: Number,
            required: true
        },
        defense: {
            type: Number,
            required: true
        },
        healing: {
            type: Number,
            required: true
        },
        hit: {
            type: Number,
            required: true
        },
        dodge: {
            type: Number,
            required: true
        },
        critical: {
            type: Number,
            required: true
        },
        criticalResistance: {
            type: Number,
            required: true
        },
        criticalDamage: {
            type: Number,
            required: true
        },
        criticalDamageResistance: {
            type: Number,
            required: true
        },
        stability: {
            type: Number,
            required: true
        },
        range: {
            type: Number,
            required: true
        },
        crowdControlEnhancement: {
            type: Number,
            required: true
        },
        crowdControlResistance: {
            type: Number,
            required: true
        },
        recoveryEffectEnhancement: {
            type: Number,
            required: true
        }
    },
    illustrator: {
        type: String
    },
    voiceActor: {
        type: String
    }
}, { collection: 'students' });
exports.StudentModel = (0, mongoose_1.model)('Student', exports.StudentSchema);
exports.default = exports.StudentModel;
