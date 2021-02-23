import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Team } from '../interfaces/team';

export const TeamTableHeaders = ['Name', 'Country', 'Players'];
@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private teamsDb: AngularFireList<Team>;
  constructor(private db: AngularFireDatabase) {
    this.teamsDb = this.db.list('/teams', ref => ref.orderByChild('name'));
  }

  getTeams(): Observable<Team[]> {
    return this.teamsDb.snapshotChanges().pipe(
      map((changes) => {
        return changes.map(
          (c) => ({$key: c.payload.key, ...c.payload.val(), } as Team)
          );
      })
    );
  }

  // tslint:disable-next-line: typedef
  addTeam(team: Team) {
    return this.teamsDb.push(team);
  }

  // tslint:disable-next-line: typedef
  deleteTeam(id: string){
    this.db.list('/teams').remove(id);
  }

  // tslint:disable-next-line: typedef
  editTeam(newTeamData: any) {
    const $key = newTeamData.$key;
    delete(newTeamData.$key);
    this.db.list('/teams').update($key, newTeamData);
  }
}
