import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import TextField from "@material-ui/core/TextField"
import AssignmentIcon from "@material-ui/icons/Assignment"
import PhoneIcon from "@material-ui/icons/Phone"
import React, { useEffect, useRef, useState } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { Navigate } from "react-router-dom"
import Peer from "simple-peer"
import io from "socket.io-client"
// import "./App.css"


const socket = io.connect('http://localhost:5000')
function Videollamada() {
    const [me, setMe] = useState("")
    const [stream, setStream] = useState()
    const [receivingCall, setReceivingCall] = useState(false)
    const [caller, setCaller] = useState("")
    const [callerSignal, setCallerSignal] = useState()
    const [callAccepted, setCallAccepted] = useState(false)
    const [idToCall, setIdToCall] = useState("")
    const [callEnded, setCallEnded] = useState(false)
    const [name, setName] = useState("")
    const myVideo = useRef()
    const userVideo = useRef()
    const connectionRef = useRef()

    function setFavicons(favImg) {
        let headTitle = document.querySelector('head');
        let setFavicon = document.createElement('link');
        setFavicon.setAttribute('rel', 'shortcut icon');
        setFavicon.setAttribute('href', favImg);
        headTitle.appendChild(setFavicon);
    }
    //Asignamos el icono de nuestro sitio web
    setFavicons('https://i.ibb.co/rkKS779/logo-Robbin128.jpg');

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setStream(stream)
            myVideo.current.srcObject = stream
        })

        socket.on("me", (id) => {
            setMe(id)
            console.log("My id: " + id)
            console.log("My id me :" + me)
        })
        console.log("My id me :" + me)

        socket.on("callUser", (data) => {
            setReceivingCall(true)
            setCaller(data.from)
            setName(data.name)
            setCallerSignal(data.signal)
        })
    }, [name])

    const callUser = (id) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream
        })
        peer.on("signal", (data) => {
            socket.emit("callUser", {
                userToCall: id,
                signalData: data,
                from: me,
                name: name
            })
        })
        peer.on("stream", (stream) => {

            userVideo.current.srcObject = stream

        })
        socket.on("callAccepted", (signal) => {
            setCallAccepted(true)
            peer.signal(signal)
        })

        connectionRef.current = peer
    }

    const answerCall = () => {
        setCallAccepted(true)
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream
        })
        peer.on("signal", (data) => {
            socket.emit("answerCall", { signal: data, to: caller })
        })
        peer.on("stream", (stream) => {
            userVideo.current.srcObject = stream
        })

        peer.signal(callerSignal)
        connectionRef.current = peer
    }

    const leaveCall = () => {
        setCallEnded(true)
        connectionRef.current.destroy()
        window.close()
    }

    return (
        <div className="myBodyVideoCall">
            {/* <h1 style={{ textAlign: "center", color: '#fff' }}>Zoomish</h1> */}
            <br></br>
            <div className="container">
                <div className="video-container">
                    <div className="video" >
                        {stream && <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />}
                    </div>
                    <div className="video">
                        {callAccepted && !callEnded ?
                            <video playsInline ref={userVideo} autoPlay style={{ width: "300px" }} /> :
                            null}
                    </div>
                </div>
                <div className="myId">
                    {receivingCall && !callAccepted ? (
                        <div className="arriba-caller">

                            <div className="caller">
                                <h1 >{name} te está llamando...</h1>
                                <Button variant="contained" color="primary" onClick={answerCall}>
                                    Responder
                                </Button>
                            </div>

                        </div>
                    ) : null}
                    {!callAccepted ? (

                        <div className="bloque">

                            <TextField
                                id="filled-basic"
                                label="Nombre"
                                variant="filled"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={{ marginBottom: "20px" }}
                            />
                            <CopyToClipboard text={me} style={{ marginBottom: "2rem" }}>
                                <Button variant="contained" color="primary" startIcon={<AssignmentIcon fontSize="large" />}>
                                    Copiar ID
                                </Button>
                            </CopyToClipboard>

                            <TextField
                                id="filled-basic"
                                label="ID de la llamada"
                                variant="filled"
                                value={idToCall}
                                onChange={(e) => setIdToCall(e.target.value)}
                            />

                        </div>
                    ) : null}

                    <div className="call-button">
                        {callAccepted && !callEnded ? (
                            <Button variant="contained" color="secondary" onClick={leaveCall}>
                                Colgar
                            </Button>
                        ) : (
                            <IconButton color="primary" aria-label="call" onClick={() => callUser(idToCall)}>
                                <PhoneIcon fontSize="large" />
                            </IconButton>
                        )}
                        {/* {idToCall} */}
                    </div>

                </div>



            </div>
            <br></br>
        </div>
    )
}

export default Videollamada