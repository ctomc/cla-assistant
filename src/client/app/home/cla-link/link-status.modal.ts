import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { GithubRepo } from '../../shared/github/repo';
import { GithubOrg } from '../../shared/github/org';
import { Gist } from '../../shared/github/gist';


@Component({
  selector: 'link-status-modal',
  template: `
    <modal class="link-success">
      <modal-body *ngIf="visible">
        <div (click)="cancel()" class="fa fa-times" style="float:right; color:grey; cursor:pointer"></div>
        <div *ngIf="linkStatus==='linked'" class="row" style="text-align: center; font-size:26px; margin-top: 20px;" >
          Awesome!
        </div>
        <div *ngIf="linkStatus==='failed'" style="text-align: center; font-size:26px; margin-top: 20px;">
          Oops! Something went wrong!
        </div>

        <div class="row" style="margin:30px 50px">
          <div class="col-sm-12 center-block" class.well="linkStatus!=='loading'">
            <img *ngIf="linkStatus==='loading'" src="/assets/images/link_inactive.svg" class="spin-img" 
              style="margin:10px; margin-top:50%; margin-bottom:50%">
            <img *ngIf="linkStatus==='linked'" src="/assets/images/howto4.svg" class="icon">
            <div *ngIf="linkStatus==='failed'" class="col-sm-12 well center-block" style="position: relative; left: 0; top: 0;">
              <div>
                <img src="/assets/images/nervous_remove/nervous-36.svg"  style="position: relative;">
                <img src="/assets/images/nervous_remove/nervous_eye1-37.svg" class="eye-move2">
                <img src="/assets/images/nervous_remove/nervous_eye2-39.svg" class="eye-move">
                <img src="/assets/images/nervous_remove/nervous_drop-38.svg" class="nervous-drop">
                <img src="/assets/images/nervous_remove/nervous_drop-382.svg" 
                  style="width: 308px; margin-left: 20px;" class="nervous-drop2">
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="linkStatus === 'linked'" class="center-block row" style="font-size:18px;" >
          <p><b>{{gist.fileName}}</b> and <b>{{item.fullName ? item.fullName : item.login}}</b> <br>
          are now linked
          </p>
        </div>

        <div *ngIf="linkStatus==='linked'" style="text-align:center; margin-top: 30px;">
          <button class="btn btn-success" (click)="confirm()">Great, thanks!</button>
        </div>
      </modal-body>
    </modal>
  `
})
export class LinkStatusModal {
  @Output() private onClose = new EventEmitter<boolean>();
  private gist: Gist;
  private item: GithubRepo | GithubOrg;
  private linkStatus: string;

  @ViewChild(ModalComponent)
  private modal: ModalComponent;

  private visible = false;

  public open(gist: Gist, item: GithubRepo | GithubOrg) {
    this.gist = gist;
    this.item = item;
    this.linkStatus = 'loading';
    this.visible = true;
    this.modal.open();
  }
  public linkFailed() {
    this.linkStatus = 'failed';
  }
  public linkSuccess() {
    this.linkStatus = 'linked';
  }
  public confirm() {
    this.modal.close();
    this.visible = false;
    this.onClose.emit(true);
  }
  public cancel() {
    this.modal.close();
    this.visible = false;
    this.onClose.emit(false);
  }
}
