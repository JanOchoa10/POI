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
import { collection, query, where, onSnapshot, orderBy, startAt, endAt, getDocs, getDoc, doc, setDoc, updateDoc, serverTimestamp, Firestore, limitToLast } from "firebase/firestore";
import { db } from "../firebase";
import { ChatContext } from "../context/ChatContext";
import { list } from "firebase/storage";

const Navbar = () => {
    const { dispatch } = useContext(ChatContext);
    const { currentUser } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [groupname, setGroupname] = useState("");
    const [user, setUser] = useState(null);
    const [err, setErr] = useState(false);
    const [myChats, setMyChats] = useState([]);
    const rooms = []

    const [listaDeInte, setLista] = useState([])

    var grupoId = ""
    // var listaIDS = ""

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
        // Limpiamos los usuarios filtrados en rooms
        rooms.length -= rooms.length
        setMyChats(rooms)

        // Y limpiamos los usuarios agregados en listaDeInte
        listaDeInte.length -= listaDeInte.length

        const nombreDelGrupo = document.getElementById('nombreDelGrupo');
        const inputBuscador = document.getElementById('inputBuscador');

        nombreDelGrupo.value = "";
        inputBuscador.value = "";


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

    }

    const handleSelect = async (u) => {

        if (listaDeInte.length > 0) {



            if (currentUser.uid == u.uid) {
                //No registra porque ya existe
                console.warn("EL USUARIO ACTUAL NO PUEDE REGISTRARSE EN EL GRUPO")
                Swal.fire({
                    icon: 'warning',
                    title: '¡Ya agregado al grupo!',
                    text: 'El usuario actual ya se encuentra dentro del grupo.',
                    confirmButtonText: 'Aceptar'
                    // footer: '<a href="">Why do I have this issue?</a>'
                })
            } else {
                let siExisteYa = false
                for (let i = 0; i < listaDeInte.length; i++) {
                    if (listaDeInte[i] == u.uid) {
                        //No registra porque ya existe
                        console.warn("YA EXISTE ESE USUARIO")
                        Swal.fire({
                            icon: 'question',
                            title: '¡Usuario ya agregado!',
                            text: '¿Desea borrar al usuario del grupo',
                            showCancelButton: true,
                            confirmButtonText: 'Borrar',
                            cancelButtonText: `Cancelar`,
                        }).then((result) => {
                            /* Read more about isConfirmed, isDenied below */
                            if (result.isConfirmed) {

                                listaDeInte.splice(i, 1)

                            }
                        })
                        siExisteYa = true
                        break;
                    }
                }
                if (!siExisteYa) {
                    const queso = listaDeInte.push(u.uid);
                }
            }

        } else {
            if (currentUser.uid == u.uid) {
                //No registra porque ya existe
                console.warn("EL USUARIO ACTUAL NO PUEDE REGISTRARSE EN EL GRUPO")
                Swal.fire({
                    icon: 'warning',
                    title: '¡Ya agregado al grupo!',
                    text: 'El usuario actual ya se encuentra dentro del grupo.',
                    confirmButtonText: 'Aceptar'

                })
            } else {
                const queso = listaDeInte.push(u.uid);
            }
        }



    }

    const crearGrupo = async (u) => {

        u = ""
        for (let i = 0; i < listaDeInte.length; i++) {
            u = u + listaDeInte[i] + ","
        }
        var sep = u.split(',')
        sep = sep.sort().reverse()

        sep = sep.filter((item) => item !== '')

        var uSinComas = ""
        for (let i = 0; i < listaDeInte.length; i++) {
            uSinComas = uSinComas + listaDeInte[i]
        }

        listaDeInte.push(currentUser.uid)


        const listaParaOrdenar = listaDeInte.sort().reverse()

        var comb = ""
        for (let i = 0; i < listaDeInte.length; i++) {
            comb = comb + listaDeInte[i]
        }

        //console.log(sep[0])
        // console.log("Usuario actual:")
        // console.log(currentUser.uid)
        // console.log("Usuario u:")
        // console.log(u)
        const combineId = comb
        // currentUser.uid > uSinComas
        //     ? currentUser.uid + uSinComas
        //     : uSinComas + currentUser.uid;

        // console.log("Id combinada:")
        // console.log(combineId)


        // console.log(sep)
        try {



            //Se agrega usuario que crea el grupo
            // listaDeInte.push(currentUser.uid);
            // const listaOrdenada = listaDeInte.sort()

            // const listaOrdenada = listaDeInte.sort().reverse()

            // //Imprimimos los usuarios seleccionados
            // grupoId = ""
            // for (let i = 0; i < listaOrdenada.length; i++) {
            //     grupoId = grupoId + listaOrdenada[i] + ","
            // }

            // listaIDS = ""
            // for (let i = 0; i < listaOrdenada.length; i++) {
            //     listaIDS = listaIDS + listaOrdenada[i] +","
            // }

            // const combineId =
            //     currentUser.uid > grupoId
            //         ? currentUser.uid + grupoId
            //         : grupoId + currentUser.uid;

            // const combineId =
            //     currentUser.uid > u.uid
            //         ? currentUser.uid + u.uid
            //         : u.uid + currentUser.uid;
            console.log("MI sep:")
            console.log(sep)
            console.log("Mi lista de inte:")
            console.log(listaDeInte)
            const res = await getDoc(doc(db, "chats", combineId));

            if (!res.exists()) {
                //crear un chat en la coleccion de grupos
                await setDoc(doc(db, "chats", combineId), { messages: [] });

                // for (let i = 0; i < sep.length-1; i++) {
                await updateDoc(doc(db, "userChats", currentUser.uid), {
                    [combineId + ".userInfo"]: {
                        uid: uSinComas,
                        displayName: groupname,
                        photoURL: 'https://i.ibb.co/jTBT7yC/Robbin-Profile.png',
                    },
                    [combineId + ".date"]: serverTimestamp(),
                    [combineId + ".tipoDeChat"]: "Grupo"
                });
                // }

                //cada usuario

                // for(let i = 0; i<sep.length; i++){
                if (sep.length <= 1) {
                    for (let i = 0; i < sep.length; i++) {
                        await updateDoc(doc(db, "userChats", sep[i]), {
                            [combineId + ".userInfo"]: {
                                uid: currentUser.uid,
                                displayName: groupname,
                                photoURL: 'https://i.ibb.co/jTBT7yC/Robbin-Profile.png',
                            },
                            [combineId + ".date"]: serverTimestamp(),
                            [combineId + ".tipoDeChat"]: "Grupo"
                        });
                    }
                } else {
                    for (let i = 0; i < sep.length; i++) {

                        var nuevoId = ""
                        for (let k = 0; k < sep.length; k++) {
                            if (sep[k] != sep[i]) {
                                nuevoId = nuevoId + sep[k]
                            }
                        }


                        await updateDoc(doc(db, "userChats", sep[i]), {
                            [combineId + ".userInfo"]: {
                                uid: nuevoId + currentUser.uid,
                                displayName: groupname,
                                photoURL: 'https://i.ibb.co/jTBT7yC/Robbin-Profile.png',
                            },
                            [combineId + ".date"]: serverTimestamp(),
                            [combineId + ".tipoDeChat"]: "Grupo"
                        });
                    }
                }
                // }

                // await updateDoc(doc(db, "userChats", currentUser.uid), {
                //     [combineId + ".userInfo"]: {
                //         uid: u.uid,
                //         displayName: u.displayName,
                //         photoURL: u.photoURL,
                //     },
                //     [combineId + ".date"]: serverTimestamp()
                // });

                // //Asignamos el grupo creado a cada usuario
                // for (let i = 0; i < listaOrdenada.length; i++) {

                //     //Variable del grupo
                //     var grupoExtra = ""
                //     for (let j = 0; j < listaOrdenada.length; j++) {

                //         if (listaOrdenada[i] != listaOrdenada[j]) {
                //             grupoExtra = grupoExtra + listaOrdenada[j] + ","
                //         }
                //     }

                //     await updateDoc(doc(db, "userChats", listaOrdenada[i]), {
                //         [combineId + ".userInfo"]: {
                //             uid: grupoExtra,
                //             displayName: groupname,
                //             photoURL: 'https://i.ibb.co/jTBT7yC/Robbin-Profile.png',
                //         },
                //         [combineId + ".date"]: serverTimestamp()
                //     });
                // }

            } else {

                Swal.fire({
                    icon: 'error',
                    title: '¡Ya existe un grupo con esos usuarios!',
                    text: 'Revise sus chats para conversar con ese usuario.',
                    confirmButtonText: 'Aceptar',
                })

            }




        } catch (err2) {
            console.error('Error, a mimir: ' + err2)
        }
        // setUser(null);
        // dispatch({ type: "CHANGE_USER", payload: u });


        //setUsername("");
        ocultarInput()
        //console.warn('Lista borrada?: '+listaDeInte+'\nCantidad de elementos: '+listaDeInte.length)
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

                                <div className="secciones">
                                    <input type="text" className="grupo-active"
                                        placeholder="Nombra al grupo"
                                        onKeyDown={handleKey}
                                        onChange={(e) => setGroupname(e.target.value)}
                                        onBlur={focusOut}
                                        id="nombreDelGrupo" />
                                </div>

                                <div className="secciones">
                                    <input type="text" className="grupo-active"
                                        placeholder="Buscar integrantes"
                                        onKeyDown={handleKey}
                                        onChange={(e) => setUsername(e.target.value)}
                                        onBlur={focusOut}
                                        id="inputBuscador" />

                                    <input type="button" className="myBtn" value="Crear grupo"
                                        onClick={crearGrupo} />

                                </div>



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