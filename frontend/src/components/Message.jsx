import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import add from "../img/bluebird_56.png";
import add1 from "../img/robbin.jpg";
import add2 from "../img/robbin2.jpg";
import add3 from "../img/robbin3.jpg";
import add4 from "../img/bluebird.png";
import { doc, onSnapshot, query, collection, orderBy, startAt, endAt, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { getDatabase, onValue, ref } from "firebase/database";


const Message = ({ message }) => {

    const { currentUser } = useContext(AuthContext)
    const { data } = useContext(ChatContext)

    const ref2 = useRef();

    useEffect(() => {
        ref2.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);

    var idSeparadas = []
    const misIDs = data.user.uid
    idSeparadas = misIDs.split(',')
    idSeparadas.pop()

    const [chats, setChats] = useState([]);
    const [misUsuarios, setMisUsuarios] = useState([]);
    const [UUsuarios, setUUsuarios] = useState([]);

    useEffect(() => {
        const getChats = () => {
            const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
                setChats(doc.data())
            });

            return () => {
                unsub();
            };
        };
        currentUser.uid && getChats()
    }, [currentUser.uid]);

    const chatsDelUsuarioActual = Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => (
        chat[1].userInfo.uid
    ))



    //Número 3 para probar
    const rooms = []
    const qVacio = query(
        collection(db, "users"),
        //where("displayName", "==", username)
        orderBy('displayName'), startAt(""), endAt("" + '\uf8ff')
    );

    const myCambio = async () => {
        const querySnapshot = await getDocs(qVacio);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            rooms.push(doc.data())
        });

        //Mejorado
        // rooms = querySnapshot.map((doc) => {
        //     // doc.data() is never undefined for query doc snapshots
        //     return{
        //         doc,
        //     }

        // });

        setMisUsuarios(rooms)
    }




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
    }


    // for(let i = 0; i<idSeparadas2.length; i++){
    //     if(idSeparadas2[i] === ""){
    //         idSeparadas2.splice(i,0)
    //     }
    // }
    idSeparadas2 = idSeparadas2.filter((item) => item !== '')

    //Sin usuario actual
    var idDelChatSinUA = ""
    for (let i = 0; i < idSeparadas2.length; i++) {
        idDelChatSinUA = idDelChatSinUA + idSeparadas2[i]
    }


    idSeparadas2.push(currentUser.uid)

    idSeparadas2.sort().reverse()

    console.log("Id separadas:\n")
    console.log(idSeparadas2)

    var indiceDeBusqueda = ""
    for (let i = 0; i < idSeparadas2.length; i++) {
        indiceDeBusqueda = indiceDeBusqueda + idSeparadas2[i]
    }
    console.log("Mi indice de busqueda:")
    console.log(indiceDeBusqueda)


    data.chatId = indiceDeBusqueda

    //TODO PARA MOSTRAR IMÁGENES
    if (misUsuarios.length <= 0) {
        myCambio() //Descomentar para las imágenes de los chats
        //console.log("Usuarios guardados")

    } else {
        // console.log("Usuarios pre-consultados")
        // console.log(misUsuarios.length)
    }

    const fotosDeChatDelUsuarioActual = Object.entries(misUsuarios)?.sort((a, b) => b[1].date - a[1].date).map((chat) => (
        //chat[1].userInfo.photoURL
        chat
    ))

    // console.log(message.senderId)
    // console.log(chatsDelUsuarioActual)
    // console.log(fotosDeChatDelUsuarioActual)

    //console.log(message)
    //console.log(message.date.toDate())
    var currentTimestamp = Date.now()
    var date = new Intl.DateTimeFormat('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' }).format(message.date.toDate())
    var today = new Intl.DateTimeFormat('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' }).format(currentTimestamp)
    let date1 = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(message.date.toDate())
    //var timestemp = new Date( 1665620418 );
    //var formatted = timestemp.format("dd/mm/yyyy hh:MM:ss");
    //console.log(date)
    //const today = new Date();
    if (today === date) {
        //console.log(1);
        date = 'HOY';
    }


    var imagenURL = ""


    if (message.senderId === currentUser.uid) {
        imagenURL = currentUser.photoURL
    } else {
        //imagenURL =  data.user.photoURL
        // for (let i = 0; i < chatsDelUsuarioActual.length; i++) {
        // if (message.senderId == chatsDelUsuarioActual[i]) {
        //imagenURL = fotosDeChatDelUsuarioActual[i]

        for (let k = 0; k < fotosDeChatDelUsuarioActual.length; k++) {
            if (fotosDeChatDelUsuarioActual[k][1].uid == message.senderId) {
                imagenURL = fotosDeChatDelUsuarioActual[k][1].photoURL
            }
        }

        // break;
        // }
        // }
    }

    // const desci = Object.entries(chats)?.filter(chat => chat[1].userInfo.uid == idDelChatSinUA).map((chat) => (
    //     chat[1].encriptado
    // ))
    var estaEncriptado = message.encriptado

    console.log(estaEncriptado)

    var miTexto = message.miTextoEncriptado + ""
    var textoDelMensaje = ""
    if (estaEncriptado == "Encriptado") {
        for (let i = 0; i < miTexto.length; i++) {
            let asciiDelCaracter = 0
            asciiDelCaracter = miTexto[i].charCodeAt(0);
            asciiDelCaracter--

            let miLetraSiguiente = String.fromCharCode(asciiDelCaracter);

            textoDelMensaje += miLetraSiguiente
        }
    } else {
        textoDelMensaje = miTexto
    }

    const [misUsuariosRealTime2, setMisURT2] = useState(null);
    if (misUsuariosRealTime2 == null) {
        const db = getDatabase();
        const myUsers = ref(db, 'users/');
        onValue(myUsers, (snapshot) => {
            const data = snapshot.val();
            setMisURT2(data);
        });
    }
    console.log(misUsuariosRealTime2)


    function myUser(miUser) {

        console.log(miUser)

        if (misUsuariosRealTime2 != undefined) {

            if (misUsuariosRealTime2[miUser]) {
                if (misUsuariosRealTime2[miUser]["estado"] == "Conectado") {
                    return (
                        <div>
                            <div className="online2"></div>
                        </div>
                    )
                }
            }


        }

    }

    return (
        <div
            ref2={ref2}
            className={`message ${message.senderId === currentUser.uid && "owner"}`}>
            <div className="messageInfo">
                <img src={
                    imagenURL
                } />
                {myUser(message.senderId)}

                <p>{date}</p>
                <p>{date1}</p>
            </div>
            <div className="messageContent">
                <p>{textoDelMensaje.startsWith('http://') || textoDelMensaje.startsWith('https://') ? (
                    <a href={textoDelMensaje} target="_blank">{textoDelMensaje}</a>
                ) : (textoDelMensaje)
                }
                    {
                        message.img ?
                            <div>
                                {textoDelMensaje && <br></br>}
                                <img src={message.img} alt="" />
                            </div>
                            :
                            message.file ?
                                <div>
                                    {textoDelMensaje && <br></br>}
                                    <embed src={message.file} width="100%" />
                                </div>
                                :
                                <div></div>

                    }
                </p>
            </div>
        </div>

    )
}

export default Message