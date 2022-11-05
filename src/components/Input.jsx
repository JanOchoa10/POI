import React, { useContext, useState } from "react";
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

    var idSeparadas = []

    const handleSend = async () => {

        try {
            if (img) {
                const storageRef = ref(storage, uuid());

                const uploadTask = uploadBytesResumable(storageRef, img);

                uploadTask.on(
                    (error) => {
                        console.log("Mi error: " + error)
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
        } catch (err) {
            console.log("Imagen: " + err)
        }
        
        try {
            // Separamos las ids para agregarles los datos a
            const misIDs = data.user.uid
            idSeparadas = misIDs.split(',')
            idSeparadas.pop()
            for (let i = 0; i < idSeparadas.length; i++) {
                await updateDoc(doc(db, "userChats", idSeparadas[i]), {
                    [misIDs + ".lastMessage"]: {
                        text,
                        senderId: currentUser.uid,
                    },
                    [misIDs + ".date"]: serverTimestamp(),
                });
            }
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