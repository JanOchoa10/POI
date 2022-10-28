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

    const [chats, setChats] = useState([]);

    const { currentUser } = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext);

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

    //console.log(Object.entries(chats));

    const handleSelect = (u) => {
        dispatch({ type: "CHANGE_USER", payload: u });
    }


    const usuarioActual = (chat) => {
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

    return (
        <div className="chats">
            <div><span className="myTextoChats">Chats</span></div>
            {Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => (
                <div className="userChat" key={chat[0]} onClick={() => handleSelect(chat[1].userInfo)}>
                    <img src={chat[1].userInfo.photoURL} alt="" />
                    <div className="userChatInfo">
                        <span>{chat[1].userInfo.displayName}</span>
                        {usuarioActual(chat)}
                        
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Chats