import { Injectable } from '@angular/core';
import { Firestore, setDoc, doc, collection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private firestore: Firestore) { }

  guardarLogin(email: string | null, role: string | null) {
  
    const firebaseCollection = 'userLogin';
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    const loginDate = new Date().toLocaleDateString('es-ES', options);
    const loginData = {
      Usuario: email,
      Role: role,
      Fecha_Ingreso: loginDate,
    };
  
    const collectionRef = collection(this.firestore, firebaseCollection);
  
    setDoc(doc(collectionRef), loginData)
      .then(() => {
        console.log('Datos de LogIn guardados en Firestore');
      })
      .catch((error: any) => {
        console.error('Error al guardar datos de LogIn en Firestore: ', error);
      });
    }

   
}