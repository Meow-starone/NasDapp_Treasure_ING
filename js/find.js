//获取当前区块高度
function getnowheight(){
let Nebulas = require('nebulas');
let neb = new Neb();
     var HttpRequest = require("nebulas").HttpRequest;
     const PROVIDER_NEB = "http://192.168.1.59:8685"
     neb.setRequest(new Nebulas.HttpRequest(PROVIDER_NEB))
     var miaomiao = neb.api;
     miaomiao.latestIrreversibleBlock().then(function(blockData) {
			 //获取当前区块高度
     });
 };
//东邻有好女 静婉待月归
//眉批西湖水 眼含千秋泪
//一朝春带雨 菏泽满香归
//三分沾裙袂 人间正清味
//
//有道是--
//晴芳潋滟好回味
//烟云过眼燕南飞
//思君渐老雪千堆
//六和塔下潮生碎
//
//泠泠七琴弦 声声叹式微
//沙暖燕回飞 问君胡不归