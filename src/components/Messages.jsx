import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import Message from "./Message";

const Messages = () => {

    const [messages, setMessages] = useState([])
    const { data } = useContext(ChatContext);

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
            doc.exists() && setMessages(doc.data().messages)
        })

        return () => {
            unSub()
        }
    }, [data.chatId])
    // console.log("Mi data.chatId es:")
    // console.log(data.chatId)

    function InsertarIconos(data) {
        if (data.user?.displayName !== undefined) {
            return (

                <div className="messages">
                    {messages.map((m) => (
                        <Message message={m} key={m.id} />
                    ))}
                </div>


            );
        } else {
            return (
                <div className="messages centradito">
                    <div className="myTextoAviso"><span>Seleccione un chat o inicie una nueva conversación</span></div>
                </div>
                
            );
        }
    }

    return (
        InsertarIconos(data)
    )
}

export default Messages