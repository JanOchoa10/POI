import React, { useContext, useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";
import { AuthContext } from "../context/AuthContext";
import { getDatabase, ref, set, get, child, onValue, onDisconnect, serverTimestamp, push } from "firebase/database";
import { Firestore, doc, getFirestore, collection, onSnapshot, query, orderBy, updateDoc } from "firebase/firestore"
import { async } from "@firebase/util";
import { db } from "../firebase";



const Home = () => {
    // Asignamos icono en la pestaña
    //Creamos la función para asignar el icono
    function setFavicons(favImg) {
        let headTitle = document.querySelector('head');
        let setFavicon = document.createElement('link');
        setFavicon.setAttribute('rel', 'shortcut icon');
        setFavicon.setAttribute('href', favImg);
        headTitle.appendChild(setFavicon);
    }
    //Asignamos el icono de nuestro sitio web
    setFavicons('https://i.ibb.co/rkKS779/logo-Robbin128.jpg');



    const { currentUser } = useContext(AuthContext);
    // Fetch the current user's ID from Firebase Authentication.
    var uid = currentUser.uid;

    // Create a reference to this user's specific status node.
    // This is where we will store data about being online/offline.
    //var userStatusDatabaseRef = firebase.database().ref('/status/' + uid);
    // const [myDB, setMyDB] = useState(null);

    const db2 = getDatabase();

    const lastOnlineRef = ref(db2, '/users/' + uid + '/lastOnline');

    const myConnectionsRef = ref(db2, '/users/' + uid + '/estado');
    const myUCRef = ref(db2, '/users/' + uid + '/uid');

    const connectedRef = ref(db2, ".info/connected");

    var miData = null

    if (uid != undefined) {

        onValue(connectedRef, (snap) => {
            if (snap.val() === true) {
                //onDisconnect(presenceRef).set(isOnlineForDatabase);
                // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
                //const con = push(myConnectionsRef);
                // const miData = push(presenceRef);
                // When I disconnect, remove this device

                miData = snap.val()


                // const usuarioConectado = async () => {
                //     await updateDoc(doc(db, "users", currentUser.uid), {
                //         ["estado"]: (miData ? "Conectado" : "Desconectado"),
                //     });
                // }
                // usuarioConectado();

                


            }


            if (snap.val() === true) {

                // setTimeout(() => {
                    onDisconnect(myConnectionsRef).set('Desconectado');
                    //onDisconnect(con).update(set(false));
                    //onDisconnect(con).update(false);
                    // onDisconnect(miData).set(isOnlineForDatabase);

                    // Add this device to my connections list
                    // this value could contain info about the device or a timestamp too
                    set(myConnectionsRef, 'Conectado');
                    set(myUCRef, currentUser.uid);

                    //console.log("Mi usuario está:" + (miData ? "Conectado" : "Desconectado"))
                    //console.log(con);
                    // set(miData, isOnlineForDatabase);

                    // When I disconnect, update the last time I was seen online
                    onDisconnect(lastOnlineRef).set(serverTimestamp());


                // }, 3000);
                
                console.log("Estoy conectado");
                // onDisconnect(presenceRef).set(isOnlineForDatabase);
            } else {
                console.log("Estoy desconectado");
                // onDisconnect(presenceRef).set(isOfflineForDatabase);
            }


        });



    }


    console.log("Mi dadadad 2:" + (miData ? "Conectado" : "Desconectado"))









    // const()
    // const db = getDatabase();
    //const starCountRef = ref(db, 'posts/' + postId + '/starCount');
    // onValue(myConnectionsRef, (snapshot) => {
    //     const data = snapshot.val();
    //     console.log("Mi data: "+data)
    //     //updateStarCount(postElement, data);
    // });

    // const dbFire = getFirestore();

    // const lastOnlineRefFire = collection(dbFire, '/users/' + uid + '/lastOnline');

    // const myConnectionsRefFire = collection(dbFire, '/users/' + uid + '/estado');

    // const connectedRefFire = doc(dbFire, ".info/connected");


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
    //         set(myConnectionsRefFire, 'Conectado');
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

    // const q = query(collection(dbFire, '/users/' + uid + '/estado'), orderBy('displayName'));
    // onSnapshot(q, (querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //         var isOnline = doc.data().state == 'Conectado';
    //     });
    // });

    // const [chats, setChats] = useState([]);

    // useEffect(() => {
    //     const getChats = () => {
    //         const unsub = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
    //             setChats(doc.data())
    //         });

    //         return () => {
    //             unsub();
    //         };
    //     };
    //     currentUser.uid && getChats()
    // }, [currentUser.uid]);


















    return (

        <div className="home">
            <div className="container">
                <Sidebar />
                <Chat />
            </div>

        </div>

    )
}

export default Home


