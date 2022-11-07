import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import Message from "./Message";
import { AuthContext } from "../context/AuthContext";

const Messages = () => {

    const { currentUser } = useContext(AuthContext)
    const [messages, setMessages] = useState([])
    const { data } = useContext(ChatContext);

    if (data.user.uid != undefined) {
        const misIDs = data.user.uid
        var idSeparadas2 = []
        idSeparadas2 = misIDs.split(',')

        var idGigante = idSeparadas2[0]
        var cantCaracteres = idGigante.length
        var cantDeSep = cantCaracteres / 28
        var recorridos = 0

        var inicio = 0, fin = 28

        for (let i = 0; i < cantDeSep; i++) {
            idSeparadas2[i] = idGigante.substring(inicio, fin)
            inicio = fin
            fin += 28
            recorridos++
        }


        // for(let i = 0; i<idSeparadas2.length; i++){
        //     if(idSeparadas2[i] === ""){
        //         idSeparadas2.splice(i,0)
        //     }
        // }
        idSeparadas2 = idSeparadas2.filter((item) => item !== '')


        idSeparadas2.push(currentUser.uid)

        idSeparadas2.sort().reverse()


        //idSeparadas2.length = idSeparadas2.length - 1

        console.log("Id separadas:\n")
        console.log(idSeparadas2)

        var indiceDeBusqueda = ""
        for (let i = 0; i < idSeparadas2.length; i++) {
            indiceDeBusqueda = indiceDeBusqueda + idSeparadas2[i]
        }
        console.log("Mi indice de busqueda:")
        console.log(indiceDeBusqueda)
        console.log(recorridos)

        data.chatId = indiceDeBusqueda
    }








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