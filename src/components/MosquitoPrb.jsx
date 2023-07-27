import React, { useEffect, useState } from 'react'
// import mqtt from 'mqtt';
// const client = mqtt.connect('mqtt://test.mosquitto.org');
// client.subscribe("RickiTemp");
// console.log("Client subscribed ");

// const MosquitoPrb = () => {

//     const [connectionStatus, setConnectionStatus] = useState(false);
//     const [messages, setMessages] = useState([]);

//     useEffect(() => {
//         client.on('connect', () => setConnectionStatus(true));
//         client.on('message', (topic, payload, packet) => {
//             setMessages(messages.concat(payload.toString()));
//             console.log(messages)
//         });
//     }, []);

//     return (
//         <>
//             <h2>Mosquito</h2>
//             {
//                 messages.map((message) => (
//                     <h3>{message}</h3>
//                 ))
//             }
//         </>
//     )
// }

// export default MosquitoPrb