'use strict';

//const isSP = window.innerWidth < 750;
const isSP = Math.random() < 0.5 ? true : false; // sp,pcの振り分け確認のため、ランダムに指定

class Preload {
  constructor() {
    this.preloadImg = isSP ? 'preload-img-sp' : 'preload-img-pc';
    this.preloadBg = isSP ? 'preload-bg-sp' : 'preload-bg-pc';
    
    window.onload = () => {
      this.load(); // pararell load
    };
  }
        
  load() {
    this.$images = document.querySelectorAll(`[data-preload^=${this.preloadImg}], [data-preload^=${this.preloadBg}]`);
    this.queue = new createjs.LoadQueue(false); // falseだとキャッシュを無効にする
    
    this.manifest = [];
  
    for(let i=0, len=this.$images.length; i<len; i++) {
      const type = this.$images[i].getAttribute('data-preload');
      const identify = `${type}-${i}`;
      const $el = this.$images[i];
      const obj = {
        "src": $el.getAttribute('data-src'), "id": identify
      };
      $el.classList.add(identify);
      this.manifest.push(obj);
    }

    this.queue.addEventListener('fileload', this.handleFileLoad.bind(this));
    this.queue.addEventListener('complete', this.handleComplete.bind(this));

    this.queue.loadManifest(this.manifest, true);
  }
    
  // ファイルの読み込みが完了するごとに読み込まれる
  handleFileLoad(event) {
    const item = event.item;
    switch(item.type) {
      case createjs.LoadQueue.IMAGE:
        const src = event.result.src;
        const identify = event.item.id;
        const $target = document.querySelector(`.${identify}`);
        switch($target.getAttribute('data-preload')) {
          case this.preloadImg:
            $target.setAttribute('src', src);
            break;
          case this.preloadBg:  
            $target.style.backgroundImage = `url(${src})`;
            break;
        }
        break;
    }
  }

  // 全ファイルの読み込みが完了した時に呼ばれるイベント
  handleComplete(event) {
    console.log('all file loaded');
  }
}

new Preload();
