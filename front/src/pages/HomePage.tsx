import React from 'react'
import Chat from '../components/Chat'

const HomePage: React.FC = () => {
    return (
        <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <h1 style={{ fontSize: '4em' }}>PDI Websocket</h1>
            <Chat />
        </div>
    )
}

export default HomePage
