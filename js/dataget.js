//下注界面渲染
    $(document).ready(function(){
     $.ajax({
      method: "GET",
      url: "http://192.168.1.212:3010/dollars/filter/search?limit=20&page=1",
  })
     .done(function(data) {
        var getarrdata = data.data[0][0];

        var {bidId} = getarrdata;
        $("#bidid").text(bidId);
        var {pervalue} = getarrdata;
        $("#pervalue").text(pervalue);
        var {totalSum} = getarrdata;
        $("#totalSum").text(totalSum);
        var {remainct} = getarrdata;
        $("#remainct,#remainct1").text(remainct);
        var allct = totalSum/pervalue;
        $("#allct,#allct1").text(allct);

    });
 });

//下注界面调用nebpay并向服务器传hash
function clicked() {
  let Nebpay = require('nebpay');
  let nebpay = new Nebpay();
  let ct = $("#ct").val();
  let qishu = 0;

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