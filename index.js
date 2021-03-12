function createGuid() {  
    function _p8(s) {  
        var p = (Math.random().toString(16)+"000000000").substr(2,8);  
        return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;  
    }  
    return _p8() + _p8(true) + _p8(true) + _p8();  
}  

async function generateDirectLineToken() {
    const secret = 'U9Yp2lxxBKk.UIc8VTbfoRd6_Gkz48y5TE6bZMhpnwSKhnNsvUDxoVo';
    var guid = createGuid();
    const response = await fetch('https://directline.botframework.com/v3/directline/tokens/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer' + ' ' + secret
        },
        body: JSON.stringify(
            {
                "user": {
                    "id": "dl-" + guid
                }
            })
    })
    if (response.status === 200) {
        var obj = JSON.parse(await response.text());
        OpenChat(obj.token);
    }
    else {
        console.log(response.statusText);
    }
}

async function refreshDirectLineToken(token) {
    const response = await fetch('https://directline.botframework.com/v3/directline/tokens/refresh', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer' + ' ' + token
        },
    })
    if (response.status === 200) {
        var obj = JSON.parse(await response.text());
        OpenChat(obj.token);
    }
    else {
        console.log(response.statusText);
    }
}

function CloseChat() {
    document.getElementById("chatbox").style.display = "none";
    document.getElementById("chatbutton").style.display = "flex";
}

function OpenChat(token) {
    document.getElementById("chatbutton").style.display = "none";
    document.getElementById("chatbox").style.display = "block";

    // Get welcome message
    // We are using a customized store to add hooks to connect event
    const store = window.WebChat.createStore({}, ({ dispatch }) => next => action => {
        //console.log(action);
        if (action.type === 'DIRECT_LINE/CONNECT_FULFILLED') {
            dispatch({
                type: 'WEB_CHAT/SEND_EVENT',
                payload: {
                    name: 'webchat/join',
                    value: { language: window.navigator.language }
                }
            });
        }

        return next(action);
    });

    window.WebChat.renderWebChat(
        {
            directLine: window.WebChat.createDirectLine({
            token: token
        }),
        store,
        },
        document.getElementById('chatbody')
    );
}