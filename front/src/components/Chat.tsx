import React, { useEffect, useState} from 'react'
import io, { Socket } from 'socket.io-client'

const Mapping: React.FC = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const ioClient = io('http://localhost:3000', {
            autoConnect: false,
            transports: ['websocket', 'polling'],
        });
        console.log('nova')
        if (!ioClient.connected) {
            ioClient.connect();
        }

        ioClient.on('user-joined', (data: { message: string }) => {
            setMessages((prev) => [...prev, `🔵 ${data.message}`]);
          });
      
        ioClient.on('user-left', (data: { message: string }) => {
          setMessages((prev) => [...prev, `🔴 ${data.message}`]);
        });

        ioClient.on('message', (data: {message: string, clientId: string}) => {
            if (ioClient.id === data.clientId) return;
            setMessages((prev) => [...prev, `💬 ${data.clientId}: ${data.message}`]);
          });

        setSocket(ioClient);

        return () => {
            ioClient.disconnect();
        };
    }, [])

    const sendMessage = () => {
        if (socket && inputMessage.trim() !== '') {
            console.log('envia')
            socket.emit('message', inputMessage);
          setMessages((prev) => [...prev, `🟢 Você: ${inputMessage}`]);
          setInputMessage('');
        }
      };
    
      return (
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'start',
            alignItems: 'center',
            backgroundColor: '#f0f0f0',
          }}
        >
          <h1 style={{ color: 'orange', marginBottom: '20px' }}>Chat</h1>
          <div
            style={{
              width: '80%',
              maxWidth: '600px',
              height: '400px',
              overflowY: 'auto',
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '10px',
              backgroundColor: '#fff',
              marginBottom: '20px',
            }}
          >
            {messages.map((msg, index) => {
              const parts = msg.split(':');
              const userName = parts[0];
              const messageContent = parts.slice(1).join(':').trim();

              return (
                <div key={index} style={{ marginBottom: '10px', wordWrap: 'break-word' }}>
                  <strong>{userName}</strong>: {messageContent}
                </div>
              );
            })}
          </div>
          <div
            style={{
              display: 'flex',
              width: '80%',
              maxWidth: '600px',
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                marginRight: '10px',
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                padding: '10px 20px',
                backgroundColor: 'orange',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Enviar
            </button>
          </div>
        </div>
      );
    };

export default Mapping
