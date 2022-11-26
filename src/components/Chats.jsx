import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import add from "../img/bluebird_45.png";
import add1 from "../img/bluebird_46.png";
import add2 from "../img/Robbin_Profile_Unknown.png";
import add3 from "../img/Robbin_Profile.png";
import add4 from "../img/bluebird.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { getDatabase, ref, set, get, child, onValue, onDisconnect, push, query } from "firebase/database";
import { scryRenderedDOMComponentsWithClass } from "react-dom/test-utils";
import { connectStorageEmulator } from "firebase/storage";


const Chats = (myProp) => {
    const option1 = document.getElementById('option1');
    const option2 = document.getElementById('option2');
    const content1 = document.getElementById('content1');
    const content2 = document.getElementById('content2');

    let chose = 1;

    const changeOption = (chose) => {


        switch (chose) {
            case 1: {
                option1.classList.value = 'option option-active';
                content1.classList.value = 'content content-active';
                option2.classList.value = 'option';
                content2.classList.value = 'content';
            } break;

            case 2: {
                option1.classList.value = 'option';
                content1.classList.value = 'content';
                option2.classList.value = 'option option-active';
                content2.classList.value = 'content content-active';

            } break;

            default:
                break;
        }

    }


    const [chats, setChats] = useState([]);

    const { currentUser } = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext);

    //const { data } = useContext(ChatContext);

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


    const tamChat = Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).filter(chat => chat[1].tipoDeChat == "Chat").map((chat) => (
        chat[1].length
    ))

    const tamGrupo = Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).filter(chat => chat[1].tipoDeChat == "Grupo").map((chat) => (
        chat[1].length
    ))


    const handleSelect = (u) => {
        dispatch({ type: "CHANGE_USER", payload: u });
    }



    const usuarioActual = (chat) => {

        if (chat[1].lastMessage?.miTextoEncriptado !== undefined) {

            var estaEncriptado = chat[1].lastMessage?.encriptado

            //console.log(estaEncriptado)

            var miTexto = chat[1].lastMessage?.miTextoEncriptado + ""
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




            if (chat[1].lastMessage.senderId == currentUser.uid) {
                return (
                    <p>{'Tú: ' + textoDelMensaje}</p>
                );
            } else {
                return (
                    <p>{textoDelMensaje}</p>
                );
            }
        }

    }


    var uid = currentUser.uid;

    // Create a reference to this user's specific status node.
    // This is where we will store data about being online/offline.
    //var userStatusDatabaseRef = firebase.database().ref('/status/' + uid);
    // const [myDB, setMyDB] = useState(null);

    const db2 = getDatabase();

    const lastOnlineRef = ref(db2, '/users/' + uid + '/lastOnline');

    const myConnectionsRef = ref(db2, '/users/' + uid + '/estado');

    const connectedRef = ref(db2, ".info/connected");

    var miData = null

    const rooms = []
    const [misUsuariosRealTime, setMisURT] = useState(null);

    if (misUsuariosRealTime == null) {
        get(child(ref(getDatabase()), 'users/')).then((snapshot) => {
            snapshot.forEach((child) => {
                // console.log(child.val());
                rooms.push(child.val());
            })
            setMisURT(rooms)
        });
    }

    // console.error("aqui hijo")
    //console.log(misUsuariosRealTime)


    // console.log(postListRef)

    // if (uid != undefined) {

    //     onValue(connectedRef, (snap) => {
    //         if (snap.val() === true) {
    //             miData = snap.val()
    //         }
    //         if (snap.val() === true) {
    //             console.log("Estoy conectado");
    //         } else {
    //             console.log("Estoy desconectado");
    //         }
    //     });

    // }


    //console.log("Mi dadadad 2:" + miData)

    // const rooms2 = []
    // const [misUsuariosRealTime2, setMisURT2] = useState(null);
    // if (misUsuariosRealTime2 == null) {
    //     const db = getDatabase();
    //     const myUsers = ref(db, 'users/');
    //     onValue(myUsers, (snapshot) => {
    //         const data = snapshot.val();
    //         setMisURT2(data);


    //     });
    // }

    // console.error("Mi info")
    // console.log(misUsuariosRealTime2)
    // console.log("hubo un cambio")

    function misDatos(userMandado) {

        if (misUsuariosRealTime != null) {
            for (let i = 0; i < misUsuariosRealTime.length; i++) {
                if (userMandado == misUsuariosRealTime[i].uid && misUsuariosRealTime[i].estado == "Conectado") {
                    return (<div>
                        <div className="online"></div>
                    </div>)
                }
            }
        }

        // if (misUsuariosRealTime != null) {
        //     for (let i = 0; i < misUsuariosRealTime2.length; i++) {
        //         if (userMandado == misUsuariosRealTime2[i].uid && misUsuariosRealTime2[i].estado == "Conectado") {
        //             return (<div>
        //                 <div className="online"></div>
        //             </div>)
        //         }
        //     }
        // }       


        // if (myProp.conexiones != null) {
        //     for (let i = 0; i < myProp.conexiones.length; i++) {
        //         if (userMandado == myProp.conexiones[i].uid && myProp.conexiones[i].estado == "Conectado") {
        //             return (<div>
        //                 <div className="online"></div>
        //             </div>)
        //         }
        //     }
        // }      

    }

    // console.warn("Mi arreglo:")
    //console.log(myProp.conexiones["ub5JpOnGyNhhLUXSDZKXAkTK3q63"])

    // if (myProp.conexiones != undefined) {
    //     const misUA = myProp.conexiones["oZN84fQJr1WWWm03aQyvlxjfpIv1"]
    //     console.log(misUA)
    // }

    // console.log(misUA["4LoPn7XUwuSsA7EUqXqVpMtGqfO2"])

    function myUser(miUser) {

        console.log(miUser)

        if (myProp.conexiones != undefined) {

            if (myProp.conexiones[miUser]) {
                if (myProp.conexiones[miUser]["estado"] == "Conectado") {
                    return (
                        <div>
                            <div className="online"></div>
                        </div>
                    )
                }
            }


        }

    }



    return (



        <div className="overChats">

            <div className="tab-container">
                <ul className="options">
                    <li id="option1" className="option option-active" onClick={() => changeOption(1)}>Chats ({tamChat.length})</li>
                    <li id="option2" className="option" onClick={() => changeOption(2)}>Grupos ({tamGrupo.length})</li>
                </ul>
            </div>


            <div className="contents">
                <div id="content1" className="content content-active">
                    <div><span className="myTextoChats">Chats</span></div>
                    <div className="chats">

                        {Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).filter(chat => chat[1].tipoDeChat == "Chat").map((chat) => (
                            <div className="userChat" key={chat[0]} onClick={() => handleSelect(chat[1].userInfo)}>
                                <img src={chat[1].userInfo.photoURL} alt="" />

                                {/* {misDatos(chat[1].userInfo.uid)} */}

                                {myUser(chat[1].userInfo.uid)}

                                {/* {myProp.conexiones[chat[1].userInfo.uid] == myProp.conexiones["ub5JpOnGyNhhLUXSDZKXAkTK3q63"] &&
                                    <div>
                                        <div className="online"></div>
                                    </div>
                                } */}

                                <div className="userChatInfo">
                                    <span>{chat[1].userInfo.displayName}</span>
                                    {usuarioActual(chat)}

                                </div>
                            </div>
                        ))}

                    </div>
                </div>


                <div id="content2" className="content">
                    <div><span className="myTextoChats">Grupos</span></div>
                    <div className="chats">

                        {Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).filter(chat => chat[1].tipoDeChat == "Grupo").map((chat) => (
                            <div className="userChat" key={chat[0]} onClick={() => handleSelect(chat[1].userInfo)}>
                                <img src={chat[1].userInfo.photoURL} alt="" />
                                <div className="userChatInfo">
                                    <span>{chat[1].userInfo.displayName}</span>
                                    {usuarioActual(chat)}

                                </div>
                            </div>
                        ))}

                    </div>
                </div>



            </div>

        </div>

    )
}

export default Chats