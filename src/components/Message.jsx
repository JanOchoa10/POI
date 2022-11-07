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

const Message = ({ message }) => {

    const { currentUser } = useContext(AuthContext)
    const { data } = useContext(ChatContext)

    const ref = useRef();

    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
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

    //TODO probar para cargar los usuarios

    // Número 1 para probar
    // useEffect(() => {
    //     const getUsers = () => {
    //         const unsub = onSnapshot(doc(db, "users"), (doc) => {
    //             setUUsuarios(doc.data())
    //         });

    //         return () => {
    //             unsub();
    //         };
    //     };
    //     getUsers()
    // }, []);

    // const UsUsuarios = Object.entries(UUsuarios)?.sort((a, b) => b[1].date - a[1].date).map((chat) => (
    //     chat[1].userInfo.uid
    // ))

    // Número 2 para probar
    // useEffect(() => {
    //     const myCambio = async () => {

    //         const rooms = []
    //         const qVacio = query(
    //             collection(db, "users"),
    //             //where("displayName", "==", username)
    //             orderBy('displayName'), startAt(""), endAt("" + '\uf8ff')
    //         );

    //         const querySnapshot = await getDocs(qVacio);
    //         querySnapshot.forEach((doc) => {
    //             // doc.data() is never undefined for query doc snapshots
    //             rooms.push(doc.data())
    //         });
    //         setUUsuarios(rooms)
    //     }
    //     myCambio()
    // }, []);

    // const UsUsuarios = Object.entries(UUsuarios)?.sort((a, b) => b[1].date - a[1].date).map((chat) => (
    //     chat[1].userInfo.uid
    // ))

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
    //TODO PARA MOSTRAR IMÁGENES
    if (misUsuarios.length <= 0) {
       myCambio() //Descomentar para las imágenes de los chats
        console.log("Usuarios guardados")
    } else {
        console.log("Usuarios pre-consultados")
        console.log(misUsuarios.length)
    }

    //console.log(misUsuarios)
    //myCambio()

    // useEffect(() => {
    //     const getChats = () => {
    //         const unsub = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
    //             setMisUsuarios(doc.data())
    //         });

    //         return () => {
    //             unsub();
    //         };
    //     };
    //     currentUser.uid && getChats()
    // }, [currentUser.uid]);
    //myCambio()

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

    return (
        <div
            ref={ref}
            className={`message ${message.senderId === currentUser.uid && "owner"}`}
        >
            <div className="messageInfo">
                <img src={
                    imagenURL
                }
                    alt="" />
                <p>{date}</p>
                <p>{date1}</p>
            </div>
            <div className="messageContent">
                <p>{message.text}</p>
                {message.img && <img src={message.img} alt="" />}
            </div>
        </div>

    )
}

export default Message