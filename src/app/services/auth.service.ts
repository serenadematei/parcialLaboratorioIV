import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, fetchSignInMethodsForEmail, signInWithEmailAndPassword } from '@angular/fire/auth';
import { User, UserCredential} from 'firebase/auth';
import { DatabaseService } from './database.service';
import { BehaviorSubject, Observable, from, map, switchMap } from 'rxjs';
import { collection, doc, getDoc, Firestore, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenKey = 'authToken';
  private loggedIn = false;
  private userData: any = {};
  private userRoleSubject = new BehaviorSubject<string | null>(
    localStorage.getItem('userRole')
  );
  userRole$ = this.userRoleSubject.asObservable();

  constructor(private authFirebase: Auth, private dataBase: DatabaseService, private firestore: Firestore) { }

  login({ email, password }: any) 
  {
    this.loggedIn = true;
    return signInWithEmailAndPassword(this.authFirebase, email, password)
    .then((userCredential: UserCredential) => {
      const user = userCredential.user;
      const token = '...';
        const userDocRef = doc(collection(this.firestore, 'users&role'), user.uid);

        getDoc(userDocRef)
          .then((userDoc) => {
            if (userDoc.exists()) {
              const userData = userDoc.data();
              const userRole = userData['role'];
              this.userRoleSubject.next(userRole);
              localStorage.setItem('userRole', userRole);
              this.dataBase.guardarLogin(email, userRole);
            } 
        
            else {

              console.error('Documento de usuario no encontrado en Firestore');
            }
          })
          .catch((error) => {

            console.error('Error al consultar Firestore:', error);
          });
  
        
        this.setAuthToken(token); 
        return userCredential;
        
      });
  }

  async register(email: string, password: string, userRole: string) {
    
    try {

      this.loggedIn = true;
      const userCredential = await createUserWithEmailAndPassword(this.authFirebase, email, password);
      const user = userCredential.user;
  
      const userDocRef = doc(collection(this.firestore, 'users&role'), user.uid);
      await setDoc(userDocRef, { email, role: userRole });
  

      this.dataBase.guardarLogin(email, userRole);
  

      await signInWithEmailAndPassword(this.authFirebase, email, password);
      return userCredential;
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      throw error;
    }
  }


  setAuthToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getAuthToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }


  async checkIfUserExists(email: string) {
    return fetchSignInMethodsForEmail(this.authFirebase, email)
      .then((signInMethods) => signInMethods && signInMethods.length > 0)
      .catch((error) => {
        console.error('Error al verificar el usuario:', error);
        return false;
      });
  }

  getCurrentUser(): Observable<User | null> {
    return new Observable((observer) => {
      const unsubscribe = this.authFirebase.onAuthStateChanged((user: User | null) => {
        observer.next(user);
      });
      return () => {
        unsubscribe();
      };
    });
  }

  getUserRole(): Observable<string | null> {
    return this.getCurrentUser().pipe(
      switchMap(user => {
        if (user) {
          const userDocRef = doc(this.firestore, `users&role/${user.uid}`);
          return from(getDoc(userDocRef)).pipe(
            map(docSnap => {
              const data = docSnap.data();
              return data ? data['role'] : null;
            })
          );
        } else {
          return from(Promise.resolve(null));
        }
      })
    );
  }

  isLoggedIn(): boolean {
    return !!this.getAuthToken();
  }

  logout() {
    this.loggedIn = false;
    localStorage.removeItem(this.tokenKey);
    return this.authFirebase.signOut();
  }
}