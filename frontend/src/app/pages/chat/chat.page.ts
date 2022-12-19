import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';
import { GestureController, IonContent, IonTextarea, Platform } from '@ionic/angular';
import msgData from '../../../assets/data/msg.json';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit, AfterViewInit {
  info = msgData;
  currentUserId = 0;
  @ViewChild(IonContent) content!: IonContent;
  // replyMsg: any = {
  //   id: '6139e7c6580e9b39d1c6bd79',
  //   from: 1,
  //   date: 'Wed Aug 25 2021 04:34:39 GMT+0200 (Central European Summer Time)',
  //   msg: 'test message reply'
  // };
  replyMsg: any = null;
  @ViewChildren('messagecols', { read: ElementRef }) messageCols!: QueryList<ElementRef>;
  @ViewChild('msginput') msginput!: IonTextarea;
  @ViewChild('footer', { read: ElementRef }) footer!: ElementRef;
  scrollPercentage!: number;

  constructor(
    private gestureCtrl: GestureController,
    private plt: Platform,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.scrollPercentage = 0;
  }

  ngOnInit() {
    setTimeout(() => {
      this.content.scrollToBottom(400);
    }, 300);
  }

  ngAfterViewInit(): void {
    this.messageCols.forEach((el, index) => {
      this.addSwipeGesture(el, index);
    });

    if (this.plt.is('ios') || this.plt.is('android')) {
      Keyboard.setResizeMode({ mode: KeyboardResize.None });
      Keyboard.addListener('keyboardWillShow', async(ev) => {
        const { keyboardHeight } = ev;
        this.footer.nativeElement.style.setProperty(
          'transform',
          `translateY(${keyboardHeight - 30}px)`
        );

        this.footer.nativeElement.style.setProperty(
          'transition',
          '.25s ease-out'
        );
      });

      Keyboard.addListener('keyboardWillHide', () => {
        this.footer.nativeElement.style.removeProperty('transform');
      });
    }
  }

  addSwipeGesture(el: ElementRef, index: number) {
    const style = el.nativeElement.style;
    const circle = el.nativeElement.children[0];
    let didVibrate = false;

    const swipeGesture = this.gestureCtrl.create({
      gestureName: `swipe-${index}`,
      el: el.nativeElement,
      direction: 'x',
      threshold: 10,
      onStart: (ev) => {
        const deltaX = ev.deltaX;
        const circleOpacity = Math.max(0, ev.deltaX / 130);

        circle.style.opacity = circleOpacity;

        if (deltaX > 0) {
          el.nativeElement.style.transform = `translateX(${deltaX}px)`;
        }

        if (ev.deltaX > 130 && !didVibrate) {
          Haptics.impact({ style: ImpactStyle.Light });
          didVibrate = true;
        }
      },
      onEnd: (ev) => {
        didVibrate = false;
        style.transition = 'O.2s ease-out';
        style.transform = '';
        circle.style.transition = style.transition;
        circle.style.opacity = 0;

        if (ev.deltaX > 130) {
          this.triggerReply(index);
        }
      }
    }, true);

  }

  triggerReply(index: number) {
    this.replyMsg = this.info.msgs[index];
    this.msginput.setFocus();
  }

  closeReply() {
    this.replyMsg = null;
  }

  async contentScrolled(ev: any) {
    const scrollElement = await this.content.getScrollElement();
    const scrollPosition = ev.detail.scrollTop;
    const totalContentHeight = scrollElement.scrollHeight;

    this.scrollPercentage = scrollPosition / (totalContentHeight - ev.target.clientHeight) + 0.001;
    this.changeDetectorRef.detectChanges();
  }

  scrollDown() {
    this.content.scrollToBottom(300);
  }

}
