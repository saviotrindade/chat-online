import 'dotenv/config';
import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';

const __dirname = import.meta.dirname;

const ACTIONS = {
    BROADCAST: 'broadcast',
}

const APP_URL = process.env.APP_URL;
const APP_PORT = process.env.APP_PORT;

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use('/public', express.static('public'));
app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));

server.listen(APP_PORT, () => {
    console.log(`Servidor ouvindo a porta ${APP_PORT}!`);
});

wss.on('connection', (ws) => {

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);

            if (!data.action) return ws.send(
                    JSON.stringify({
                        status: {
                            http_status_code: 400,
                            http_status_description: 'Bad Request',
                            datails: 'The "action" property is required.'
                        }
                })
            );
    
            switch (data.action) {
                case ACTIONS.BROADCAST:
                    return ws.send(JSON.stringify( broadcastMessage(ws, data) ));
    
                default:
                    return ws.send(
                        JSON.stringify({
                            status: {
                                http_status_code: 404,
                                http_status_description: 'Not Found',
                                accepted_values: ["broadcast"],
                                datails: 'Unknown "action" property received.'
                            }
                        })
                    );
            }

        } catch (error) {
            return ws.send(JSON.stringify({
                status: {
                    http_status_code: 400,
                    http_status_description: 'Bad Request',
                    datails: 'Invalid message format'
                }
            }))
        }


    })
})


const broadcastMessage = (ws, data) => {
    try {
        if (!data || !data.userName || !data.message) return {
            status: {
                http_status_code: 400,
                http_status_description: 'Bad Request',
                details: 'The "userName" and "message" fields are requeired'
            }
        };

        wss.clients.forEach(client => {
            if ( client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(
                    JSON.stringify({
                        content: {
                            userName: data.userName,
                            message: data.message,
                            userNameColor: data.color || 'red'
                        }
                    })
                );
            }
        })
        
        return {
            status: {
                http_status_code: 200,
                http_status_description: 'OK',
                details: 'Message successfully broadcasted'
            }
        }

    } catch (error) {
        return {
            status: {
                http_status_code: 500,
                http_status_description: 'Internal Server Error',
                details: 'An unexpected error occurred'
            }
        }
    }
}
