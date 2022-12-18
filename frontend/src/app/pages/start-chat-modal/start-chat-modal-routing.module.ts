import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StartChatModalPage } from './start-chat-modal.page';

const routes: Routes = [
  {
    path: '',
    component: StartChatModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StartChatModalPageRoutingModule {}
