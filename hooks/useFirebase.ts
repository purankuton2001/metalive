import {useEffect, useState} from "react";
import {FirebaseApp, initializeApp} from "firebase/app";
import {getAuth, onAuthStateChanged, User} from "@firebase/auth";

export default function useFirebase() {
    const [app, setApp] = useState<FirebaseApp>();
    const [user, setUser] = useState<User>();
    useEffect(() => {
        (async () => {
            const firebaseConfig = {
                apiKey: "AIzaSyD-wYoJ8IqL4dIU32cPxWI9YLwWIiuWfTM",
                authDomain: "metalive-348103.firebaseapp.com",
                projectId: "metalive-348103",
                storageBucket: "metalive-348103.appspot.com",
                messagingSenderId: "837344305223",
                appId: "1:837344305223:web:02cf9327bdefe91a2d1162",
                measurementId: "G-6H38G91K70"
            };
            const newApp = await initializeApp(firebaseConfig);
            setApp(newApp)
            const auth = await getAuth(newApp);
            onAuthStateChanged(auth, (user) => {
                setUser(user)
            })
        })();
    }, [])
    return {app, user};
}
