import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { take, map } from 'rxjs/operators';
import { Country, SquadNumber, Player } from '../interfaces/player';
import { PlayerService } from '../services/player.service';
import { TeamService } from '../services/team.service';
import { Team } from '../interfaces/team';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-player-dialog',
  templateUrl: './player-dialog.component.html',
  styleUrls: ['./player-dialog.component.scss']
})
export class PlayerDialogComponent implements OnInit {
  @Input()  player: Player | undefined;
  @Output() closeDialog: EventEmitter<boolean> = new EventEmitter();
  private team: any;
  public countries = Object.keys(Country)
  .map(key => ({
    label: key,
    key: (Country as any)[key]
  }));
  public squadNumber = Object.keys(SquadNumber)
    .slice(Object.keys(SquadNumber).length / 2)
    .map(key => ({
      label: key,
      key: SquadNumber[key as any]
    }));
  constructor(private playerService: PlayerService, private teamService: TeamService) { }

  ngOnInit(): void {
    this.teamService
      .getTeams()
      .pipe(take(1))
      .subscribe(teams => {
        if (teams.length > 0) {
          this.team = teams[0];
        }
      });
  }

  // tslint:disable-next-line: typedef
  private newPlayer(playerFormValue: any) {
    const key = this.playerService.addPlayer(playerFormValue).key;
    const playerFormValueKey = {
      ...playerFormValue,
      key
    };
    const formattedTeam = {
      ...this.team,
      players: [...(this.team.players ? this.team.players : []), playerFormValueKey]
    };
    this.teamService.editTeam(formattedTeam);
  }

  // tslint:disable-next-line: typedef
  private editPlayer(playerFormValue: any){
    const playerFormValuerWithKey = {...playerFormValue, $key: this.player?.$key};
    const playerFormValueWithFormattedKey = {...playerFormValue, key: this.player?.$key};
    delete playerFormValueWithFormattedKey.$key;
    const moddifiedPlyaers = this.team.players ?
      this.team.players.map((player: { key: string | undefined; }) => {
        return player.key === this.player?.$key ? playerFormValueWithFormattedKey : player;
      })
      : this.team.players;
    const  formattedTeam = {
      ...this.team,
      players: [...(moddifiedPlyaers ? moddifiedPlyaers : [playerFormValueWithFormattedKey])]
    };
    this.playerService.editPlayer(playerFormValuerWithKey);
    this.teamService.editTeam(formattedTeam);
  }

  // tslint:disable-next-line: typedef
  onSubmit(playerForm: NgForm) {
    const playerFormValue = {...playerForm.value};
    if (playerForm.valid) {
      playerFormValue.leftFooted = playerFormValue.leftFooted === '' ? false : playerFormValue.leftFooted;
    }
    if (this.player){
      this.editPlayer(playerFormValue);
    }else{
      this.newPlayer(playerFormValue);
    }
    window.location.replace('#');
  }

  // tslint:disable-next-line: typedef
  onClose(){
    this.closeDialog.emit(true);
  }
}
