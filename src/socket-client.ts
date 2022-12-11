import { Manager, Socket } from 'socket.io-client';

let socket: Socket;

export const connectToServer = (token: string) => {

    const manager = new Manager('https://teslo-shop-julianguerra.up.railway.app/socket.io/socket.io.js', {
        extraHeaders: {
            authentication: token
        }
    });
    socket?.removeAllListeners(); //Método para borrar los listernes y limpiar los sockets
    socket = manager.socket('/');
    addListeners();

}

const addListeners = () => {

    const clielUl = document.querySelector('#clients-ul')!;
    const messageForm = document.querySelector<HTMLFormElement>('#message-form')!;
    const messageInput = document.querySelector<HTMLInputElement>('#message-input')!;
    const messagesUl = document.querySelector<HTMLUListElement>('#messages-ul')
    const serverStatusLabel = document.querySelector('#server-status')!;

    socket.on('connect', () => {
        serverStatusLabel.innerHTML = 'Connected!';
    });

    socket.on('disconnect', () => {
        serverStatusLabel.innerHTML = 'Disconnected!';
    });

    socket.on('clients-update', (clients: string[]) => {
        let clientsHtml = '';
        clients.forEach(clientId => {
            clientsHtml += `
                <li>${clientId}</li>
            `
        })
        clielUl.innerHTML = clientsHtml;
    });

    messageForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (messageInput.value.trim().length <= 0) return;
        socket.emit('message-from-client', {
            id: 'Yo!!',
            message: messageInput.value
        })
        console.log(socket);
        messageInput.value = '';
    })

    socket.on('message-from-server', (payload: { fullName: string, message: string }) => {
        const newMessage = `
        <li>
            <strong>${payload.fullName}: </strong>
            <span>${payload.message}</span>
        </li>
        `
        const li = document.createElement('li');
        li.innerHTML = newMessage;
        messagesUl?.append(li);
    })

}