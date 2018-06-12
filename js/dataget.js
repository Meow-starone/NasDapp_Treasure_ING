  //下注界面渲染
      $(document).ready(function(){
       $.ajax({
        method: "GET",
        url: "http://192.168.1.212:3010/dollars/bidId",
    })
       .done(function(data) {
          var getarrdata = data.data[0][0];
          var {bidId} = getarrdata;
          $("#bidid").text(bidId);
          var {pervalue} = getarrdata;
          $("#pervalue").text(pervalue);
          var {reward} = getarrdata;
          $("#reward").text(reward);
          var {remainct} = getarrdata;
          $("#remainct,#remainct1").text(remainct);
          var allct = totalSum/pervalue;
          $("#allct,#allct1").text(allct);
          //每份投注和首次投注不确定是啥
          //金额可以显示，但是他们说这个去中心化，所以我无法获得余额，
          //其实我也可以链上查询钱包地址余额但是这样子比较扯
          //全部参与记录
          $("#thisuser").text(data.data[0][0].user);
          $("#joinnumber").text(data.data[0][0].user);
          $("time").text(data.data[0][0].user);
          //下面我再搞几个div隐藏了

        });
      });
      //这个是我的参与记录，数据和上面一样但是接口在用户表对应的bidId里
      $(document).ready(function(){
       $.ajax({
        method: "GET",
        url: "http://192.168.1.212:3010/dollars/user",
      })
       .done(function(data) {
          $("#thisuser").text(data.data[0][0].bidId);
          $("#joinnumber").text(data.data[0][0].bidId);
          $("time").text(data.data[0][0].bidId);
        });
      });



//下注界面调用nebpay并向服务器传hash
function clickedbuy() {
  let Nebpay = require('nebpay');
  let nebpay = new Nebpay();
  let ct = $("#ct").val();
  let qishu = 0;
  console.log("w");
//这里ajax先执行  若服务器没开则无法执行下一步
  $.ajax({
    method: "GET",
    url: "http://192.168.1.212:3010/dollars/filter/search?limit=20&page=1",
  })
  .done(function(data) {
    let miao = data.data.length;
    let qishu = data.data[miao-1];
    console.log(qishu); 

    let args = [4, ct];
    var toaddress = "n1yZ9JGCZryCy65ixp1u6REuxMgq3BBTuW5";
    var amount = ct*0.1;
    var callFunction = "Bid";
    var options = {
      listener:function(tx_receipt) {
        var txhash = tx_receipt.txhash;
        console.log(txhash);
        console.log("tx_receipt:", tx_receipt.txhash);
        $.post("http://192.168.1.212:3010/users/bid",
          {hash:txhash},
          function(data){
            console.log("hash:",txhash);
            console.log(data.code,data.msg); 
          });        

      }           
    }
    let result = nebpay.call(
      toaddress, 
      amount,
      callFunction, 
      JSON.stringify(args),
      options
      );
  });
}

//状态134界面渲染，这里我需要状态码判断一下
//这个界面的等待开奖就是即将售卖，售卖时间取决于初始高度这个你们商定一套规则
$(document).ready(function(){
$.ajax({
  method: "GET",
  url: "dollars/:bidId(\d+)",
})
.done(function(data) {
    var getarrdata = data.data[0][0];
    console.log(getarrdata);
    var {bidId} = data.data[0][0];
    $("#bididnext").text(bidId);
    var {pervalue} = getarrdata;
    $("#pervalue1").text(pervalue);
    var {reward} = getarrdata;
    $("#reward").text(reward);
    var {startHeight} = getarrdata;
    $("#startHeight,#startHeight1").text(startHeight);
    var fundHeight = startHeight + 9;
    $("#fundHeight").text(fundHeight);

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
        var nowheight = blockData.height;
      });
    };
    getnowheight();
    $("#nowheight").text(nowheight);
    //已经开奖的数据和之前差不多，多一个买了多少份
});
});


//判断用户是否登录，跳转不同页面
function getloginor() {
    // $ajax({
    //     method: "GET",
    //     url:"",
    // });
    // .done(function(data){
    //     if(date.msg == false){

    //     }else{window.location.href='./html.sign/user.html'}
    //
    // });
    window.location.href='./html/sign/5.html';  
}

//index渲染
//新接口获取最新三条数据
$(document).ready(function(){
$.ajax({
  method: "GET",
  url: "http://192.168.1.212:3010",//最新三条已开奖的夺宝接口
})
.done(function(data) {
  //给商品赋bidId
  $("#bid1img").click(function(){
    sessionStorage.setItem('bidId',data.data[0][0].bidId);
});
  $("#bid2img").click(function(){
    sessionStorage.setItem('bidId',data.data[0][1].bidId);
});
  $("#bid2img").click(function(){
    sessionStorage.setItem('bidId',data.data[0][1].bidId);
});
    var indexbanner = data.data[0];
    $('#indexbanner1').attr('src', 'indexbanner[0]'); 
    $('#indexbanner2').attr('src', 'indexbanner[1]');
    $('#indexbanner3').attr('src', 'indexbanner[2]');
    $('#indexbanner4').attr('src', 'indexbanner[3]');

    //最新三个夺宝
    $("#newsports1").text();
    $("#newsports2").text();
    $("#newsports3").text();
    
    $("#bid1img").attr('src','');
    $("#bid1price").text();
    $("#bid1fund").text();
    $("#bid2img").attr('src','');
    $("#bid2price").text();
    $("#bid2fund").text();
    $("#bid3img").attr('src','');
    $("#bid3price").text();
    $("#bid3fund").text();
});
});
//对全部商品加载全部夺宝
$(document).ready(function(){
$.ajax({
  method: "GET",
  url: "http://192.168.1.212:3010",//正在售卖的四个商品
})
.done(function(data) {
  //给商品赋bidId
  $("#buyimg1").click(function(){
    sessionStorage.setItem('bidId',data.data[0][0].bidId);
});
  $("#buyimg2").click(function(){
    sessionStorage.setItem('bidId',data.data[0][1].bidId);
});
  $("#buyimg3").click(function(){
    sessionStorage.setItem('bidId',data.data[0][2].bidId);
});
  $("#buyimg4").click(function(){
    sessionStorage.setItem('bidId',data.data[0][3].bidId);
});
    var getarrdata = data.data[0][0];
    $("#allbid1img").attr('src','');
    var {remainct} = getarrdata;
    $("#allbid1amount").text(remainct);
    var {pervalue} = getarrdata;
    $("#allbid1price").text(pervalue);
    var {totalSum} = getarrdata;
    $("#allbid1fund").text(totalSum);
});
});


//lottery开奖界面
 //已开奖和之前接口一样，但取6条最新数据


 //即将开奖  这里的数量应该和后台频率有关
$(document).ready(function(){
$.ajax({
  method: "GET",
  url: "http://192.168.1.212:3010",
})
.done(function(data) {
  //给商品赋bidId  
//   $("#buyimg1").click(function(){
//     sessionStorage.setItem('bidId',data.data[0][0].bidId);
// });
//   $("#buyimg2").click(function(){
//     sessionStorage.setItem('bidId',data.data[0][1].bidId);
// });
//   $("#buyimg3").click(function(){
//     sessionStorage.setItem('bidId',data.data[0][2].bidId);
// });
//   $("#buyimg4").click(function(){
//     sessionStorage.setItem('bidId',data.data[0][3].bidId);
// });
    //只有两个参数
    
});
});


//我的订单界面
$(document).ready(function(){
$.ajax({
  method: "GET",
  url: "http://192.168.1.212:3010/user",
})
.done(function(data) {
  //一次参与记录
    $("#userbidId").text();
    $("#usertime").text();
    $("#userjoinnum").text();
    $("#state").text();
});
});





