import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Img from "../img/img_robbin.png";
import Attach from "../img/attach_robbin.png";
import Plus from "../img/addIcon2.png";
import Loca from "../img/Location.png";
import emoji from 'emoji-library';
import { EmojiService, emoji_list } from "emoji-library";
import "emoji-selector";
import { isDocument } from "@testing-library/user-event/dist/utils";
import { onSnapshot } from "firebase/firestore";
import Swal from "sweetalert2";


const Input = () => {
    //const { EmojiService } = require("emoji-library"); 
    //const emojiService = new EmojiService(); 
    //const emojiList = emojiService.getEmojiList();
    //console.log('emojiList', emojiList[0]);

    const [text, setText] = useState("");
    const [senderId, setSender] = useState("");
    const [img, setImg] = useState(null);

    const { currentUser } = useContext(AuthContext)
    const { data } = useContext(ChatContext)
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

    const idsDeChats = Object.entries(chats)?.map((chat) => (
        chat[1].userInfo.uid
    ))



    var idSeparadas = []
    const misIDs = data.user.uid
    const handleSend = async () => {
        // console.log('Mi cadena de iDS: \n')
        //console.log(misIDs)
        //console.log("Mis ids: \n")

        //console.log(idsDeChats)

        //const reverso = idsDeChats.reverse()
        //console.log(reverso[0])


        const ultimo = idsDeChats[idsDeChats.length - 1]

        console.log("My ultimo id")
        console.log(ultimo)
        console.log("DAta chat id: \n")
        console.log(data.chatId)

        try {
            if (img) {

                const storageRef = ref(storage, uuid());
                const uploadTask = uploadBytesResumable(storageRef, img);

                // try {
                uploadTask.on(
                    (error) => {
                        console.log("Mi error: \n" + error)
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
                // } catch (error) {
                //     console.log("Error aquí: " + error)
                // }

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
        } catch (err) {
            console.log("Imagen: \n" + err)
        }

        try {
            // Separamos las ids para agregarles los datos a

            idSeparadas = misIDs.split(',')

            // for(let i = 0; i<idSeparadas.length; i++){
            //     if(idSeparadas[i] === ""){
            //         idSeparadas.splice(i,0)
            //     }
            // }
            idSeparadas = idSeparadas.filter((item) => item !== '')


            idSeparadas.push(currentUser.uid)

            idSeparadas.sort().reverse()

            console.log("Id separadas:\n")
            console.log(idSeparadas)

            //console.log(idSeparadas)

            //TODO

            // await updateDoc(doc(db, "userChats", currentUser.uid), {
            //     [data.chatId + ".lastMessage"]: {
            //         text,
            //         senderId: currentUser.uid,
            //     },
            //     [data.chatId + ".date"]: serverTimestamp(),
            // });


            if (idSeparadas.length <= 2) {
                for (let i = 0; i < idSeparadas.length; i++) {
                    await updateDoc(doc(db, "userChats", idSeparadas[i]), {
                        [data.chatId + ".lastMessage"]: {
                            text,
                            senderId: currentUser.uid,
                        },
                        [data.chatId + ".date"]: serverTimestamp(),
                    });
                }
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Más de 2 id',
                    confirmButtonText: 'De acuerdo'
                })
            }

            // await updateDoc(doc(db, "userChats", currentUser.uid), {
            //     [data.chatId + ".lastMessage"]: {
            //         text,
            //         senderId: currentUser.uid,
            //     },
            //     [data.chatId + ".date"]: serverTimestamp(),
            // });

            // await updateDoc(doc(db, "userChats", data.user.uid), {
            //     [data.chatId + ".lastMessage"]: {
            //         text,
            //         senderId: currentUser.uid,
            //     },
            //     [data.chatId + ".date"]: serverTimestamp(),
            // });


        } catch (err) {
            console.log("Usuario destino: " + err)
        }

        setText("");
        setImg(null);
    };

    const handleKey = (e) => {
        e.code === "Enter" && handleSend();
    };

    // //const [inputStr, setInputStr] = useState('');
    // const [showPicker, setShowPicker] = useState(false);

    // const onEmojiClick = (event, emojiObject) => {
    //     setText(prevInput => prevInput + emojiObject.emoji);
    //     setShowPicker(false);
    // }

    function InsertarIconos(data) {

        if (data.user?.displayName !== undefined) {
            return (
                <div className="input">
                    {/* <img src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg" alt="" />
                    {showPicker && <emoji pickerStyle={{widht: '100%'}}
                    onEmojiClick={onEmojiClick}/>} */}

                    {/* <img src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg" alt="" />
                    {showPicker && <emoji pickerStyle={{ widht: '100%' }}
                        onEmojiClick={onEmojiClick} />} */}

                    <input type="text" placeholder="Mensaje" onKeyDown={handleKey} onChange={e => setText(e.target.value)} value={text} title="Escribe tu mensaje" />



                    <div className="send">
                        {/* <input type="file" style={{ display: "none" }} id="file" accept=".pdf, .rar, .zip" />
                        <label htmlFor="file"> */}
                        <ul className="menu-horizontal">
                            <li>
                                <img className="menu-horizontal" src={Plus} alt=""
                                // onClick={() => setShowPicker(val => !val)} 
                                />

                                <ul className="menu-vertical">

                                    <li>
                                        <img src={Attach} alt="" title="Adjuntar archivo" />
                                    </li>
                                    <li>
                                        <input type="file" style={{ display: "none" }} id="photo" accept="image/*" onChange={e => setImg(e.target.files[0])} />
                                        <label htmlFor="photo">
                                            <img src={Img} alt="" title="Adjuntar imagen" />

                                        </label>
                                    </li>
                                    <li><img src={Loca} alt="" title="Mandar ubicación" /></li>
                                </ul>
                            </li>
                        </ul>


                        {/* <img src={Attach} alt="" title="Adjuntar archivo" /> */}

                        {/* </label> */}

                        {/* <input type="file" style={{ display: "none" }} id="photo" accept="image/*" onChange={e => setImg(e.target.files[0])} />
                        <label htmlFor="photo">
                            <img src={Img} alt="" title="Adjuntar imagen" />

                        </label> */}
                        <button onClick={handleSend} title="Enviar mensaje">Enviar</button>
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
        <div>
            {InsertarIconos(data)}
        </div>



    )
}

export default Input