import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import add from "../img/bluebird_56.png";
import add2 from "../img/out_2.png";
import add3 from "../img/logo_robbin.png";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import Swal from 'sweetalert2'
import Group from "../img/NewMessageIcon.png";
import Chats, { handleSelect } from './Chats.jsx';
import { collection, query, where, onSnapshot, orderBy, startAt, endAt, getDocs, getDoc, doc, setDoc, updateDoc, serverTimestamp, Firestore } from "firebase/firestore";
import { db } from "../firebase";
import { ChatContext } from "../context/ChatContext";

const Navbar = () => {
    const { dispatch } = useContext(ChatContext);
    const { currentUser } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [user, setUser] = useState(null);
    const [err, setErr] = useState(false);
    const [myChats, setMyChats] = useState([]);
    const rooms = []

    const [listaDeInte, setLista] = useState([])
    var grupoId = ""

    // handleSelect("")
    const myConstante = () => {
        // Swal.fire({
        //     icon: 'success',
        //     title: '¡Haz tocado la foto de perfil o el nombre del usuario!',
        //     confirmButtonText: 'Aceptar',
        // })
    }

    const ocultarInput = () => {
        const miDoc = document.getElementById('miGrupo1');
        const estaOculto = miDoc.hasAttribute('hidden');


        //style="display: none"
        //console.log(estaOculto);

        if (!estaOculto) {
            miDoc.setAttribute('hidden', '');
        } else {
            miDoc.removeAttribute('hidden');
        }
    }

    const handleSearch = async () => {

        const q = query(
            collection(db, "users"),
            //where("displayName", "==", username)
            orderBy('displayName'), startAt(username), endAt(username + '\uf8ff')

        );
        const qVacio = query(
            collection(db, "users"),
            //where("displayName", "==", username)
            orderBy('displayName'), startAt(""), endAt("" + '\uf8ff')
        );

        if (username !== null && username != "") {
            try {
                let inicio = 0;
                // let cantidadDeChats = 0;
                const querySnapshot = await getDocs(q);

                // const querySnapshot = await getDocs(q, (doc) => {
                //     setMyChats(doc.data())
                // });

                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    setUser(doc.data())
                    //setMyChats(doc.data())
                    rooms.push(doc.data())
                    inicio++;
                });
                setMyChats(rooms)

                //console.log(user.displayName)
                console.log(myChats)



                // console.log("Cantidad de chats: " + cantidadDeChats);
                console.log("Cantidad de usuarios coincidentes: " + inicio);




                if (inicio == 0) {
                    setErr(true)
                    setUser(null)
                } else {
                    setErr(false)
                }

                let totalDeUsers = 0;
                const querySnapshotUsuarios = await getDocs(qVacio);
                querySnapshotUsuarios.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    //setUser(doc.data())
                    totalDeUsers++;
                });
                console.log("Cantidad total de usuarios: " + totalDeUsers);


            } catch (err) {
                //setErr(true);
                console.log(err)
            }
        } else {
            setErr(true)
            setUser(null)
        }


    };
    const handleKey = (e) => {
        //e.preventDefault();
        e.code === "Enter" && handleSearch();
    };

    function focusOut() {
        //console.log(username)
        setErr(false)
        //setUser(null)
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        e.target.reset();
        crearGrupo();
    }

    const handleSelect = async (u) => {
        //ocultarInput()


        //verificar el gtupo (chats in firestore) existe o no, si existe no crear
        const combineId =
            currentUser.uid > user.uid
                ? currentUser.uid + user.uid
                : user.uid + currentUser.uid;


        // console.log("Lista const: " + listaDeInte)
        // listaDeInte.push(combineId)
        // console.log("Lista const: " + listaDeInte)


        console.log("Aqui: " + listaDeInte);
        const queso = listaDeInte.push(user.uid);
        // setLista(user.uid)
        console.log("Aqui: " + listaDeInte);


        for (let i = 0; i < listaDeInte.length; i++) {
            grupoId = grupoId + listaDeInte[i]
        }
        console.log("IdsGroup: " + grupoId)

        // const aux = ""
        // const listaOredenada = listaDeInte




        // for(let i = 0; i<listaDeInte.length; i++){
        //     listaDeInte[i] > listaDeInte[i+1]
        //         ? listaDeInte[i] + listaDeInte[i+1]
        //         : user.uid + currentUser.uid;
        // }

        // for (let k = 0; k < listaOredenada.length; k++) {
        //     for (let i = 0; i < (listaOredenada.length - k); i++) {
        //         if (listaOredenada[i] > listaOredenada[i + 1]) {
        //             aux = listaOredenada[i];
        //             listaOredenada[i] = listaOredenada[i + 1];
        //             listaOredenada[i + 1] = aux;
        //         }
        //     }
        // }

        //console.log("Lista original: " + listaDeInte +"\nLista ordenada: " +listaOredenada)


        // try {



        //     const res = await getDoc(doc(db, "chats", combineId));

        //     if (!res.exists()) {
        //         //crear un chat en la coleccion de chats
        //         await setDoc(doc(db, "chats", combineId), { messages: [] });

        //     //crear chat de usuario
        //     /*userChats:{
        //         janesid:{
        //             combineId:{
        //                 userInfo{
        //                     dn, img, id 
        //                 },
        //                 lastMessage:"",
        //                 date:
        //             }
        //         }
        //     }*/
        //     await updateDoc(doc(db, "userChats", currentUser.uid), {
        //         [combineId + ".userInfo"]: {
        //             uid: user.uid,
        //             displayName: user.displayName,
        //             photoURL: user.photoURL,
        //         },
        //         [combineId + ".date"]: serverTimestamp()
        //     });

        //     await updateDoc(doc(db, "userChats", user.uid), {
        //         [combineId + ".userInfo"]: {
        //             uid: currentUser.uid,
        //             displayName: currentUser.displayName,
        //             photoURL: currentUser.photoURL,
        //         },
        //         [combineId + ".date"]: serverTimestamp()
        // });

        // } else {

        // Swal.fire({
        //     icon: 'error',
        //     title: '¡Ya existe un chat con ese usuario!',
        //     text: 'Revise sus chats para conversar con ese usuario.',
        //     confirmButtonText: 'Aceptar',
        // })
        //Search.handleSelect(user.userInfo);
        // }




        // } catch (err2) { }
        //Verificar chats de usuarios
        //setUser(null);
        //dispatch({ type: "CHANGE_USER", payload: u });


        //setUsername("");


    }

    const crearGrupo = async (u) => {
        try {

            const combineId = grupoId

            const res = await getDoc(doc(db, "chats", combineId));

            if (!res.exists()) {
                //crear un chat en la coleccion de grupos
                await setDoc(doc(db, "chats", combineId), { messages: [] });

                //crear chat de usuario
                /*userChats:{
                    janesid:{
                        combineId:{
                            userInfo{
                                dn, img, id 
                            },
                            lastMessage:"",
                            date:
                        }
                    }
                }*/
                await updateDoc(doc(db, "userChats", currentUser.uid), {
                    [combineId + ".userInfo"]: {
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                    },
                    [combineId + ".date"]: serverTimestamp()
                });

                await updateDoc(doc(db, "userChats", user.uid), {
                    [combineId + ".userInfo"]: {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL,
                    },
                    [combineId + ".date"]: serverTimestamp()
                });

            } else {

                Swal.fire({
                    icon: 'error',
                    title: '¡Ya existe un grupo con esos usuarios!',
                    text: 'Revise sus chats para conversar con ese usuario.',
                    confirmButtonText: 'Aceptar',
                })
                //Navbar.crearGrupo(user.userInfo);
            }




        } catch (err2) { console.log('Error, a mimir: ' + err2) }
        //Verificar chats de usuarios
        //setUser(null);
        //dispatch({ type: "CHANGE_USER", payload: u });


        //setUsername("");
        ocultarInput()
    }

    return (
        <div className="navbar">
            {/* <span className="logo">Robbin</span> */}
            {/* <img className="img3" src={add3} alt="Logo de Robbin" /> */}
            <div className="user">
                <img src={currentUser.photoURL} alt="" onClick={myConstante} />
                <span onClick={myConstante}>{currentUser.displayName}</span>
                {/* <span onClick={myConstante}>{"¡Hola, "+currentUser.displayName+ "!"}</span> */}
            </div>
            <div>
                <a>
                    <button className="btnSalir">
                        <img className="img2" src={Group} alt="Nuevo grupo" title="Nuevo grupo"
                            onClick={ocultarInput} />
                    </button>
                </a>

                <label id="miGrupo1" hidden>
                    <div className="miGrupo">


                        <div className="crear">
                            <form className="crear" onSubmit={handleSubmit}>
                                <input type="text" className="grupo-active"
                                    placeholder="Buscar integrantes"
                                    onKeyDown={handleKey}
                                    onChange={(e) => setUsername(e.target.value)}
                                    onBlur={focusOut} />

                                <input type="button" className="myBtn" value="Crear grupo"
                                />
                            </form>

                        </div>
                        {err &&

                            <div className="overChats3">
                                <div className="chats">
                                    <div className="userChat">
                                        <span className="userChatInfo">¡Usuario no encontrado!</span>
                                    </div>
                                </div>
                            </div>

                        }
                        {user && (
                            <div className="overChats3">
                                <div className="chats">
                                    {Object.entries(myChats)?.map((chat) => (
                                        <div className="userChat" key={chat[0]} onClick={() => handleSelect(chat[1])}>
                                            <img src={chat[1].photoURL} alt="" />
                                            <div className="userChatInfo">
                                                <span>{chat[1].displayName}</span>
                                                {/* {usuarioActual(chat)} */}

                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </label>





            </div>
        </div>
    )
}

export default Navbar