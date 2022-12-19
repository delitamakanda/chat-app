import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';
import { GestureController, IonContent, IonTextarea, ModalController, Platform } from '@ionic/angular';
import storyData from './../../../assets/data/story.json';

@Component({
  selector: 'app-story',
  templateUrl: './story.page.html',
  styleUrls: ['./story.page.scss'],
})
export class StoryPage implements OnInit, AfterViewInit {

  info = storyData as {
    stories: [{date: string, text: string, img: string}];
    from: string,
    image: string,
  };

  activeStory: any = null;
  progress: any = [];
  timer = 0;
  runningTimer: any = null;
  pauseTimer = false;
  replyVisible = false;
  hideBar = false;

  @ViewChild('msginput') msginput!: IonTextarea;
  @ViewChild(IonContent, { read: ElementRef }) content!: ElementRef;
  @ViewChild('replybtn', { read: ElementRef }) replyBtn!: ElementRef;
  @ViewChild('label', { read: ElementRef }) label!: ElementRef;
  @ViewChild('border', { read: ElementRef }) border!: ElementRef;

  constructor(
    private plt: Platform,
    private modalCtrl: ModalController,
    private gestureCtrl: GestureController,
  ) { }

  ngOnInit() {
    this.activeStory = 0;
    this.progress = this.info.stories.map(() => 0);
    this.startTimer();
  }

  startTimer() {
    this.timer = 0;
    clearTimeout(this.runningTimer);
    this.runTimer();
  }

  runTimer() {
    this.runningTimer = setTimeout(() => {
      if (this.pauseTimer) {
        this.runTimer();
        return;
      }
      this.timer += 10;
      this.progress[this.activeStory] = this.timer / 50;

      if (this.timer === 5000) {
        this.nextStory();
      } else {
        this.runTimer();
      }
    }, 10);
  }

  nextStory() {
    this.progress[this.activeStory] = 100;

    if (this.activeStory + 1 < this.info.stories.length) {
      this.activeStory += 1;
      this.startTimer();
    } else {
      this.close();
    }
  }

  previousStory() {
    this.progress[this.activeStory] = 0;
    if (this.activeStory > 0) {
      this.activeStory -= 1;
      this.startTimer();
    }
  }

  ngAfterViewInit(): void {
    const moveGesture = this.gestureCtrl.create({
      el: this.replyBtn.nativeElement,
      threshold: 0,
      gesturePriority: 10,
      direction: 'y',
      gestureName: 'move',
      onStart: (ev) => {
        this.pauseTimer = true;
      },
      onMove: (ev) => {
        const currentY = ev.deltaY;
        const opacity = 1 - Math.max(0, (currentY * -1) / 200);

        this.label.nativeElement.style.opacity = opacity;
        this.border.nativeElement.style.opacity = opacity;

        this.replyBtn.nativeElement.style.transform = `translateY(${currentY}px)`;
        this.replyBtn.nativeElement.style.opacity = Math.max(0, opacity / 2);
      },
      onEnd: (ev) => {
        const transition = '0.2s ease-out';
        this.label.nativeElement.style.opacity = 1;
        this.border.nativeElement.transition = transition;

        this.border.nativeElement.style.opacity = 1;
        this.border.nativeElement.transition = transition;

        this.replyBtn.nativeElement.style.opacity = 1;
        this.replyBtn.nativeElement.style.transform = ``;
        this.replyBtn.nativeElement.transition = transition;

        if (ev.deltaY < -200) {
          this.reply();
        } else {
          this.pauseTimer = false;
        }
      }
    }, true);

    moveGesture.enable(true);

    Keyboard.setResizeMode({ mode: KeyboardResize.Ionic });


    let hideBgTimeout: any = null;
    let clipValue = 0;
    const longPress = this.gestureCtrl.create({
      el: this.content.nativeElement,
      threshold: 0,
      gesturePriority: 1,
      passive: true,
      gestureName: 'long-press',
      onStart: (ev) => {
        this.pauseTimer = true;
        hideBgTimeout = setTimeout(() => {
          this.hideBar = true;
        }, 500);
      },
      onMove: (ev) => {
        let clip = '';
        if (ev.deltaY > 0) {
          clipValue = Math.floor(Math.max(50, 500 - ev.deltaY * 3));
          clip = `circle(${clipValue}px at center)`;
        } else if (clipValue > 0 && clipValue < 500) {
          clipValue = Math.floor(Math.max(50, 50 + ev.deltaY * 3));
          clip = `circle(${clipValue}px at center)`;
        }
        document.documentElement.style.setProperty('--modalclip', clip);
        const transform = `translate3d(${ev.deltaX}px, ${ev.deltaY}px, 0px)`;
        document.documentElement.style.setProperty('--modaltransform', transform);
      },
      onEnd: (ev) => {
        clearTimeout(hideBgTimeout);
        this.hideBar = false;
        this.pauseTimer = false;

        if (clipValue == 50) {
          this.close();
        } else {
          document.documentElement.style.setProperty('--modaltransform', '');
          document.documentElement.style.setProperty('--modalclip', '');
        } 
      }
    }, true);

    longPress.enable(true);
  }

  close() {
    this.modalCtrl.dismiss()
      .then(() => {
        document.documentElement.style.setProperty('--modalclip', '');
        document.documentElement.style.setProperty('--modaltransform', '');
      });
  }

  getImage() {
    return `url('${this.info.stories[this.activeStory].img}') no-repeat center center`;
  }

  tapBg(ev: any) {
    if (this.replyVisible) {
      this.replyVisible = false;
      return;
    }

    if (ev.clientX > this.plt.width() / 2) {
      this.nextStory();
    } else {
      this.previousStory();
    }
  }

  reply() {
    this.replyVisible = true;
    this.msginput.setFocus();
  }

}
