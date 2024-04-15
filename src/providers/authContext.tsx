import React, { createContext, useEffect, useState } from "react";

import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { firebaseErrors } from "../constants/firebaseErrors";
import { auth, db, googleProvider } from "../firebase";

import { User, signInWithPopup } from "@firebase/auth";
import {
  addDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "@firebase/firestore";
import { collection } from "firebase/firestore";

export const usersCollection = collection(db, "users");

type IUser = {
  email: string;
  username: string;
  firebaseUid: string;
  id: string;
};

interface AuthContextType {
  currentUser: null | User;
  signUp:
    | (() => void)
    | ((email: string, password: string, userName: string) => Promise<boolean>);
  signIn:
    | (() => void)
    | ((email: string, password: string) => Promise<boolean>);
  signOutUser: () => void;
  loading: boolean;
  firestoreUser: null | IUser;
  updateFirestoreUser: (() => void) | ((data: IUser) => void);
  signInViaGoogle: () => Promise<unknown>;
}

const defaultValue = {
  currentUser: null,
  signUp: () => {},
  signIn: () => {},
  signOutUser: () => {},
  loading: true,
  firestoreUser: null,
  updateFirestoreUser: () => {},
  signInViaGoogle: () => new Promise((resolve) => {}),
};

const AuthContext = createContext<AuthContextType>(defaultValue);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [firestoreUser, setFirestoreUser] = useState<null | IUser>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user?.uid) {
        const q = query(usersCollection, where("firebaseUid", "==", user.uid));
        const querySnapshot = await getDocs(q);

        setFirestoreUser({
          ...querySnapshot.docs[0]?.data(),
          id: querySnapshot.docs[0]?.id,
        } as IUser);
      } else {
        setFirestoreUser(null);
      }
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUser?.uid) {
      const q = query(
        usersCollection,
        where("firebaseUid", "==", currentUser.uid)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        setFirestoreUser({
          ...querySnapshot.docs[0].data(),
          id: querySnapshot.docs[0].id,
        } as IUser);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [currentUser]);

  const updateFirestoreUser = async (data: IUser) => {
    if (firestoreUser?.id) {
      const docRef = doc(db, "users", firestoreUser?.id);

      try {
        await updateDoc(docRef, {
          ...firestoreUser,
          ...data,
        });
      } catch (err) {
        // @ts-ignore
        alert(firebaseErrors[err.code]);
      }
    }
  };

  const signInViaGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      setCurrentUser(result.user);

      const q = query(
        usersCollection,
        where("firebaseUid", "==", result.user.uid)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.docs.length === 0) {
        await addDoc(usersCollection, {
          email: result.user.email,
          username: result.user.displayName,
          firebaseUid: result.user.uid,
        });
      }

      return true;
    } catch (err) {
      // @ts-ignore
      console.error("Google Sign In Error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userName: string) => {
    setLoading(true);
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);

      await addDoc(usersCollection, {
        email,
        userName,
        firebaseUid: user.user.uid,
      });

      return true;
    } catch (error) {
      console.error("Sign Up Error:", error);

      // @ts-ignore
      alert(firebaseErrors[error.code]);

      return false;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error("Sign In Error:", error);

      // @ts-ignore
      alert(firebaseErrors[error.code]);

      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign Out Error:", error);
    }
  };

  const value = {
    currentUser,
    signUp,
    signIn,
    signOutUser,
    loading,
    firestoreUser,
    updateFirestoreUser,
    signInViaGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
