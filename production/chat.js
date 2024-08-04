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
export function sendMessage(message) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = 'https://7103.api.greenapi.com/waInstance7103941322/sendMessage/c7bdcaa7cd2447798f396eede68a7b40b81bdd505c96410c85';
        yield fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'chatId': '120363301897094419@g.us',
                'message': message
            })
        }).then(e => e.text()).then(e => console.log(e));
    });
}
