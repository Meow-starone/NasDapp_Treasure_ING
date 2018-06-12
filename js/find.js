//获取当前区块高度
function getnowheight(){
let Nebulas = require('nebulas');
let neb = new Neb();
     var HttpRequest = require("nebulas").HttpRequest;
     const PROVIDER_NEB = "http://192.168.1.59:8685"

     neb.setRequest(new Nebulas.HttpRequest(PROVIDER_NEB))
     var miaomiao = neb.api;
     miaomiao.latestIrreversibleBlock().then(function(blockData) {
            console.log(blockData);
            console.log('w');
     });
 };