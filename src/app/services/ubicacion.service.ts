import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Timestamp } from '@firebase/firestore';
import { Observable } from 'rxjs';

export interface Ubicacion {
  id: string;
  fechaentrada: string;
  fechasalida: string;
  nota: string;
  lat: number;
  long: number;
}

@Injectable({
  providedIn: 'root',
})
export class UbicacionService {
  ubicaciones: Observable<any>;
  private ubicaCollection: AngularFirestoreCollection<Ubicacion>;
  constructor(private readonly firestore: AngularFirestore) {
    this.ubicaciones = firestore.collection('ubicacion').valueChanges();
  }

  async onSaveUbic(ubicForm: Ubicacion): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const id = this.firestore.createId();
        //const result = this.ubicaCollection.doc(id).set(ubicForm);
        ubicForm.id = id;
        const result = this.firestore.collection('ubicacion').doc(ubicForm.id).set(ubicForm);
        resolve(result);
      } catch (error) {
        reject(error.message);
      }
    });
  }

  async guardarOffline(ubicForm: Ubicacion): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = this.firestore.collection('ubicacion').doc(ubicForm.id).set(ubicForm);
        resolve(result);
      } catch (error) {
        reject(error.message);
      }
    });
  }
}
