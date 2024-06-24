const express = require('express');
const app = express();

const PORT = 8080;
const AUTH_CODE = '1234567';
const TOKEN = 'tokenExchangeForAuthCode';

app.get('/authorize', (req, res) => {
    console.log("/authorize: validating client app creds...", req.query);
    res.sendFile('views/decision_page.html', { root: __dirname })
});

app.get('/decision/:decisionValue', async (req, res) => {
    console.log("/decision:", req.params['decisionValue']);
    if (req.params['decisionValue'] === "YES") {
        res.redirect(`http://localhost:3001/callback?code=${AUTH_CODE}`)
    } else {
        res.send("User denied access");
    }
});

app.get('/token', (req, res) => {
    console.log("/token: Authorization code", req.query.code);
    if (AUTH_CODE !== req.query.code) {
        res.status(401).send("auth code does not match");
    } else {
        res.json({
            access_token: TOKEN
        });
    }
});

app.listen(PORT, () => {
    console.log(`authorization server listening at http://localhost:${PORT}`);
});
