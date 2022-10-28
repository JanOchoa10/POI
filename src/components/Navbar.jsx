import React, { useContext } from "react";
import { Link } from "react-router-dom";
import add from "../img/bluebird_56.png";
import add2 from "../img/out_2.png";
import add3 from "../img/logo_robbin.png";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import Swal from 'sweetalert2'

const Navbar = () => {
    const { currentUser } = useContext(AuthContext)


    const myConstante = (e) => {
        // Swal.fire({
        //     icon: 'success',
        //     title: '¡Haz tocado la foto de perfil o el nombre del usuario!',
        //     confirmButtonText: 'Aceptar',
        // })

    }

    return (
        <div className="navbar">
            {/* <span className="logo">Robbin</span> */}
            <img className="img3" src={add3} alt="Logo de Robbin" />
            <div className="user">
                <img src={currentUser.photoURL} alt="" onClick={myConstante}/>
                <span onClick={myConstante}>{currentUser.displayName}</span>

                <a>
                    <button className="btnSalir">
                        <img className="img2" src={add2} alt="Salir" onClick={() => signOut(auth)} />
                    </button>
                </a>
            </div>
        </div>
    )
}

export default Navbar