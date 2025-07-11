import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbserviceService {

  public db !: SQLiteObject;
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private sqlite: SQLite, private toastController: ToastController) {
    this.initDatabase();
  }

  private initDatabase() {
    if (!this.isDbReady.value) {
      this.sqlite.create({
        name: 'mydatabase.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        this.db = db;
        this.createTables();
        this.isDbReady.next(true);
        this.presentToast('Base de datos y tablas creadas con exito');
      })
      .catch(error => console.error(error));
    }

    
  }

  private createTables() {
    this.db.executeSql(`
      CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario TEXT,
      nombre TEXT,
      apellido TEXT,
      fechaNacimiento TEXT,
      password TEXT
      )`, [])
    .then(() => this.presentToast('TableCreated'))
    .catch(error => this.presentToast('Error creating table' + error));
  }

  validarUsuario (usuario: string, password: string) {
    return this.db.executeSql(`SELECT * FROM usuarios WHERE usuario = ? AND password = ?`, [usuario, password])
      .then((res) => {
        if (res.rows.length > 0) {
          return res.rows.item(0);
        } else {
          return null;
        }
      })
      .catch(error => this.presentToast('Error obteniendo usuario' + error));
  }

  async getUsers(): Promise<any[]> {
    if (!this.isDbReady.value) {
      await new Promise<void>(resolve => {
        const sub = this.isDbReady.subscribe(ready => {
          if (ready) {
            sub.unsubscribe();
            resolve();
          }
        });
      });
    }

    try {
      const result = await this.db.executeSql(`SELECT * FROM usuarios`, []);
      const users = [];
      for (let i = 0; i < result.rows.length; i++) {
        users.push(result.rows.item(i));
      }
      return users;
    } catch (error) {
      console.error('Error en getUsers:', error);
      return [];
    }
  }

  guardarUsuarios(users: any[]) {
    users.forEach(user => {
      this.db.executeSql(
        `INSERT OR REPLACE INTO usuarios(id, usuario, nombre, apellido, fechaNacimiento, password) VALUES (?, ?, ?, ?, ?, ?)`,
        [user.id, user.username, user.name, user.name, `24-06-2025`, user.username]
      ).catch(e => console.error('Error guardando post', e));
    });
  }

  insertUsuario(usuario: string, nombre: string, apellido: string, fechaNacimiento: string, password: string) {
    return this.db.executeSql(`
      INSERT INTO
        usuarios(usuario, nombre, apellido, fechaNacimiento, password) VALUES
        (?, ?, ?, ?, ?)
      `, [usuario, nombre, apellido, fechaNacimiento, password])
      // .then(() => this.presentToast('Usuario creado'))
      .catch(error => this.presentToast('Error creando usuario' + error));
  }

  private async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  getIsDbReady() {
    return this.isDbReady.asObservable();
  }


}
