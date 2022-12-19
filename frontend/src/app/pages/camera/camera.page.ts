import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CameraPreviewOptions, CameraPreview } from '@capacitor-community/camera-preview';
import { SwiperOptions } from 'swiper';
import Swiper, { FreeMode } from 'swiper';

Swiper.use([FreeMode]);

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
})
export class CameraPage implements OnInit {
  library = [...new Array(10)].map(() => {
    const random = Math.floor(100 + Math.random() * 100);
    const url = `https://picsum.photos/${random}`;
    return {
      img: url
    };
  });

  config: SwiperOptions = {
    slidesPerView: 4.3,
    spaceBetween: 4,
    slidesOffsetBefore: 4,
    freeMode: true,
    direction: 'horizontal'
  }

  constructor(private router: Router) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    const cameraPreviewOptions: CameraPreviewOptions = {
      position: 'rear',
      parent: 'cameraPreview',
      className: 'cameraPreview',
      toBack: true
    };
    CameraPreview.start(cameraPreviewOptions);
  }

  flipCamera() {
    CameraPreview.flip();
  }

  async close() {
    await CameraPreview.stop();
    this.router.navigate(['/chats']);
  }

}
