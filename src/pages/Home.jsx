import React from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";

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


    return (
        
        <div className="home">
            <div className="container">
                <Sidebar/>
                <Chat/>
            </div>
            
        </div>
        
    )
}

export default Home