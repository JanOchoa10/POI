import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import add from "../img/bluebird_56.png";
import add1 from "../img/robbin.jpg";
import add2 from "../img/robbin2.jpg";
import add3 from "../img/robbin3.jpg";
import add4 from "../img/bluebird.png";

const Message = ({ message }) => {

    const { currentUser } = useContext(AuthContext)
    const { data } = useContext(ChatContext)

    const ref = useRef();

    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);

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

    return (
        <div
            ref={ref}
            className={`message ${message.senderId === currentUser.uid && "owner"}`}
        >
            <div className="messageInfo">
                <img src={
                    message.senderId === currentUser.uid
                        ? currentUser.photoURL
                        : data.user.photoURL
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