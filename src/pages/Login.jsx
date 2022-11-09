import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import add from "../img/a4.png";
import add3 from "../img/logo_robbin.png";
// ES6 Modules or TypeScript
import Swal from 'sweetalert2'
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
    const [err, setErr] = useState(false);
    const navigate = useNavigate();

    // Asignamos icono en la pestaña
    //Creamos la función para asignar el icono
    // function setFavicons(favImg) {
    //     let headTitle = document.querySelector('head');
    //     let setFavicon = document.createElement('link');
    //     setFavicon.setAttribute('rel', 'shortcut icon');
    //     setFavicon.setAttribute('href', favImg);
    //     headTitle.appendChild(setFavicon);
    // }
    // //Asignamos el icono de nuestro sitio web
    // setFavicons('https://i.ibb.co/rkKS779/logo-Robbin128.jpg');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;

        if (document.getElementById('nombres').value === undefined) {


            if (!validateEmail(document.getElementById('email').value)) {
                console.log('No se muesta el email');
                Swal.fire({
                    icon: 'error',
                    title: '¡Inicio de sesión no exitoso!',
                    text: 'Ingrese un correo válido.',
                    confirmButtonText: 'Reintentar',
                })
            } else {

                if (!validarContrasena(document.getElementById('password1').value)) {
                    Swal.fire({
                        icon: 'error',
                        title: '¡Inicio de sesión no exitoso!',
                        text: 'La contraseña debe contener al menos 1 mayúscula, 1 minúscula, 1 número y 1 caracter especial.',
                        confirmButtonText: 'Reintentar',
                    })
                } else {
                    myLogin(email, password)
                }

            }
        }



        
    };

    async function myLogin(email, password) {
        //const auth = getAuth();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            Swal.fire({
                icon: 'success',
                title: '¡Inicio de sesión exitoso!',
                text: 'Se inició sesión exitosamente.',
                confirmButtonText: 'Continuar',
            }).then((value) => {
                navigate("/");
            })
        } catch (err) {
            //setErr(true);
            Swal.fire({
                icon: 'error',
                title: '¡Usuario o contraseña incorrecto!',
                text: 'Ingrese su usuario y contraseña correctamente.',
                confirmButtonText: 'Reintentar',
            })
        }
    }

    function validateEmail(correo) {

        //validamos que sea el formato de email correcto
        var regExpEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(correo);

        if (regExpEmail) {
            console.log("Email correcto");
            return true;
        } else {
            console.log("Email incorrecto");
            return false;
        }

    }

    function validarContrasena(passwordAValidar) {
        //validamos que sea el formato de contrasena correcto
        var regExpPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,30}$/.test(passwordAValidar);
        //console.log("La contraseña a validar es: "+passwordAValidar);

        if (regExpPassword) {
            console.log("Password correcto");
            return true;
        } else {
            console.log("Password incorrecto");
            return false;
        }
    }

    function updateValuePassword1() {

        if (validarContrasena(document.getElementById("password1").value)) {
            document.getElementById('password1').style.borderBottomColor = "#0DF93EAA";

        } else {
            document.getElementById('password1').style.borderBottomColor = "#C70039";

        }
    }

    function updateValueEmail() {

        if (validateEmail(document.getElementById("email").value)) {
            document.getElementById('email').style.borderBottomColor = "#0DF93EAA";

        } else {
            document.getElementById('email').style.borderBottomColor = "#C70039";

        }
    }

    return (
        <div className="formContainer">
            <div className="formWrapper">
                <img className="img4" src={add3} alt="" />
                <span className="logo">.</span>
                <span className="logo">Robbin</span>
                <span className="title">Iniciar sesión</span>
                <form onSubmit={handleSubmit}>

                    <input id="email" type="email" placeholder="Correo" required
                        onBlur={updateValueEmail} onKeyUp={updateValueEmail} />
                    <input id="password1" type="password" placeholder="Contraseña" required
                        onBlur={updateValuePassword1} onKeyUp={updateValuePassword1} />
                    <button type="submit" className="tam100P">Entrar</button>
                    {err && <span>Paso algo malo...</span>}
                </form>
                <p>¿No tienes cuenta? <a href="/register">Registrate</a></p>
                <div id="nombres">
                    <input type="file" name="File" id="File" style={{ display: "none" }} />
                </div>
            </div>
        </div>
    )
}

export default Login