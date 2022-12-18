import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StartChatModalPageRoutingModule } from './start-chat-modal-routing.module';

import { StartChatModalPage } from './start-chat-modal.page';
import { SharedComponentsModule } from '../../components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StartChatModalPageRoutingModule,
    SharedComponentsModule,
  ],
  declarations: [StartChatModalPage]
})
export class StartChatModalPageModule {}
