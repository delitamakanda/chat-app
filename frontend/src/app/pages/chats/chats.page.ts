import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { StartChatModalPage } from '../start-chat-modal/start-chat-modal.page';
import chatData from './../../../assets/data/chats.json';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit {
  chats = chatData;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }


  async startChat() {
    const modal = await this.modalCtrl.create({
      component: StartChatModalPage,
      breakpoints: [0, 1],
      initialBreakpoint: 1,
      handle: false,
    });

    await modal.present();
  }

}
