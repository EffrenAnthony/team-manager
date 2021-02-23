import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Player } from '../interfaces/player';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private playersDb: AngularFireList<Player>;
  constructor(private db: AngularFireDatabase) {
    this.playersDb = this.db.list('/players', ref => ref.orderByChild('name'));
  }

  getPlayers(): Observable<Player[]> {
    return this.playersDb.snapshotChanges().pipe(
      map((changes) => {
        return changes.map(
          (c) => ({$key: c.payload.key, ...c.payload.val(), } as Player)
          );
      })
    );
  }

  // tslint:disable-next-line: typedef
  addPlayer(player: Player) {
    return this.playersDb.push(player);
  }

  // tslint:disable-next-line: typedef
  deletePlayer(id: string){
    this.db.list('/players').remove(id);
  }

  // tslint:disable-next-line: typedef
  editPlayer(newPlayerData: any) {
    const $key = newPlayerData.$key;
    delete(newPlayerData.$key);
    this.db.list('/players').update($key, newPlayerData);
  }

}
