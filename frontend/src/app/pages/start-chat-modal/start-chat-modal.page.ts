import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { IonItemGroup, ModalController } from '@ionic/angular';
import contactData from '../../../assets/data/contacts.json';

@Component({
  selector: 'app-start-chat-modal',
  templateUrl: './start-chat-modal.page.html',
  styleUrls: ['./start-chat-modal.page.scss'],
})
export class StartChatModalPage implements OnInit {
  contacts: any[] = [];
  @ViewChildren(IonItemGroup, { read: ElementRef }) itemGroups!: QueryList<any>;
  scroll = true;

  constructor(private modalCtrl: ModalController) { }

  scrollToLetter(letter: string) {
    for(let i = 0; i < this.contacts.length; i++) {
      const group = this.contacts[i];
      if (group.key == letter) {
        const group = this.itemGroups.filter((element, idx) => idx === i);
        if (group) {
          const el: any = group[0];
          el.nativeElement.scrollIntoView();
        }
        return;
      }
    }
  }

  letterScrollActive(active: boolean) {
    this.scroll = active;
  }

  ngOnInit() {
    const sorted = contactData.sort((a, b) => {
      if (a.last_name < b.last_name) {
        return -1;
      }
      if (a.last_name > b.last_name) {
        return 1;
      }
      return 0;
    });

    let last = null;
    for (let i = 0; i < sorted.length; i++) {
      const contact = sorted[i];

      if (!last || last != contact.last_name[0]) {
        last = contact.last_name[0];
        this.contacts.push({ key: last, contacts: []});
      }
      this.contacts[this.contacts.length - 1].contacts.push(contact);
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
