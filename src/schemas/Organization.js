"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationSchema = void 0;
const mongoose_1 = require("mongoose");
exports.OrganizationSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    englishName: {
        type: String,
        required: true
    }
}, { collection: 'organizations' });
const OrganizationModel = (0, mongoose_1.model)('Organization', exports.OrganizationSchema);
exports.default = OrganizationModel;
