import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import add from "../img/bluebird_56.png";
import add3 from "../img/logo_robbin.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
// ES6 Modules or TypeScript
import Swal from 'sweetalert2'
import { async } from "@firebase/util";

const Register = () => {

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

    const [err, setErr] = useState(false);
    const navigate = useNavigate();




    function validateImage() {
        if (document.querySelector('#File').files.length == 0) {
            console.log("imagen no agregada");
            return true;
        } else {
            console.log("imagen agregada");
            return false;
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

    function validarNombre(nombreAValidar) {
        //validamos que sea el formato de nombre correcto
        var regExpNombre = /^[A-ZÁÉÍÓÚÑ ]+$/i.test(nombreAValidar);
        //console.log("La contraseña a validar es: "+passwordAValidar);

        if (regExpNombre) {
            console.log("Nombre/apellido correcto");
            return true;
        } else {
            console.log("Nombre/apellido incorrecto");
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

    function updateValueNombres() {

        if (validarNombre(document.getElementById("nombres").value)) {
            document.getElementById('nombres').style.borderBottomColor = "#0DF93EAA";

        } else {
            document.getElementById('nombres').style.borderBottomColor = "#C70039";

        }
    }


    const handleChange = (e) => {
        var fileName = document.getElementById("File").value;
        var idxDot = fileName.lastIndexOf(".") + 1;
        var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();

        if (extFile == "jpg" || extFile == "jpeg" || extFile == "png") {
            let archivo = document.querySelector('#File');
            document.querySelector('#tituloArchivo').innerHTML = 'Imagen agregada:';
            document.querySelector('#nombreArchivo').innerHTML = archivo.files[0].name;
            console.log(archivo.files);
            for (let i = 0; i < archivo.files.length; i++) {
                const element = URL.createObjectURL(archivo.files[i]);
                const imagen = document.createElement('img');
                imagen.src = element;
                //document.body.appendChild(imagen);
                document.querySelector('#imagenSubida').src = imagen.src;
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: '¡Tipo de imagen incorrecto!',
                text: 'Seleccione imagen con extensión: .jpg, .jpeg o .png.',
                confirmButtonText: 'Reintentar',
            })
        }



    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const file = e.target[3].files[0];

        if (!validarNombre(document.getElementById('nombres').value)) {
            Swal.fire({
                icon: 'error',
                title: '¡Registro no exitoso!',
                text: 'El nombre debe contener solo letras y espacios en blanco.',
                confirmButtonText: 'Reintentar',
            })

        } else {

            if (!validateEmail(document.getElementById('email').value)) {
                console.log('No se muesta el email');
                Swal.fire({
                    icon: 'error',
                    title: '¡Registro no exitoso!',
                    text: 'Ingrese un correo válido.',
                    confirmButtonText: 'Reintentar',
                })
            } else {

                if (!validarContrasena(document.getElementById('password1').value)) {
                    Swal.fire({
                        icon: 'error',
                        title: '¡Registro no exitoso!',
                        text: 'La contraseña debe contener al menos 1 mayúscula, 1 minúscula, 1 número y 1 caracter especial.',
                        confirmButtonText: 'Reintentar',
                    })
                } else {

                    /*let valorN = document.getElementById('nombres').value;
        
                    if(valorN === undefined) {
                      //document.getElementById('password1').value = '';
                      valorN = 'está vacío';
                    } else {
                      valorN = 'tiene texto';
                    }*/

                    if (validateImage()) {
                        Swal.fire({
                            icon: 'warning',
                            title: '¡Imagen no cargada!',
                            text: 'Debes cargar una imagen',
                            confirmButtonText: 'Agregar imagen',
                            // showDenyButton: true,
                            // denyButtonText: `Agregar imagen`,
                            // denyButtonColor: '#6f7880',
                        })
                        // .then((result) => {
                        //     /* Read more about isConfirmed, isDenied below */
                        //     if (result.isConfirmed) {
                        //         Swal.fire({
                        //             icon: 'success',
                        //             title: '¡Registro exitoso!',
                        //             text: 'Se registró exitosamente.',
                        //             confirmButtonText: 'Volver al inicio de sesión',
                        //         }).then((value) => {
                        //             myRegistro(email, password, displayName, file)
                        //         })
                        //     } else if (result.isDenied) {
                        //         //console.log('Valor del input: ' + valorN);
                        //     }
                        // })



                    } else {
                        myRegistro(email, password, displayName, file)


                    }


                }

            }

        }
    };

    async function myRegistro(email, password, displayName, file) {
        //const auth = getAuth();
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            //const storage = getStorage();
            const storageRef = ref(storage, displayName);

            /*const uploadTask = await uploadBytesResumable(storageRef, file);
        
            uploadTask.on(
            (error) => {
                setErr(true);
            },*/
            await uploadBytesResumable(storageRef, file).then(() => {
                //getDownloadURL(uploadTask.snapshot.ref).then( async (downloadURL) => {
                getDownloadURL(storageRef).then(async (downloadURL) => {
                    await updateProfile(res.user, {
                        displayName,
                        photoURL: downloadURL,
                    });
                    await setDoc(doc(db, "users", res.user.uid), {
                        uid: res.user.uid,
                        displayName,
                        email,
                        photoURL: downloadURL
                    });

                    await setDoc(doc(db, "userChats", res.user.uid), {});
                    //await setDoc(doc(db, "userGroups", res.user.uid), {});
                    Swal.fire({
                        icon: 'success',
                        title: '¡Registro exitoso!',
                        text: 'Se registró exitosamente.',
                        confirmButtonText: 'Continuar',
                    }).then((value) => {
                        navigate("/");
                    })


                });
            }
            );
        } catch (err) {
            //setErr(true);
            Swal.fire({
                icon: 'error',
                title: '¡Datos incorrectos!',
                text: 'Ingrese el nombre, correo, contraseña o imagen correctamente.',
                confirmButtonText: 'Reintentar',
            })
        }

    }

    const ref = useRef(null);
    useEffect(() => {
        const handleClick = event => {
          console.log('Vamos a el inicio de sesión.');
          navigate("/login");
        };
    
        const element = ref.current;
    
        element.addEventListener('click', handleClick);
    
        return () => {
          element.removeEventListener('click', handleClick);          
        };
      }, []);

    return (
        <div className="formContainer">
            <div className="formWrapper">
                <img className="img4" src={add3} alt="" />
                <span className="logo">.</span>
                <span className="logo">Robbin</span>
                <span className="title">Registrar cuenta</span>
                <form onSubmit={handleSubmit} method="get" id="formLR">

                    <input id="nombres" type="text" placeholder="Nombre" required
                        onBlur={updateValueNombres} onKeyUp={updateValueNombres} />

                    <input id="email" type="email" placeholder="Correo" required
                        onBlur={updateValueEmail} onKeyUp={updateValueEmail} />

                    <input id="password1" type="password" placeholder="Contraseña" required
                        onBlur={updateValuePassword1} onKeyUp={updateValuePassword1} />

                    <input style={{ display: "none" }} type="file" id="File" accept="image/*"
                        onChange={handleChange} />
                    <label htmlFor="File">
                        <img id="imagenSubida" src={add} alt="" />

                        <div>
                            <span id="tituloArchivo">Agregar imagen</span>
                            <br />
                            <span id="nombreArchivo"></span>
                        </div>



                    </label>
                    <button className="tam100P">Registrarse</button>
                    {err && <span>Paso algo malo...</span>}
                </form>
                <p>¿Ya tienes cuenta? <a className="enlacePrincipal" ref={ref}>Inicia sesión</a></p>
                {/* <p>¿Ya tienes cuenta? <a href="/login">Inicia sesión</a></p> */}
                <div></div>
            </div>
        </div>
    )
}

export default Register