import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc, addDoc, collection, collectionData, query, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, uploadString, ref, getDownloadURL, deleteObject } from 'firebase/storage';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  storage = inject(AngularFireStorage);
  utilsSvc = inject(UtilsService);

  //================= Autenticacion ========================
  getAuth() {
    return getAuth();
  }

  // ========Acceder ================
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // ========Crear Usuario ================
  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  //=========Actualizar usuario===========
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }

  //=========Enviar email para recuperar contrasena===========
  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  //======= Cerrar Sesion ==========
  SignOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth');
  }

  //=========Base de datos===========

  //=========Obtener documentos de una coleccion ===========
  getCollectionData(path: string, collectionQuery?: any) {
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, ...collectionQuery), { idField: 'id' });
  }

  //=========Setear un documento===========
  setDocument(Path: string, data: any) {
    return setDoc(doc(getFirestore(), Path), data);
  }

  //=========Actualizar un documento===========
  updateDocument(Path: string, data: any) {
    return updateDoc(doc(getFirestore(), Path), data);
  }

 //========= Eliminar un documento===========
 deleteDocument(Path: string) {
  return deleteDoc(doc(getFirestore(), Path));
}


  //======= Obterner un documento ==========
  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }


  //======= Agregar un documento ==========
  addDocument(Path: string, data: any) {
    return addDoc(collection(getFirestore(), Path), data);
  }


  //======= Almacenamiento ==========

  //======= Subir Imagen ==========
  async uploadImage(path: string, data_url: string) {
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(() => {
        return getDownloadURL(ref(getStorage(), path));
      }
    );
  }

  //======== Obtener ruta de la imagen con su url =========
  async getFilePath(url: string) {
    return ref(getStorage(), url).fullPath
  }

//======== Eliminar archivo =========
deleteFile(path: string){
return deleteObject(ref(getStorage(), path));
}


}
