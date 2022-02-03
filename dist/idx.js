"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIDX = void 0;
var idx_1 = require("@ceramicstudio/idx");
function createIDX(ceramic) {
    var idx = new idx_1.IDX({ ceramic: ceramic });
    window.idx = idx;
    return idx;
}
exports.createIDX = createIDX;
