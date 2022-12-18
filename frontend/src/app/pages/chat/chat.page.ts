import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import msgData from '../../../assets/data/msg.json';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  info = msgData;
  currentUserId = 0;
  @ViewChild(IonContent) content!: IonContent;

  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      this.content.scrollToBottom(400);
    }, 300);
  }

}
