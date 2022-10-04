var request = require('request');
var options = 
{
    'method': 'POST',
    'url': 'https://sandbox-api.sendchamp.com/api/v1/whatsapp/template/send',
    'headers': {
        'Accept': 'application/json',
        'Authorization': 'Bearer SECRET_KEY'
    },
    body: JSON.stringify({
        "recipient": "750782787",
        "type": "template",
        "template_code": "TEMPLATE_CODE",
        "sender": "9370510109",
        "custom_data": {
            "body": {
                "1": "Damilola",
                "2": "Olotu",
                "3": "Lagos"
            }
        }
    })

};
request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
});

