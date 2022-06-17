import { Component, OnInit } from '@angular/core';
import {
  Ubicacion,
  UbicacionService,
} from 'src/app/services/ubicacion.service';

import { Network } from '@capacitor/network';
import { Geolocation } from '@capacitor/geolocation';
import { Storage } from '@capacitor/storage';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  coordinates: any;
  nota: string;
  public online: string = '';
  my_ubic_offline = [];
  task: any;
  ubicacion: Ubicacion = {
    id: null,
    fechaentrada: null,
    fechasalida: null,
    nota: null,
    lat: null,
    long: null,
  };
  status: any;
  my_ubications: any;

  constructor(private service: UbicacionService) {
    this.logCurrentNetworkStatus();

    if (this.status == true) {
      //Podriamos quitarlo
      //Aqui habia un if se cambió
      while (this.my_ubic_offline.length > 0) {
        this.syncronize();

        //alert('Acabamos de guardar su progreso online');
      }
      Storage.set({
        key: 'my_ubications',
        value: JSON.stringify(this.my_ubic_offline),
      });
    } else {
      //const my_ubications = JSON.parse(localStorage.getItem('my_ubications'));
      /*const my_ubicationss = Storage.get({ key: 'my_ubications' }).then( ubic =>{
          const my_ubications = JSON.parse(ubic.value);
        });*/
      /*Storage.get({ key: 'my_ubications' }).then((ubic) => {
        this.my_ubications = JSON.parse(ubic.value);
        console.log(JSON.parse(ubic.value));
      });

      if (this.my_ubications != null && this.my_ubications.length > 0) {
        this.my_ubic_offline = this.my_ubications;
      }*/
      Storage.get({ key: 'my_ubications' }).then((ubic) => {
        this.my_ubications = JSON.parse(ubic.value);
        //console.log(this.my_ubications);
        this.my_ubic_offline = this.my_ubications;
      });
      console.log('offline');
    }
    /*setInterval(() => {
      if (navigator.onLine) {
        this.online = 'En linea';
        if (this.my_ubic_offline.length > 0) {
          this.syncronize();
          alert('Acabamos de guardar su progreso online');
        }
      } else {
        this.online = 'Fuera de linea';
        console.log('offline');
      }
    }, 5000); */
    //Timer
    /*this.task = setInterval(() => {
      if (navigator.onLine) {
        this.online = 'En linea';
        if (this.my_ubic_offline.length > 0) {
          this.syncronize();
          alert('Acabamos de guardar su progreso online');
        }
      } else {
        this.online = 'Fuera de linea';
        console.log('offline');
      }
    }, 5000);*/
    /*this.task = setInterval(() => {
      this.logCurrentNetworkStatus();
      if (this.status) {
        this.online = 'En linea';
        if (this.my_ubic_offline.length > 0) {
          this.syncronize();
          alert('Acabamos de guardar su progreso online');
        }
      } else {
        this.online = 'Fuera de linea';
        this.my_ubic_offline = JSON.parse(localStorage.getItem('my_ubications'));
        console.log('offline');
      }
    }, 5000)*/
  }

  ngOnInit(): void {
    /*navigator.geolocation.getCurrentPosition((position) => {
      this.ubicacion.lat = position.coords.latitude;
      this.ubicacion.long = position.coords.longitude;
    });*/
    Network.addListener('networkStatusChange', (status) => {
      console.log('Network status changed', status);
      if (status.connected == true) {
        this.online = 'En linea';
        this.status = true;
        while (this.my_ubic_offline.length > 0) {
          this.syncronize();

          //alert('Acabamos de guardar su progreso online');
        }
        Storage.set({
          key: 'my_ubications',
          value: JSON.stringify(this.my_ubic_offline),
        });
      } else {
        this.online = 'Fuera de linea';
        this.status = false;

        //const my_ubications = JSON.parse(localStorage.getItem('my_ubications'));
        /*const my_ubicationss = Storage.get({ key: 'my_ubications' }).then( ubic =>{
          const my_ubications = JSON.parse(ubic.value);
        });*/
        //Se quita?
        /*Storage.get({ key: 'my_ubications' }).then((ubic) => {
          this.my_ubications = JSON.parse(ubic.value);
          console.log(this.my_ubications);
        });*/

        /*if (this.my_ubications.length > 0) {
          this.my_ubic_offline = this.my_ubications;
        }*/
        console.log('offline');
      }
    });
  }

  async registrar() {
    if (this.status == true) {
      try {
        this.ubicacion.fechaentrada = Date.now().toString();
        this.ubicacion.fechasalida = Date.now().toString();
        this.ubicacion.nota = this.nota;
        //this.getCurrentPosition();
        this.coordinates = await Geolocation.getCurrentPosition();
        this.ubicacion.long = this.coordinates.coords.longitude;
        this.ubicacion.lat = this.coordinates.coords.latitude;

        this.service.onSaveUbic(this.ubicacion);
        this.ubicacion = {
          id: null,
          fechaentrada: null,
          fechasalida: null,
          nota: null,
          lat: null,
          long: null,
        };
        this.nota = '';
      } catch (e) {
        console.log(e);
        //alert(e);
      }
    } else {
      this.ubicacion.id = Date.now().toString();
      this.ubicacion.fechaentrada = Date.now().toString();
      this.ubicacion.fechasalida = Date.now().toString();
      this.ubicacion.nota = this.nota;
      this.coordinates = await Geolocation.getCurrentPosition();
      this.ubicacion.long = this.coordinates.coords.longitude;
      this.ubicacion.lat = this.coordinates.coords.latitude;
      /*Geolocation.getCurrentPosition().then((resp) =>{
        this.ubicacion.lat = resp.coords.latitude;
        this.ubicacion.long = resp.coords.longitude;
      }).catch((error) =>{
        console.log(error);
      });*/

      this.my_ubic_offline = this.my_ubic_offline || [];

      this.my_ubic_offline.push({
        id: this.ubicacion.id,
        ubication: this.ubicacion,
        action: 'create',
      });
      /*localStorage.setItem(
        'my_ubications',
        JSON.stringify(this.my_ubic_offline)
      );*/
      await Storage.set({
        key: 'my_ubications',
        value: JSON.stringify(this.my_ubic_offline),
      });

      this.ubicacion = {
        id: null,
        fechaentrada: null,
        fechasalida: null,
        nota: null,
        lat: null,
        long: null,
      };
      this.nota = '';
    }
  }

  async getCurrentPosition() {
    this.coordinates = await Geolocation.getCurrentPosition();
    this.ubicacion.long = this.coordinates.coords.longitude;
    this.ubicacion.lat = this.coordinates.coords.latitude;
  }

  async logCurrentNetworkStatus() {
    const network = await Network.getStatus();
    //console.log('Network status:', status);
    if (network.connected == true) {
      this.status = true;
      this.online = 'En línea';
    } else {
      this.status = false;
      this.online = 'Fuera de línea';
    }
  }

  async syncronize() {
    this.my_ubic_offline.forEach((record) => {
      switch (record.action) {
        case 'create':
          this.service.guardarOffline(record.ubication);
          break;
        default:
          console.log('Operacion no soportada');
      }
      this.my_ubic_offline.shift();
    });
    //localStorage.setItem('my_ubications', JSON.stringify(this.my_ubic_offline));
  }
}
