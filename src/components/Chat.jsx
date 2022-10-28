import React, { useEffect, useContext, useState } from "react";
import Cam from "../img/cam_robbin.png";
import Add from "../img/add_robbin.png";
import More from "../img/callicon.png";
import Messages from "./Messages";
import Input from "./Input";
import add from "../img/bluebird.png";
import { ChatContext } from "../context/ChatContext";
import Swal from 'sweetalert2'
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, query, where, onSnapshot, orderBy, startAt, endAt, getDocs, getDoc, doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { connectStorageEmulator } from "firebase/storage";

const Chat = () => {

    const { data } = useContext(ChatContext);
    const { currentUser } = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext);
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState("");

    var valorDelInput = "";

    const handleSearch = async () => {
        console.error("Usuario: " + username)


        const q = query(
            collection(db, "users"),
            //where("displayName", "==", username)
            orderBy('displayName'), startAt(valorDelInput), endAt(valorDelInput + '\uf8ff')

        );



        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            setUser(doc.data())
        });
        //console.error(user.uid)

    }

    const handleKey = (e) => {
        e.code === "Enter" && handleSearch();

    };

    const agregar = (e) => {
        Swal.fire({
            title: 'Escribe el nombre del contacto para agregarlo',
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Agregar',
            cancelButtonText: 'Cancelar',
            showLoaderOnConfirm: true,
            preConfirm: (login) => {
                return (
                    valorDelInput = login,
                    setUsername(login)
                )
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.value != "" && result.isConfirmed) {
                //Mandó correctamente el nombre del usuario
                console.log("Nombre de usuario (input): " + valorDelInput)
                //console.error("Nombre de usuario: " + username)

                //console.error("Nombre de usuario: "+username)
                handleSearch()
                funcionQueAgrega(user)

            } else if (result.isDismissed) { } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'No ingresó nombre de usuario',
                    showDenyButton: true,
                    text: "Ingrese el nombre de usario a agregar",

                    confirmButtonText: 'Reintentar',
                    denyButtonText: `Cancelar`,

                }).then((result) => {
                    if (result.isConfirmed) {
                        agregar()
                    } else if (result.isDenied) {
                        Swal.fire({
                            title: 'No se creó el grupo',
                            icon: 'info',
                            confirmButtonText: 'Aceptar',
                        })
                    }
                })
            }
            //console.log(valorDelInput)
        })

    }

    const [chats, setChats] = useState([]);
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

    const funcionQueAgrega = (e) => {
        //Se crea el grupo
        //TODO
        //dispatch({ type: "CHANGE_USER", payload: e });
        //console.error(username)

        const combineIdGroup =
            currentUser.uid > data.chatId
                ? currentUser.uid + data.chatId
                : data.chatId + currentUser.uid;

        console.log(data.chatId)
        console.log(combineIdGroup)
        console.log(user)



        // Se confirma que se creo el grupo
        Swal.fire({
            icon: 'success',
            title: 'Se ha creado el grupo',
            text: "Se agregó a " + valorDelInput,
            confirmButtonText: 'Aceptar',
        })
    }

    const llamada = (e) => {
        Swal.fire({
            icon: 'success',
            title: '¡Botón de llamada funcionando!',
            confirmButtonText: 'Aceptar',
        })

    }

    const videollamada = (e) => {
        Swal.fire({
            icon: 'success',
            title: '¡Botón de videollamada funcionando!',
            confirmButtonText: 'Aceptar',
        })

    }


    function InsertarIconos(data) {

        if (data.user?.displayName !== undefined) {
            return (
                <div className="chatInfo">
                    <img className="img2" src={data.user?.photoURL} alt="" />
                    <span>{data.user?.displayName}</span>

                    <div className="chatIcons">
                        <img src={More} alt="" onClick={llamada} />
                        <img src={Cam} alt="" onClick={videollamada} />
                        <img src={Add} alt="" onClick={agregar} />

                    </div>
                </div>
            );
        } else {
            return (
                <div className="chatInfo">

                </div>
            );
        }


    }


    return (
        <div className="chat">

            {InsertarIconos(data)}

            <Messages />
            <Input />
        </div>
    )
}

export default Chat