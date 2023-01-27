'use strict';

/* ----

# Square Player
# By: Dreamer-Paul
# Last Update: 2023.1.27

一个简洁到极致的单曲播放器。

本代码为奇趣保罗原创，并遵守 MIT 开源协议。欢迎访问我的博客：https://paugram.com

---- */

window._SQPPlayers = [];

class SQPlayer {
  key = "";
  elements = undefined;

  constructor(wrapper, key, set) {
    this.key = key;
    this.elements = {
      wrap: wrapper,
      player: new Audio(),
      info: this.creator("div", { className: "info" }),
      title: this.creator("span", { className: "title" }),
      toggle: this.creator("div", { className: "toggle" })
    };

    this.elements.wrap.setAttribute("loaded", "");
    this.elements.player.setAttribute("preload", "none");

    wrapper.dataset[163] ? this.getBy163(wrapper, set.server) : this.setup(wrapper.dataset);

    return this;
  }

  // 切换按钮
  toggle = () => {
    this.elements.player.paused ? this.play() : this.pause();
  }

  // 播放
  play = () => {
    this.elements.player.play();

    _SQPPlayers.forEach(item => {
      if (item.key !== this.key) item.pause();
    });
  }

  // 暂停
  pause = () => {
    this.elements.player.pause();
  }

  // 元素创建器
  creator(tag, attr) {
    const el = document.createElement(tag);

    if (attr) {
      if (attr.className) el.className = `sqp-${attr.className}`;
      if (attr.content) el.innerHTML = attr.content;
    }

    return el;
  }

  // 事件
  onPlay = () => {
    this.elements.toggle.classList.add("playing");
  }
  onPause = () => {
    this.elements.toggle.classList.remove("playing");
  }

  // 设置播放器
  setup = (item) => {
    const fontSize = Number(window.getComputedStyle(document.querySelector("html")).fontSize.replace("px", ""));

    // 播放器主体初始化
    let titleText = "未知标题";

    if (item.artist && item.title) {
      titleText = `${item.title} - ${item.artist}`;
    }
    else if (item.title) {
      titleText = item.title;
    }

    if (item.link) {
      this.elements.player.src = item.link;
    }
    else {
      titleText = "无效文件路径";
      console.error("SQP: Error, No files to play!");
    }

    if (item.cover) {
      this.elements.wrap.style.backgroundImage = `url(${item.cover})`;
    }

    this.elements.title.innerText = titleText;
    this.elements.info.appendChild(this.elements.title);
    this.elements.wrap.appendChild(this.elements.info);
    this.elements.wrap.appendChild(this.elements.toggle);

    const offset = this.elements.title.offsetWidth - (fontSize * 8);
    const time = parseInt(this.elements.title.offsetWidth / 30);

    const ani = this.creator("style", {
      content: `
@keyframes sqp-title-${this.key} {
    0%{
        transform: translateX(0);
    }
    50%{
        transform: translateX(${-offset}px);
    }
    100%{
       transform: translateX(0);
    }
}
`});

    if (offset > 0) {
      this.elements.title.style.animation = `sqp-title-${this.key} ${time}s infinite linear`;
      this.elements.wrap.appendChild(ani);
    }

    this.elements.toggle.addEventListener("click", this.toggle);
    this.elements.player.addEventListener("play", this.onPlay);
    this.elements.player.addEventListener("pause", this.onPause);
  }

  // 销毁
  destroy = () => {
    this.elements.player.pause();
    this.elements.toggle.removeEventListener("click", this.toggle);
    this.elements.player.removeEventListener("play", this.onPlay);
    this.elements.player.removeEventListener("pause", this.onPause);

    this.elements.wrap.parentElement.removeChild(this.elements.wrap);
    this.elements.wrap = undefined;
    this.elements = undefined;
  }

  getBy163 = (value, server) => {
    const id = value.getAttribute("data-163");

    const getData = {
      "meto": () => (
        fetch(`https://api.i-meto.com/meting/api?server=netease&id=${id}`).then(
          (res) => res.json()
        ).then((items) => {
          const item = items[0];

          this.setup({
            title: item.title,
            artist: item.author,
            cover: item.pic,
            link: item.url
          });
        })
      ),
      "paul": () => (
        fetch(`https://api.paugram.com/netease/?id=${id}`).then(
          (res) => res.json()
        ).then((item) => {
          this.setup(item);
        })
      ),
    };

    if (server in getData) {
      getData[server]().catch(() => {
        this.elements.wrap.classList.add("error");
      });
    }
  }
}

console.log("%c Square Player %c https://paugram.com ", "color: #fff; margin: 1em 0; padding: 5px 0; background: #1875b3;", "margin: 1em 0; padding: 5px 0; background: #efefef;");

class SQP_Extend {
  constructor(settings) {
    this.settings = settings;
    this.init();
  }

  init = () => {
    this.wrapper = document.querySelectorAll("sqp");

    this.wrapper.forEach((item, key) => {
      if (!item.hasAttribute("loaded")) {
        _SQPPlayers.push(new SQPlayer(item, key + new Date().getTime(), this.settings));
      }
    });
  }

  destroy = () => {
    while (_SQPPlayers.length > 0) {
      _SQPPlayers[0].destroy();
      _SQPPlayers.splice(_SQPPlayers[0], 1);
    }
  }
}

window._SQP_Extend = new SQP_Extend({
  server: "meto"
});
