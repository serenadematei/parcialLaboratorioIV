import { Injectable } from '@angular/core';
import { DocumentData, DocumentReference, Firestore, QuerySnapshot, addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import Swal from 'sweetalert2';

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
        // console.log('Inicio de sesión guardado en Firestore');
      })
      .catch((error: any) => {
        // console.error('Error al guardar en Firestore: ', error);
      });
    }

  

    agregar(coleccion: string, data: any) {
      const ref = collection(this.firestore, coleccion);
    
      const q = query(ref, where('nombre', '==', data.nombre));
    
      return getDocs(q)
        .then((querySnapshot: QuerySnapshot<DocumentData>) => {

          if (!querySnapshot.empty) {

            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'El nombre ya está en uso. Por favor, elige otro nombre.'
            });
            return;
          } else {
 
            return addDoc(ref, data)
              .then((docRef: DocumentReference) => {

                Swal.fire({
                  icon: 'success',
                  title: 'Éxito',
                  text: 'El elemento se ha agregado correctamente.'
                });
                window.location.reload();
              })
              .catch((error: any) => {
        
                console.error('Error al agregar el documento: ', error);
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'No se pudo agregar el elemento. Inténtalo de nuevo.'
                });
              });
          }
        })
        .catch((error: any) => {
    
          console.error('Error al consultar la base de datos: ', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo verificar la existencia del nombre. Inténtalo de nuevo.'
          });
        });
    }
        
    
   
    async obtenerInfo(coleccion: string): Promise<DocumentData[]> {
      const ref = collection(this.firestore, coleccion);
      const q = query(ref, orderBy('nombre'));
  
      const querySnapshot = await getDocs(q);
  
      return querySnapshot.docs.map((doc) => doc.data());
    }
      

    
    actualizar(elemento: any) {
      const elementoCollection = collection(this.firestore, 'elementos');
      const q = query(elementoCollection, where('nombre', '==', elemento.nombre));
    
      getDocs(q)
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            updateDoc(doc.ref, {
              tipo: elemento.tipo,
              peso: elemento.peso,
              precio: elemento.precio,
            })
              .then(() => {
                Swal.fire({
                  icon: 'success',
                  title: 'Éxito',
                  text: 'El elemento se ha actualizado correctamente.',
                });
                //window.location.reload();
              })
              .catch((error) => {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'No se pudo actualizar el elemento. Inténtalo de nuevo.',
                });
              });
          });
        })
        .catch((error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo obtener los documentos. Inténtalo de nuevo.',
          });
        });
    }

    eliminar(elemento: any) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Una vez eliminado, no podrás recuperar este elemento.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          const elementosCollection = collection(this.firestore, 'elementos');
          const q = query(elementosCollection, where('nombre', '==', elemento.nombre));
    
          getDocs(q).then((querySnapshot) => {
            let documentosEliminados = 0;
    
            querySnapshot.forEach((doc) => {
              if (documentosEliminados > 0) {
                return;
              }
    
              const data = doc.data();
              if (data['nombre'] === elemento.nombre) {
                deleteDoc(doc.ref)
                  .then(() => {
                    documentosEliminados++;
                    Swal.fire({
                      icon: 'success',
                      title: 'Éxito',
                      text: 'El elemento se ha eliminado correctamente.'
                    }).then(() => {
                      //window.location.reload();
                    });
                  })
                  .catch((error) => {
                    Swal.fire({
                      icon: 'error',
                      title: 'Error',
                      text: 'No se pudo eliminar el elemento. Inténtalo de nuevo.'
                    });
                  });
              }
            });
          }).catch((error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo obtener los documentos. Inténtalo de nuevo.'
            });
          });
        }
      });
    }
      
    
}