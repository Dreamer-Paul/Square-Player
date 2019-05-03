'use strict';

/* ----

# Square Player
# By: Dreamer-Paul
# Last Update: 2019.5.3

一个简洁到极致的单曲播放器。

本代码为奇趣保罗原创，并遵守 MIT 开源协议。欢迎访问我的博客：https://paugram.com

---- */

class SQPlayer{
    constructor(wrapper){
        this.elements = {
            wrap: wrapper,
            player: this.creator("audio"),
            info: this.creator("div", "info"),
            title: this.creator("span", "title"),
            toggle: this.creator("div", "toggle")
        };

        this.elements.player.setAttribute("preload", "none");

        wrapper.dataset[163] ? this.getBy163(wrapper) : this.setup(wrapper.dataset);
    }

    // 切换按钮
    toggle(){
        this.elements.player.paused ? this.play() : this.pause();
    }

    play(){
        this.elements.player.play();
    }

    pause(){
        this.elements.player.pause();
    }

    creator(tag, cls){
        let a = document.createElement(tag);
        if(cls) a.className = "sqp-" + cls;
        return a;
    }

    // 设置播放器
    setup(item){
        item.link ? this.elements.player.src = item.link : console.error("No files to play!");

        if(item.cover){
            this.elements.wrap.style.backgroundImage = "url(" + item.cover + ")";
        }

        // 播放器主体初始化
        this.elements.title.innerText = item.artist && item.title ? item.title + " - " + item.artist : "未知标题";

        this.elements.toggle.addEventListener("click", () => {
            this.toggle();
        });

        this.elements.info.appendChild(this.elements.title);
        this.elements.wrap.appendChild(this.elements.info);
        this.elements.wrap.appendChild(this.elements.toggle);

        this.elements.player.addEventListener("playing", () => {
            this.elements.toggle.classList.add("pause");
        });
        this.elements.player.addEventListener("pause", () => {
            this.elements.toggle.classList.remove("pause");
        });
    }

    getBy163(value, server){
        let id = value.getAttribute("data-163");
        let type = isNaN(value) ? "?title=" : "?id=";

        if(server === "paul"){
            fetch("https://api.paugram.com/netease/" + type + id).then(function (res) {
                return res.json();
            }).then((item) => {
                this.setup(item);
            });
        }
        else{
            type = isNaN(value) ? `type=song&id=${id}` : `type=search&id=${id}`;

            fetch(`https://api.i-meto.com/api/v1/meting?server=netease&${type}`).then((res) => {
                return res.json();
            }).then((i) => {
                i = i[0];

                this.setup({
                    title:  i.name,
                    artist: i.artist,
                    cover:  i.cover,
                    link:   i.url,
                });
            })
        }
    }
}

console.log("%c Square Player %c https://paugram.com ","color: #fff; margin: 1em 0; padding: 5px 0; background: #1875b3;","margin: 1em 0; padding: 5px 0; background: #efefef;");

class SQP_Extend {
    constructor(wrapper){
        this.players = [];
        wrapper = document.querySelectorAll(wrapper);

        wrapper.forEach(function (item) {
            this.players.push(new SQPlayer(item));
        }, this)
    }
}

document.addEventListener("DOMContentLoaded", function () {
    let SQP_EX = new SQP_Extend("sqplayer");
});