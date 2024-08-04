import "dotenv/config";

export async function sendMessage(message: string): Promise<void> {
    const url: string = 'https://7103.api.greenapi.com/waInstance7103941322/sendMessage/c7bdcaa7cd2447798f396eede68a7b40b81bdd505c96410c85';
  
    await fetch(
        url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'chatId': '120363301897094419@g.us',
                'message': message
            })
        }
    ).then(e => e.text()).then(e => console.log(e));
}