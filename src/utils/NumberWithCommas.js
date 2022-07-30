"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const numberWithCommas = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
exports.default = numberWithCommas;
