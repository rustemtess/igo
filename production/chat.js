var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import "dotenv/config";
export function getLastInCommngMessage(chatId_1) {
    return __awaiter(this, arguments, void 0, function* (chatId, count = 1) {
        var _a, _b, _c;
        const url = (_c = (_b = (_a = process.env.API_URL) !== null && _a !== void 0 ? _a : '' +
            process.env.ID_INSTANCE) !== null && _b !== void 0 ? _b : '' +
            '/' +
            'getChatHistory' +
            '/' +
            process.env.API_KEY) !== null && _c !== void 0 ? _c : '';
        const result = yield fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'chatId': chatId,
                'count': count
            })
        }).then(response => response.json());
        return (result[0].type === 'incoming') ? result[0] : false;
    });
}
