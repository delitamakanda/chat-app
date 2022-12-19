import { Component, OnInit, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  @ViewChild(IonTabs) tabs!: IonTabs;
  selected: string = 'chats';
  cameraIsActive = false;

  constructor() { }

  ngOnInit() {
  }

  setSelectedTab() {
    setTimeout(() => {
      this.selected = this.tabs.getSelected() || 'chats';
      this.cameraIsActive = this.selected == 'camera';
    }, 0);
  }

}
