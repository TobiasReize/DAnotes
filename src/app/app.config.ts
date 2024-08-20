import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'da-notes-2105d',
          appId: '1:561338155715:web:f0294287ec91784dc65876',
          storageBucket: 'da-notes-2105d.appspot.com',
          apiKey: 'AIzaSyD1Jent3HD8SYXj_q82DU92Yi0QBIUnvhc',
          authDomain: 'da-notes-2105d.firebaseapp.com',
          messagingSenderId: '561338155715',
        })
      )
    ),
    importProvidersFrom(provideFirestore(() => getFirestore())),
  ],
};