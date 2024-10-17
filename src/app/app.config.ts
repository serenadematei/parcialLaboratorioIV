import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import {provideAuth,getAuth} from '@angular/fire/auth';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),provideHttpClient(),
  ([
    provideFirebaseApp(()=>initializeApp(firebaseConfig)),
    provideFirestore(()=>getFirestore()),
     provideAuth(() => getAuth())
  ])]
};

const firebaseConfig = {
  apiKey: "AIzaSyA8qcOM5eP46EsTLOgQzmEWLYb6VtLN4L8",
  authDomain: "parcial-1db0f.firebaseapp.com",
  projectId: "parcial-1db0f",
  storageBucket: "parcial-1db0f.appspot.com",
  messagingSenderId: "889652921341",
  appId: "1:889652921341:web:e3b974881830c337f68f94"
};