"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const skillDescriptionFormat = (description, variables, level) => {
    return Object.entries(variables).reduce((prev, current) => prev.replace(`\${${current[0]}}`, `**${current[1][level - 1]}**`), description);
};
exports.default = skillDescriptionFormat;
