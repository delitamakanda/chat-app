import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatsPageRoutingModule } from './chats-routing.module';

import { ChatsPage } from './chats.page';
import { StartChatModalPageModule } from '../start-chat-modal/start-chat-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatsPageRoutingModule,
    StartChatModalPageModule,
  ],
  declarations: [ChatsPage]
})
export class ChatsPageModule {}
