import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DbserviceService {

  public db !: SQLiteObject | any;
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private isNativePlatform: boolean = false;

  constructor(private sqlite: SQLite, private toastController: ToastController, private platform: Platform) {
    this.isNativePlatform = this.platform.is('cordova') || this.platform.is('capacitor');
    this.initDatabase();
  }

  private async initDatabase() {
    if (this.isNativePlatform) {
      // Entorno nativo (móvil)
      try {
        const db = await this.sqlite.create({
          name: 'mydatabase.db',
          location: 'default'
        });
        this.db = db;
        await this.createTables();
        this.isDbReady.next(true);
      } catch (error) {
        console.error('Error al crear la base de datos nativa', error);
        this.isDbReady.next(false);
      }
    } else {
      // Entorno web
      try {
        // Usamos IndexedDB como alternativa para web
        await this.initWebDatabase();
        await this.createTables();
        this.isDbReady.next(true);
      } catch (error) {
        console.error('Error al crear la base de datos web', error);
        this.isDbReady.next(false);
      }
    }
  }

  private async initWebDatabase(): Promise<void> {
    // Implementación simulada para web
    return new Promise((resolve) => {
      this.db = {
        executeSql: (sql: string, params: any[]) => {
          console.log('[Web DB] Ejecutando:', sql, params);
          return Promise.resolve({
            rows: {
              length: 0,
              item: () => null
            }
          });
        }
      };
      resolve();
    });
  }

  private async createTables() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario TEXT,
        nombre TEXT,
        apellido TEXT,
        fechaNacimiento TEXT,
        password TEXT
      )`;
    
    try {
      await this.db.executeSql(createTableQuery, []);
    } catch (error) {
      console.error('Error creando tabla', error);
    }
  }

  validarUsuario (usuario: string, password: string) {
    return this.db.executeSql(`SELECT * FROM usuarios WHERE usuario = ? AND password = ?`, [usuario, password])
      .then((res: { rows: { length: number; item: (arg0: number) => any; }; }) => {
        if (res.rows.length > 0) {
          return res.rows.item(0);
        } else {
          return null;
        }
      })
      .catch((error: string) => this.presentToast('Error obteniendo usuario' + error));
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
      ).catch((e: any) => console.error('Error guardando post', e));
    });
  }

  insertUsuario(usuario: string, nombre: string, apellido: string, fechaNacimiento: string, password: string) {
    return this.db.executeSql(`
      INSERT INTO
        usuarios(usuario, nombre, apellido, fechaNacimiento, password) VALUES
        (?, ?, ?, ?, ?)
      `, [usuario, nombre, apellido, fechaNacimiento, password])
      // .then(() => this.presentToast('Usuario creado'))
      .catch((error: string) => this.presentToast('Error creando usuario' + error));
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
