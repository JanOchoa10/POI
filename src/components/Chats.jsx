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


const Chats = () => {
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

    // console.log("Tamaño de mis chats")
    // console.log(chats.length)
    // console.log("Tamaño de mi tam")
    // console.log(tamChat.length)

    // const chatsDelUsuarioActual = Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => (
    //     chat[1].userInfo.uid
    // ))

    // for (let i = 0; i < chatsDelUsuarioActual.length; i++) {

    //     if (chatsDelUsuarioActual[i] == "5pZJaz2t0Od2odur7AwfUQNgKjV2MgGb3cQszFds1bHMKmyEbu01vmx1PX9XSJAUx2OiSZ0lq1bBBRgB3iF2") {
    //         chatsDelUsuarioActual.splice(i, 1)
    //     }
    // }
    // //console.log(chatsDelUsuarioActual)

    // console.log("Mychats: " + Object.entries(chats).map((chat) => (chat[1].userInfo.uid)))

    // const [chats2, setChats2] = useState([]);
    // function removeObjectWithId(arr, id) {
    //     // Making a copy with the Array from() method
    //     const arrCopy = Array.from(arr);

    //     const objWithIdIndex = arrCopy.findIndex((obj) => obj.id === id);
    //     arrCopy.splice(objWithIdIndex, 1);
    //     return arrCopy;
    //   }
    //   const newArr = removeObjectWithId(chats, 0);
    //   console.log(newArr)
    //   setChats2(removeObjectWithId(chats, 0))
    //   console.log("Mychats 2: " + Object.entries(chats2).map((chat) => (chat[1].userInfo.uid)))





    const handleSelect = (u) => {
        dispatch({ type: "CHANGE_USER", payload: u });

        // console.log("Mi data.chatId tocado:")
        // console.log(data.chatId)
        // console.log(u)



        // var idSeparadas = []
        // const misIDs = u.uid
        // //En vez de separar por comas, separar por cantidad de carácteres
        // idSeparadas = misIDs.split(',')

        // var idGigante = idSeparadas[0]
        // var cantCaracteres = idGigante.length
        // var cantDeSep = cantCaracteres / 28
        // var recorridos = 0

        // var inicio = 0, fin = 28

        // for (let i = 0; i < cantDeSep; i++) {
        //     idSeparadas[i] = idGigante.substring(inicio, fin)
        //     inicio = fin
        //     fin += 28
        // }


        // // for(let i = 0; i<idSeparadas.length; i++){
        // //     if(idSeparadas[i] === ""){
        // //         idSeparadas.splice(i,0)
        // //     }
        // // }
        // idSeparadas = idSeparadas.filter((item) => item !== '')


        // idSeparadas.push(currentUser.uid)

        // idSeparadas.sort().reverse()

        // console.log("Id separadas:\n")
        // console.log(idSeparadas)
        // var indiceDeBusqueda = ""
        // for (let i = 0; i < idSeparadas.length; i++) {
        //     indiceDeBusqueda = indiceDeBusqueda + idSeparadas[i]
        // }
        // data.chatId = indiceDeBusqueda

        // console.log("Mi data.chatId tocado 2:")
        // console.log(data.chatId)
        // console.log("Aqu8i")
        // console.log(data.chatId)
    }



    const usuarioActual = (chat) => {

        if (chat[1].lastMessage?.text !== undefined) {

            if (chat[1].lastMessage.senderId == currentUser.uid) {
                return (
                    <p>{'Tú: ' + chat[1].lastMessage?.text}</p>
                );
            } else {
                return (
                    <p>{chat[1].lastMessage?.text}</p>
                );
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