const { OAuth2Client } = require("google-auth-library");


const client = new OAuth2Client('97587997178-d4m3g8lhl9g3flctnvmpmdonk5tgo9c7');

async function verify() {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: "97587997178-d4m3g8lhl9g3flctnvmpmdonk5tgo9c7" // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload["sub"];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
}
verify().catch(console.error);