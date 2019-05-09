# Square Player

一个简洁到极致的单曲播放器，基于 ES6 标准开发的试水之作。

## 使用方法

1. `Star` 本项目
2. 从这里 [下载](https://github.com/Dreamer-Paul/Square-Player/archive/master.zip) 源码
3. 可使用本地、网易云音乐两种方式食用，参照下面的快速食用指南即可快速部署完成
4. 本项目提供 Typecho 插件版本，如需使用请先将下载后得到的文件夹从 `Square-Player-master` 重命名为 `SQP`

## 开源协议

本项目采用 MIT 开源协议进行授权，须保留原作者的版权注释（CSS、JS 文件）

原创不易！如果喜欢本项目，请 `Star` 它以示对我的支持~

同时欢迎前往 [保罗的小窝](https://paul.ren/donate) 为我提供赞助，谢谢您！

## 感谢

感谢来自开源社区提供的解决方案，如果没有它们，Square Player 可能还无法如此完善 ヽ(*≧ω≦)ﾉ

 - [Meting](https://github.com/metowolf/Meting)

## 快速食用指南

在网页 `head` 标签引用项目的 CSS 文件 `SQPlayer.css`：

```html
<head>
...
<link href="SQPlayer.css" rel="stylesheet" type="text/css"/>
...
</head>
```

在网页 `body` 标签内的最后一行引用项目的 JS 文件 `SQPlayer.js`：

```html
<body>
...
<script src="SQPlayer.js"></script>
</body>
```

在网页 `body` 标签内插入一个 `sqplayer` 标签：

```html
<body>
...
<sqplayer></sqplayer>
...
</body>
```

Square Player 支持以下属性，他们分别的意义是：

属性名|用途
:-:|:-:
right|至右显示
data-title|歌曲名
data-artist|艺术家
data-cover|专辑封面图片链接
data-link|歌曲地址
data-163|网易云音乐的 ID 或歌名

如果使用 `data-163` 属性引用播放器，就写成这样，其中 `23682511` 就是一首歌的 ID。

```html
<sqplayer data-163="23682511"></sqplayer>
```

如果使用静态方法引用播放器，就需要同时编写四个属性。

```html
<sqplayer right data-title="Crimson & Clover" data-artist="Tommy James" data-cover="封面链接" data-link="歌曲链接"></sqplayer>
```

Enjoy it！

# Typecho 插件版

按照如上的配置直接粘贴在文章里即可使用