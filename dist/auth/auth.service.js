"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
let AuthService = class AuthService {
    constructor(httpService) {
        this.httpService = httpService;
    }
    sign(body) {
        const crypto = require("crypto");
        const client_key = "LV4EkhlTiHL7dIqfxaDrVHMEzkvElxFi";
        const client_secret = "zgnh0TK_XyH@:0NS5TQ90nlC:onqTeXtGWlILuiV~dO~Q6mnqImzHhvaZ_wgbCCm";
        const timestamp = Date.now();
        function base64URLEncode(data) {
            const base64 = Buffer.from(data, "utf8").toString("base64");
            return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
        }
        function sign(secret, payload) {
            const signature = crypto
                .createHmac("sha256", client_secret)
                .update(payload)
                .digest("hex");
            return signature;
        }
        const payload = timestamp + '.' + client_key + '.' + JSON.stringify(body);
        console.log("payload: ", payload);
        const encodedPayload = base64URLEncode(payload);
        console.log("encoded_payload: ", encodedPayload);
        const signature = sign(client_secret, encodedPayload);
        console.log("signature: ", signature);
        let url = "https://api.tiki.vn/tiniapp-open-api/oauth/auth/token";
        this.httpService.post(url, Object.assign({}, body), {
            headers: {
                "Content-Type": "application/json",
                "X-Tiniapp-Client-Id": client_key,
                "X-Tiniapp-Signature": signature,
                "X-Tiniapp-Timestamp": timestamp
            }
        }).toPromise().then((r) => {
            console.log("success", r.data);
        }).catch(e => {
        });
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map