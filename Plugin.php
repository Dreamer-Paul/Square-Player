<?php
/**
 * 一个简洁到极致的单曲播放器
 *
 * @package Square Player
 * @author Dreamer-Paul
 * @version 1.0
 * @link https://paugram.com
 */

class SQP_Plugin implements Typecho_Plugin_Interface{

    /* 激活插件方法 */
    public static function activate(){
        Typecho_Plugin::factory('Widget_Archive') -> header = array('SQP_Plugin', 'header');
        Typecho_Plugin::factory('Widget_Archive') -> footer = array('SQP_Plugin', 'footer');
    }

    /* 禁用插件方法 */
    public static function deactivate(){}

    /* 插件配置方法 */
    public static function config(Typecho_Widget_Helper_Form $form){}

    /* 个人用户的配置方法 */
    public static function personalConfig(Typecho_Widget_Helper_Form $form){}

    /* 插件实现方法 */
    public static function header(){
        if(Typecho_Widget::widget('Widget_Archive') -> is("post")){
            echo '<link href="' . Helper::options() -> pluginUrl . '/SQP/SQPlayer.css" rel="stylesheet" type="text/css"/>';
        }
    }

    public static function footer(){
        if(Typecho_Widget::widget('Widget_Archive') -> is("post")){
            echo '<script src="' . Helper::options() -> pluginUrl . '"/SQP/SQPlayer.js"></script>';
        }
    }
}