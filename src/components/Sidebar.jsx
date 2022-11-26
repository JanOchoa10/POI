import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Search from "./Search";
import Chats from "./Chats";
import Logout from "./Logout";
import { getDatabase, ref, set, get, child, onValue, onDisconnect, push, query } from "firebase/database";

const Sidebar = () => {

    const rooms2 = []
    const [misUsuariosRealTime2, setMisURT2] = useState(null);

    // if (misUsuariosRealTime2 == null) {
    //     get(child(ref(getDatabase()), 'users/')).then((snapshot) => {
    //         snapshot.forEach((child) => {
    //             // console.log(child.val());
    //             rooms2.push(child.val());
    //         })
    //         setMisURT2(rooms2)
    //     });
    // }

    // useEffect(() => {
    //     const getUsers = () => {
    //         const unsub =

    //             get(child(ref(getDatabase()), 'users/')).then((snapshot) => {
    //                 snapshot.forEach((child) => {
    //                     // console.log(child.val());
    //                     rooms2.push(child.val());
    //                 })
    //                 setMisURT2(rooms2)
    //             });

    //         // onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
    //         //     setChats(doc.data())
    //         // });

    //         return () => {
    //             if (misUsuariosRealTime2 == null) {
    //                 unsub();
    //             }
    //         };


    //     };


    //     getUsers()


    // }, []);



    // console.error("Mi info")
    // console.log(misUsuariosRealTime2)

    if (misUsuariosRealTime2 == null) {
        const db = getDatabase();
        const myUsers = ref(db, 'users/');
        onValue(myUsers, (snapshot) => {
            const data = snapshot.val();
            setMisURT2(data);
        });
    }
    console.log(misUsuariosRealTime2)

    return (
        <div className="sidebar">
            <Navbar />
            <Search />
            <Chats conexiones={misUsuariosRealTime2} />
            <Logout />
        </div>
    )
}

export default Sidebar