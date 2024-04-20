'use strict';

/* ----

# Square Player
# By: Dreamer-Paul
# Last Update: 2024.4.20

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
      title: this.creator("span", { className: "title", content: "加载中..." }),
      toggle: this.creator("div", { className: "toggle" })
    };

    this.elements.wrap.setAttribute("loaded", "");
    this.elements.player.setAttribute("preload", "none");

    if (wrapper.dataset.cid) {
      this.setupByCloudMusic(wrapper.dataset.cid, set.server);
    }
    else {
      this.setup(wrapper.dataset);
    }

    this.elements.info.appendChild(this.elements.title);
    this.elements.wrap.appendChild(this.elements.info);
    this.elements.wrap.appendChild(this.elements.toggle);
  }

  // 切换
  toggle = () => this.events.onToggle();

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

    if (attr?.className) {
      el.className = `sqp-${attr.className}`;
    }

    if (attr?.content) {
      el.innerHTML = attr.content;
    }

    return el;
  }

  // 事件
  events = {
    onToggle: () => {
      this.elements.player.paused ? this.play() : this.pause();
    },
    onPlay: () => {
      this.elements.toggle.classList.add("playing");
    },
    onPause: () => {
      this.elements.toggle.classList.remove("playing");
    },
  }

  // 修改元素的操作
  modify = {
    updateTitleText: (nextTitle) => {
      const fontSize = Number(window.getComputedStyle(document.querySelector("html")).fontSize.replace("px", ""));

      const el = this.elements.title;
      el.innerText = nextTitle;

      const offset = el.offsetWidth - (fontSize * 8);
      const duration = parseInt(el.offsetWidth / 30) * 1000;
  
      if (offset > 0) {
        el.animate([
          { transform: "translateX(0)" },
          { transform: `translateX(${-offset}px)` },
          { transform: "translateX(0)" },
        ], {
          duration,
          iterations: Infinity,
        });
      }
    },
  }

  // 设置播放器
  setup = (item) => {
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

    this.modify.updateTitleText(titleText);

    if (item.cover) {
      this.elements.wrap.style.backgroundImage = `url(${item.cover})`;
    }

    this.elements.toggle.addEventListener("click", this.events.onToggle);
    this.elements.player.addEventListener("play", this.events.onPlay);
    this.elements.player.addEventListener("pause", this.events.onPause);
  }

  // 销毁
  destroy = () => {
    this.elements.player.pause();
    this.elements.toggle.removeEventListener("click", this.events.onToggle);
    this.elements.player.removeEventListener("play", this.events.onPlay);
    this.elements.player.removeEventListener("pause", this.events.onPause);

    this.elements.wrap.remove();
    this.elements.wrap = undefined;
    this.elements = undefined;
  }

  setupByCloudMusic = (cid, server) => {
    const getData = {
      "meto": () => (
        fetch(`https://api.i-meto.com/meting/api?server=netease&id=${cid}`).then(
          (res) => res.json()
        ).then((items) => {
          const item = items[0];

          if (!item) {
            throw new Error("返回数据为空");
          }

          this.setup({
            title: item.title,
            artist: item.author,
            cover: item.pic,
            link: item.url
          });
        })
      ),
      "paul": () => (
        fetch(`https://api.paugram.com/netease/?id=${cid}`).then(
          (res) => res.json()
        ).then((item) => {
          this.setup(item);
        })
      ),
    };

    if (server in getData) {
      getData[server]().catch((err) => {
        this.modify.updateTitleText(`获取数据异常：${err.message}`);
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
