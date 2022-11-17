import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc, query, collection, where, getDocs, getDoc, orderBy, startAt, endAt, } from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Img from "../img/img_robbin.png";
import Attach from "../img/attach_robbin.png";
import add3 from "../img/logo_robbin.png";
import add2 from "../img/out_2.png";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import Swal from 'sweetalert2'
import { getDatabase, set, get, child, onValue, onDisconnect, push } from "firebase/database";

const Logout = () => {


    const [text, setText] = useState("");
    const [senderId, setSender] = useState("");
    const [img, setImg] = useState(null);

    const { currentUser } = useContext(AuthContext)
    const { data } = useContext(ChatContext)
    const [myUsers, setMyUsers] = useState([]);
    const rooms = []
    

// const { currentUser } = useContext(AuthContext);
    // Fetch the current user's ID from Firebase Authentication.
    var uid = currentUser.uid;

    // Create a reference to this user's specific status node.
    // This is where we will store data about being online/offline.
    //var userStatusDatabaseRef = firebase.database().ref('/status/' + uid);
    // const [myDB, setMyDB] = useState(null);
    if (currentUser.uid != undefined) {


        const db = getDatabase();

        // const lastOnlineRef = ref(db, '/users/' + uid + '/lastOnline');

        // const myConnectionsRef = ref(db, '/users/' + uid + '/estado');

        // const connectedRef = ref(db, ".info/connected");


        // onValue(connectedRef, (snap) => {
        //     if (snap.val() === true) {
        //         //onDisconnect(presenceRef).set(isOnlineForDatabase);
        //         // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
        //         //const con = push(myConnectionsRef);
        //         // const miData = push(presenceRef);
        //         // When I disconnect, remove this device
                
        //         onDisconnect(myConnectionsRef).set('Desconectado');
        //         //onDisconnect(con).update(set(false));
        //         //onDisconnect(con).update(false);
        //         // onDisconnect(miData).set(isOnlineForDatabase);

        //         // Add this device to my connections list
        //         // this value could contain info about the device or a timestamp too
        //         set(myConnectionsRef, 'Conectado');
        //         //console.log(con);
        //         // set(miData, isOnlineForDatabase);

        //         // When I disconnect, update the last time I was seen online
        //         onDisconnect(lastOnlineRef).set(serverTimestamp());
        //     }
        //     if (snap.val() === true) {
        //         console.log("Estoy conectado");
        //         // onDisconnect(presenceRef).set(isOnlineForDatabase);
        //     } else {
        //         console.log("Estoy desconectado");
        //         // onDisconnect(presenceRef).set(isOfflineForDatabase);
        //     }
        // });
    }




    const handleSend = async () => {

        if (img) {
            const storageRef = ref(storage, uuid());

            const uploadTask = uploadBytesResumable(storageRef, img);

            uploadTask.on(
                (error) => {
                    //setErr(true);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        //getDownloadURL(storageRef).then(async (downloadURL) => {
                        await updateDoc(doc(db, "chats", data.chatId), {
                            messages: arrayUnion({
                                id: uuid(),
                                text,
                                senderId: currentUser.uid,
                                date: Timestamp.now(),
                                img: downloadURL,
                            }),

                        });

                    });
                }
            );

        } else {
            await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: currentUser.uid,
                    date: Timestamp.now(),
                }),

            });
        }

        await updateDoc(doc(db, "userChats", currentUser.uid), {
            [data.chatId + ".lastMessage"]: {
                text,
                senderId: currentUser.uid,
            },
            [data.chatId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", data.user.uid), {
            [data.chatId + ".lastMessage"]: {
                text,
                senderId: currentUser.uid,
            },
            [data.chatId + ".date"]: serverTimestamp(),
        });

        setText("");
        setImg(null);
    };

    const handleKey = (e) => {
        e.code === "Enter" && handleSend();
    };






    const cerrarSesionAlert = () => {
        Swal.fire({
            icon: 'question',
            title: '¿Deseas cerrar sesión?',
            showCancelButton: true,
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: `Cancelar`,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                //ponerStatus
                signOut(auth)
            }
        })


    }

    function InsertarIconos(data) {

        if (data.user?.displayName !== undefined) {
            return (
                <div className="input">

                    <input type="text" placeholder="Mensaje" onKeyDown={handleKey} onChange={e => setText(e.target.value)} value={text} />
                    <div className="send">
                        {/* <input type="file" style={{ display: "none" }} id="file" accept=".pdf, .rar, .zip" />
                        <label htmlFor="file"> */}
                        <img src={Attach} alt="" />

                        {/* </label> */}

                        <input type="file" style={{ display: "none" }} id="photo" accept="image/*" onChange={e => setImg(e.target.files[0])} />
                        <label htmlFor="photo">
                            <img src={Img} alt="" />

                        </label>
                        <button onClick={handleSend}>Enviar</button>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="input">

                </div>
            );

        }

    }

    return (
        <div className="logout">
            <div className="centradito2">
                <img className="img3" src={add3} alt="Logo de Robbin" />
                <span className="logo">Robbin</span>
            </div>

            <a>
                <button className="btnSalir">
                    <img className="img2" src={add2} alt="Salir" onClick={cerrarSesionAlert} title="Cerrar sesión" />
                </button>
            </a>
        </div>



    )
}

export default Logout