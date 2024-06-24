const express = require('express');
const app = express();

const PORT = 3001;

app.get("/loginpage", (_, res) => {
    res.sendFile('views/login_page.html', { root: __dirname })
});

app.get('/login', async (_, res) => {
    console.log("/login: validating creds...");
    res.redirect("http://localhost:8080/authorize?response_type=code&client_id=ABC&client_secret=123&redirect_uri=");
});

app.get('/callback', async (req, res, next) => {
    try {
        console.log("/callback: Authorization code:", req.query.code);
        const response = await fetch(`http://localhost:8080/token?code=${req.query.code}`);
        const token  = await response.json();
        console.log("/callback: storing token", token);
        res.redirect("http://localhost:3001/oauthsuccess");
    } catch (err) {
        next(err);
    }
});

app.get('/oauthsuccess', (_, res) => {
    res.send("Oauth successful. \nClient stored access tokens for future use");
});

app.use((err, _, res, _2) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error', err_stack: err.stack });
});

app.listen(PORT, () => {
    console.log(`Client app listening at http://localhost:${PORT}`);
});