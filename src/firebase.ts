/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
import { initializeApp } from "firebase/app"
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth"
import { getFirestore, serverTimestamp, setDoc, doc } from "firebase/firestore"
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "dashboard-90215.firebaseapp.com",
  projectId: "dashboard-90215",
  storageBucket: "dashboard-90215.appspot.com",
  messagingSenderId: "599747211324",
  appId: "1:599747211324:web:9c45c60f1d86c138979339",
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const auth = getAuth(app)

//functions
export const login = async (email: string, password: string) => {
  let error = null
  let user = null
  try {
    const res = await signInWithEmailAndPassword(auth, email, password)
    user = res.user
  } catch (err) {
    const errorCode = err.code
    const errorMessage = err.message
    console.log(`${errorCode}: ${errorMessage}`)
    error = { code: errorCode, message: errorMessage }
  }

  return { user, error }
}

export const signUp = async (email: string, password: string) => {
  let error = null
  let user = null
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password)
    user = res.user
  } catch (err) {
    const errorCode = err.code
    const errorMessage = err.message
    console.log(`${errorCode}: ${errorMessage}`)
    error = { code: errorCode, message: errorMessage }
  }

  return { user, error }
}

export const createDoc = async (data: object, table: string, uid: string) => {
  let res = null
  try {
    res = await setDoc(doc(db, table, uid), {
      ...data,
      timestamp: serverTimestamp(),
    })
  } catch (error) {
    return error
  }

  return res
}

export const uploadImage = (
  file: File,
  setData: React.Dispatch<React.SetStateAction<any>>,
  setPerct: React.Dispatch<React.SetStateAction<number>>
) => {
  const uniqueName = new Date().getTime() + file.name
  const storageRef = ref(storage, uniqueName)

  const uploadTask = uploadBytesResumable(storageRef, file)

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      setPerct(progress)
    },
    (err) => {
      console.log(err)
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((url) =>
        setData((prev) => ({ ...prev, imageUrl: url }))
      )
    }
  )
}
