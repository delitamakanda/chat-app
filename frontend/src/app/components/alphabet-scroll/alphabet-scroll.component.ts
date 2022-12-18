import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { GestureController } from '@ionic/angular';

@Component({
  selector: 'app-alphabet-scroll',
  templateUrl: './alphabet-scroll.component.html',
  styleUrls: ['./alphabet-scroll.component.scss'],
})
export class AlphabetScrollComponent implements OnInit, AfterViewInit {
  letters: any[] = [];
  @ViewChild('bar') sidebar!: ElementRef;
  lastOpen = '';
  @Output() letterSelected = new EventEmitter<string>();
  @Output() scrollingLetter = new EventEmitter<boolean>();

  constructor(private gestureCtrl: GestureController) {
    let str = 'ABCDEFGHIJKLMNOPQRSTVWXYZ';

    for (let i = 0; i < str.length; i++) {
      let nextChar = str.charAt(i);
      this.letters.push(nextChar);
    }
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    const moveGesture = this.gestureCtrl.create({
      el: this.sidebar.nativeElement,
      direction: 'y',
      threshold: 0,
      gestureName: 'move',
      onStart: (ev) => {
        this.scrollingLetter.emit(true);
      },
      onMove: (ev) => {
        // https://github.com/rossmartin/ionic2-alpha-scroll/blob/master/src/ion-alpha-scroll.ts
        const closestEl: any = document.elementFromPoint(ev.currentX, ev.currentY);

        if (closestEl && ['LI', 'A'].indexOf(closestEl.tagName) > -1) {
          const letter = closestEl.innerText;
          if (letter) {
            Haptics.impact({ style: ImpactStyle.Light });
            this.goToLetter(letter);
          }
        }
      },
      onEnd: () => {
        this.scrollingLetter.emit(false);
      }
    });

    // enable gestureCtrl
    moveGesture.enable(true);
  }

  goToLetter(letter: string) {
    if (this.lastOpen && this.lastOpen == letter) {
      return;
    }
    this.lastOpen = letter;
    this.letterSelected.emit(letter);
  }

}
