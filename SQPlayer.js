'use strict';

/* ----

# Square Player
# By: Dreamer-Paul
# Last Update: 2022.2.13

一个简洁到极致的单曲播放器。

本代码为奇趣保罗原创，并遵守 MIT 开源协议。欢迎访问我的博客：https://paugram.com

---- */

window._SQPPlayers = [];

class SQPlayer{
    constructor(wrapper, key, set){
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
        _SQPPlayers.push(this);
    }

    // 切换按钮
    toggle(){
        this.elements.player.paused ? this.play() : this.pause();
    }

    // 播放
    play(){
        this.elements.player.play();

        _SQPPlayers.forEach(item => {
            if(item.key !== this.key) item.pause();
        })
    }

    // 暂停
    pause(){
        this.elements.player.pause();
    }

    // 元素创建器
    creator(tag, attr){
        let _t = document.createElement(tag);

        if(attr){
            if(attr.className) _t.className = `sqp-${attr.className}`;
            if(attr.content)   _t.innerHTML = attr.content;
        }

        return _t;
    }

    // 销毁
    destroy(){
        this.elements.player.pause();
        this.elements.toggle.removeEventListener("click", this.toggle);

        this.elements.wrap.innerHTML = null;
        this.elements.wrap.parentElement.removeChild(this.elements.wrap);

        this.elements = undefined;

        _SQPPlayers.splice(_SQPPlayers.indexOf(this), 1)
    }

    // 设置播放器
    setup(item){
        const fontSize = parseInt(window.getComputedStyle(document.querySelector("html")).fontSize.replace("px", ""));

        item.link ? this.elements.player.src = item.link : console.error("SQP: Error, No files to play!");

        if(item.cover){
            this.elements.wrap.style.backgroundImage = "url(" + item.cover + ")";
        }

        // 播放器主体初始化
        this.elements.title.innerText = item.artist && item.title ? `${item.title} - ${item.artist}` : "未知标题";

        this.elements.info.appendChild(this.elements.title);
        this.elements.wrap.appendChild(this.elements.info);
        this.elements.wrap.appendChild(this.elements.toggle);

        let offset = this.elements.title.offsetWidth - (fontSize * 8);
        let time = parseInt(this.elements.title.offsetWidth / 30);

        const ani = this.creator("style", { content: `
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

        if(offset > 0){
            this.elements.title.style.animation = `sqp-title-${this.key} ${time}s infinite linear`;
            this.elements.wrap.appendChild(ani);
        }

        this.elements.toggle.addEventListener("click", this.toggle.bind(this));

        this.elements.player.addEventListener("play", () => {
            this.elements.toggle.classList.add("pause");
        });
        this.elements.player.addEventListener("pause", () => {
            this.elements.toggle.classList.remove("pause");
        });
    }

    getBy163(value, server){
        let id = value.getAttribute("data-163");

        const getAPI = {
            "meto": () => {
                fetch("https://api.i-meto.com/meting/api?server=netease&id=" + id).then((res) => {
                    return res.json();
                }).then((item) => {
                    item = item[0];

                    this.setup({
                        title: item.title,
                        artist: item.author,
                        cover: item.pic,
                        link: item.url
                    });
                });
            },
            "paul": () => {
                fetch("https://api.paugram.com/netease/?id=" + id).then(function (res) {
                    return res.json();
                }).then((item) => {
                    this.setup(item);
                });
            }
        }

        getAPI[server]();
    }
}

console.log("%c Square Player %c https://paugram.com ","color: #fff; margin: 1em 0; padding: 5px 0; background: #1875b3;","margin: 1em 0; padding: 5px 0; background: #efefef;");

class SQP_Extend {
    constructor(settings){
        this.settings = settings;
        this.init();
    }

    init(){
        this.wrapper = document.querySelectorAll("sqp");

        this.wrapper.forEach(function (item, key) {
            if(!item.hasAttribute("loaded")) new SQPlayer(item, key + new Date().getTime(), this.settings);
        }, this);
    }

    destroy(){
        let i = _SQPPlayers.length;
        
        while(_SQPPlayers.length > 0){
            i--;

            _SQPPlayers[i].destroy();
        }
    }
}

window._SQP_Extend = new SQP_Extend({
    server: "meto"
});
