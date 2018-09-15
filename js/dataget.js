$.ajaxSetup({ xhrFields: { withCredentials: true } });
//sessionStorage.setItem('bidId', 1);
//
//let CONTRACT_ADDRESS = "https://pay.nebulas.io/api/pay";
//async function getAccountState(address) {
////	let Nebulas = require('nebulas');
//	let neb = new Neb();
//	let state = await neb.api.getAccountState(address)
//	return state.nonce
//}
//
//async function verifyFunction(func, args, txobj) {
//	let nonce = await getAccountState(CONTRACT_ADDRESS)
//
//	let defaultObj = {
//		from: FROM_ADDRESS,
//		to: CONTRACT_ADDRESS,
//		value: 0,
//		nonce: ++nonce,
//		gasPrice: 1000000,
//		gasLimit: 2000000
//	}
//
//	let params = Object.assign(defaultObj, txobj)
//	params.contract = {
//		function: func,
//		args: JSON.stringify(args)
//	}
//
//	try {
//		let result = await neb.api.call(params)
//		console.log(result, result.execute_err == "")
//		return result
//	} catch (e) {
//		console.log(e)
//
//		return false
//	}
//}
//
//let callFunction = verifyFunction


//下注界面渲染

$(document).ready(function () {
	var bidId = sessionStorage.getItem('bidId');
//       console.log("a="+bidId);
	$.ajax({
		method: "GET",
		url: "http://192.168.1.131:3010/dollars/" + bidId,
	})
		.done(function (data) {
		
		
//			let remainresult = callFunction('G	etDollar', [bidId], { to: CONTRACT_ADDRESS })
			
//			console.log(2222222222222222222222222222222,remainresult);
			if(data.data.totalSum == 20){$("#firstimg").attr("src","../../image/t2.png");}
			else if(data.data.totalSum == 50){$("#firstimg").attr("src","../../image/t3.png");}
			else if(data.data.totalSum == 100){$("#firstimg").attr("src","../../image/t4.png");}
			else{$("#firstimg").attr("src","../../image/t1.png");}
			var getarrdata = data.data;
			var { bidId } = getarrdata;
			$("#bidid").text(bidId);
			var { pervalue } = getarrdata;
			$("#pervalue").text(pervalue);
			var { totalSum } = getarrdata;
			$("#reward").text(totalSum);
			var { count } = getarrdata;
			count = count||0;
			$("#count").text(count);
			$("#totalCt-count,#remainct1").text(data.data.totalCt-data.data.count);
			var { totalCt } = getarrdata;
			$("#allct,#allct1").text(totalCt);
			
			sessionStorage.setItem('pervalue', data.data.pervalue);
			
			//每份投注和首次投注不确定是啥
			//金额可以显示，但是他们说这个去中心化，所以我无法获得余额，
			//其实我也可以链上查询钱包地址余额但是这样子比较扯
			
			//全部参与记录,等服务器数据
//          $("#thisuser").text(data.data.user.);
//          $("#joinnumber").text(data.data.user);
//          $("time").text(data.data.user);
			//下面我再搞几个div隐藏了
			$("#allhideContent1").hide();
			$("#allhideContent2").hide();
			if(data.data.users[0]){$("#allhideContent1").show();}
			if(data.data.users[1]){$("#allhideContent2").show();}
			
		});
});

var bidId = sessionStorage.getItem('bidId');
var pervalue = sessionStorage.getItem('pervalue');
var serialNumber; //交易序列号
var intervalQuery; //定时查询交易结果

//点击按钮发起交易, 这里为调用智能合约的例子
function clickedbuy() {
	
	$.ajax({
		method: "GET",
		url: "http://192.168.1.131:3010/users",
	})
		.done(function (data) {
//				console.log(data.data.userName);
			if (data.code == "10099") {
				location.href = '../sign/5.html'
			}
			else {
				var NebPay = require("nebpay");
				var nebPay = new NebPay();
				var ct = $("#ct").val();
				console.log(1111111111111111111111111111111111111111, ct);
				var value = (ct * pervalue).toFixed(3);
				var args = [bidId, ct];
				var to = "n1ncv1fBWXvZfkN3thc4BH6rM7PHGdXgafd";   //Dapp的合约地址
				var callFunction = "Bid" //调用的函数名称
//	var callArgs =  "JSON.stringify(args)"  //参数格式为参数数组的JSON字符串, 比如'["arg"]','["arg1","arg2]'
				var options = {
					goods: {        //商品描述
						name: "example"
					},
					listener:function (){
						intervalQuery = setInterval(function () {
							funcIntervalQuery();
						}, 10000);
					},
					callback: "https://pay.nebulas.io/api/pay" //在测试网查询
				}
				
				//发送交易(发起智能合约调用)
				serialNumber = nebPay.call(to, value, callFunction, JSON.stringify(args), options);
				
				//设置定时查询交易结果
//				intervalQuery = setInterval(function () {
//					funcIntervalQuery();
//				}, 10000); //建议查询频率10-15s,因为星云链出块时间为15s,并且查询服务器限制每分钟最多查询10次。
			}

//查询交易结果. queryPayInfo返回的是一个Promise对象.
			function funcIntervalQuery() {
				var NebPay = require("nebpay");
				var nebPay = new NebPay();
				var options = {
					goods: {        //商品描述
						name: "example"
					},
					//callback 是交易查询服务器地址,
					//callback: NebPay.config.mainnetUrl //在主网查询(默认值)
					callback: "https://pay.nebulas.io/api/pay" //在测试网查询
				}
				console.log(11111111111111111, serialNumber);
				//queryPayInfo的options参数用来指定查询交易的服务器地址,(如果是主网可以忽略,因为默认服务器是在主网查询)
				nebPay.queryPayInfo(serialNumber, options)   //search transaction result from server (result upload to server by app)
					.then(function (resp) {
						console.log("tx result: " + resp)   //resp is a JSON string
						var respObject = JSON.parse(resp)
						//code==0交易发送成功, status==1交易已被打包上链
						if (respObject.code === 0) {
							if (respObject.data.status === 1) {
								clearInterval(intervalQuery);
								$.post("http://192.168.1.131:3010/users/bid", { hash: respObject.data.hash },
									function (data) {
										console.log("hash:", respObject.data.hash);
										console.log(data.code, data.msg);
									});
							} else if (respObject.data.status === 0) {
								clearInterval(intervalQuery)
							}
							    //清除定时查询
							//交易成功,处理后续任务....
							
							
						}
					})
					.catch(function (err) {
						console.log(err);
					});
				
			}
		})
}
	
	




//状态134界面渲染，这里我需要状态码判断一下
//这个界面的等待开奖就是即将售卖，售卖时间取决于初始高度这个你们商定一套规则
//$(document).ready(function () {
//	$.ajax({
//		method: "GET",
//		url: "dollars/:bidId(\d+)",
//	})
//		.done(function (data) {
//			var getarrdata = data.data[0][0];
//			console.log(getarrdata);
//			var { bidId } = data.data[0][0];
//			$("#bididnext").text(bidId);
//			var { pervalue } = getarrdata;
//			$("#pervalue1").text(pervalue);
//			var { reward } = getarrdata;
//			$("#reward").text(reward);
//			var { startHeight } = getarrdata;
//			$("#startHeight,#startHeight1").text(startHeight);
//			var fundHeight = startHeight + 9;
//			$("#fundHeight").text(fundHeight);
//
//			//获取当前区块高度?????????????????
//			function getnowheight() {
//				let Nebulas = require('nebulas');
//				let neb = new Neb();
//				var HttpRequest = require("nebulas").HttpRequest;
//				const PROVIDER_NEB = "http://192.168.1.59:8685"
//
//				neb.setRequest(new Nebulas.HttpRequest(PROVIDER_NEB))
//				var miaomiao = neb.api;
//				miaomiao.latestIrreversibleBlock().then(function (blockData) {
//					console.log(blockData);
//					console.log('w');
//					var nowheight = blockData.height;
//				});
//			};
//			getnowheight();
//			$("#nowheight").text(nowheight);
//			//已经开奖的数据和之前差不多，多一个买了多少份
//		});
//});


//index渲染
//新接口获取最新三条数据
$(document).ready(function () {
	$.ajax({
		method: "GET",
		url: "http://192.168.1.131:3010/dollars/filter/search?limit=3&page=1&new=true&status=2",//最新三条已开奖的夺宝接口
	})
		.done(function (data) {
			$("#viewfun1").hide();
			$("#viewfun2").hide();
			$("#viewfun3").hide();
			if(data.data[0][0]){
				$("#viewfun1").show();
				if(data.data[0][0].totalSum == 20){$("#bid1img").attr("src","./image/t2.png");}
				else if(data.data[0][0].totalSum == 50){$("#bid1img").attr("src","./image/t3.png");}
				else if(data.data[0][0].totalSum == 100){$("#bid1img").attr("src","./image/t4.png");}
				else{$("#bid1img").attr("src","./image/t1.png");}
				$("#bid1img").click(function () {
					sessionStorage.setItem('bidId', data.data[0][0].bidId);
					sessionStorage.setItem('pricebid', data.data[0][0].pervalue);
				});
				
				$("#bid1price").text(data.data[0][0].pervalue);
				$("#bid1fund").text(data.data[0][0].totalSum);
				
				$("#newsports1UserName").text(data.data[0][0].luckyName);
				$("#newports1Fund").text(data.data[0][0].totalSum);
			}
			if(data.data[0][1]) {
				$("#viewfun2").show();
				if(data.data[0][1].totalSum == 20){$("#bid2img").attr("src","./image/t2.png");}
				else if(data.data[0][1].totalSum == 50){$("#bid2img").attr("src","./image/t3.png");}
				else if(data.data[0][1].totalSum == 100){$("#bid2img").attr("src","./image/t4.png");}
				else{$("#bid2img").attr("src","./image/t1.png");}
				$("#bid2img").click(function () {
					sessionStorage.setItem('bidId', data.data[0][1].bidId);
					sessionStorage.setItem('pricebid', data.data[0][1].pervalue);
				});
				$("#bid2price").text(data.data[0][1].pervalue);
				$("#bid2fund").text(data.data[0][1].totalSum);
				
				$("#newsports2UserName").text(data.data[0][1].luckyName);
				$("#newports2Fund").text(data.data[0][1].totalSum);
			}
			
			if(data.data[0][2]) {
				$("#viewfun3").show();
				if(data.data[0][2].totalSum == 20){$("#bid3img").attr("src","./image/t2.png");}
				else if(data.data[0][2].totalSum == 50){$("#bid3img").attr("src","./image/t3.png");}
				else if(data.data[0][2].totalSum == 100){$("#bid3img").attr("src","./image/t4.png");}
				else{$("#bid3img").attr("src","./image/t1.png");}
				$("#bid2img").click(function () {
					sessionStorage.setItem('bidId', data.data[0][2].bidId);
					sessionStorage.setItem('pricebid', data.data[0][2].pervalue);
				});
				$("#bid3price").text(data.data[0][2].pervalue);
				$("#bid3fund").text(data.data[0][2].totalSum);
				
				$("#newsports3UserName").text(data.data[0][2].luckyName);
				$("#newports3Fund").text(data.data[0][2].totalSum);
			}
			
			//给商品赋bidId
			
			//轮播图资源
//    var indexbanner = data.data[0];
//    $('#indexbanner1').attr('src', 'indexbanner[0]');
//    $('#indexbanner2').attr('src', 'indexbanner[1]');
//    $('#indexbanner3').attr('src', 'indexbanner[2]');
//    $('#indexbanner4').attr('src', 'indexbanner[3]');
			
			//最新三个夺宝
		});
});
//对全部商品加载全部夺宝
$(document).ready(function () {
	$.ajax({
		method: "GET",
		url: "http://192.168.1.131:3010/dollars/filter/search?limit=10&page=1",//正在售卖的四个商品
	})
		.done(function (data) {
			if(data.data[0][0].totalSum == 20){$("#allbid1img").attr("src","./image/t2.png");}
			else if(data.data[0][0].totalSum == 50){$("#allbid1img").attr("src","./image/t3.png");}
			else if(data.data[0][0].totalSum == 100){$("#allbid1img").attr("src","./image/t4.png");}
			else{$("#allbid1img").attr("src","./image/t1.png");}
			
			if(data.data[0][1].totalSum == 20){$("#allbid2img").attr("src","./image/t2.png");}
			else if(data.data[0][1].totalSum == 50){$("#allz`bid2img").attr("src","./image/t3.png");}
			else if(data.data[0][1].totalSum == 100){$("#allbid2img").attr("src","./image/t4.png");}
			else{$("#allbid2img").attr("src","./image/t1.png");}
			
			if(data.data[0][2].totalSum == 20){$("#allbid3img").attr("src","./image/t2.png");}
			else if(data.data[0][2].totalSum == 50){$("#allbid3img").attr("src","./image/t3.png");}
			else if(data.data[0][2].totalSum == 100){$("#allbid3img").attr("src","./image/t4.png");}
			else{$("#allbid3img").attr("src","./image/t1.png");}
			
			if(data.data[0][2].totalSum == 20){$("#allbid4img").attr("src","./image/t2.png");}
			else if(data.data[0][2].totalSum == 50){$("#allbid4img").attr("src","./image/t3.png");}
			else if(data.data[0][2].totalSum == 100){$("#allbid4img").attr("src","./image/t4.png");}
			else{$("#allbid4img").attr("src","./image/t1.png");}
			//给商品赋bidId
			$("#buyimg1,#buyimg11").click(function () {
				sessionStorage.setItem('bidId', data.data[0][0].bidId);
				sessionStorage.setItem('pricebid', data.data[0][0 ].pervalue);
				sessionStorage.setItem('remainCt', data.data[0][0].totalCt-data.data[0][0].count);
			});
			$("#buyimg2,#buyimg22").click(function () {
				sessionStorage.setItem('bidId', data.data[0][1].bidId);
				sessionStorage.setItem('pricebid', data.data[0][1].pervalue);
				sessionStorage.setItem('remainCt', data.data[0][1].totalCt-data.data[0][1].count);
			});
			$("#buyimg3,#buyimg33").click(function () {
				sessionStorage.setItem('bidId', data.data[0][2].bidId);
				sessionStorage.setItem('pricebid', data.data[0][2].pervalue);
				sessionStorage.setItem('remainCt', data.data[0][2].totalCt-data.data[0][2].count);
			});
			$("#buyimg4,#buyimg44").click(function () {
				sessionStorage.setItem('bidId', data.data[0][3].bidId);
				sessionStorage.setItem('pricebid', data.data[0][3].pervalue);
				sessionStorage.setItem('remainCt', data.data[0][3].totalCt-data.data[0][3].count);
			});
			var getarrdata = data.data[0][0];
//    $("#allbid1img").attr('src','');
			var remainct = getarrdata.totalCt-getarrdata.count;
			$("#allbid1amount").text(remainct);
//    console.log("a="+data.data[0][0].totalCt-count);
			var { pervalue } = getarrdata;
			$("#allbid1price").text(pervalue);
			var { totalSum } = getarrdata;
			$("#allbid1fund").text(totalSum);
			
			var getarrdata2 = data.data[0][1];
//    $("#allbid1img").attr('src','');
			var remainct = getarrdata2.totalCt-getarrdata2.count;
			$("#allbid2amount").text(remainct);
//    console.log("a="+data.data[0][0].totalCt-count);
			var { pervalue } = getarrdata2;
			$("#allbid2price").text(pervalue);
			var { totalSum } = getarrdata2;
			$("#allbid2fund").text(totalSum);
			
			var getarrdata3 = data.data[0][2];
//    $("#allbid1img").attr('src','');
			var remainct = getarrdata3.totalCt-getarrdata3.count;
			$("#allbid3amount").text(remainct);
//    console.log("a="+data.data[0][0].totalCt-count);
			var { pervalue } = getarrdata3;
			$("#allbid3price").text(pervalue);
			var { totalSum } = getarrdata3;
			$("#allbid3fund").text(totalSum);
			//第四个没有
			var getarrdata4 = data.data[0][3];
//    $("#allbid1img").attr('src','');
			var { remainct } = getarrdata4.totalCt-getarrdata4.count;
			$("#allbid4amount").text(remainct);
//    console.log("a="+data.data[0][0].totalCt-count);
			var { pervalue } = getarrdata4;
			$("#allbid4price").text(pervalue);
//	var {totalSum} = getarrdata4;
			$("#allbid4fund").text(getarrdata4.totalSum);
		});
});


//开奖详情页
$(document).ready(function () {
	var bidId = sessionStorage.getItem('bidId');
//       console.log("a="+bidId);
	$.ajax({
		method: "GET",
		url: "http://192.168.1.131:3010/dollars/" + bidId,
	})
	
	
	.done(function (data) {
		
		var userName = sessionStorage.getItem('userName');
		if(data.data.luckyName == userName){$("#wait3").addClass("wait3lucky")}
		
		 if(data.data.totalSum == 20){$("#firstimg").attr("src","../../image/t2.png");}
		 else if(data.data.totalSum == 50){$("#firstimg").attr("src","../../image/t3.png");}
		 else if(data.data.totalSum == 100){$("#firstimg").attr("src","../../image/t4.png");}
		 else{$("#firstimg").attr("src","../../image/t1.png");}
		 
		 //开奖图片
		
//		if(data)
//		 console.log(data.data.totalSum);
		$("#bididnext").text(data.data.bidId);
		$("#pervalue1").text(data.data.pervalue);
		$("#reward").text(data.data.totalSum);
		$("#startHeight,#startHeight1").text(data.data.startHeight);
		$("#fundHeight,#fundHeight1").text(data.data.startHeight+9);
		$("#lucky").text(data.data.lucky);
		$("#totaljoin").text(data.data.totalCt-data.data.count);
		
//		全部参与记录
	if(data.data.users[0]){
		$("#thisuser0").text(data.data.users[0].nickName);
		$("#joinnumber01").text(data.data.users[0].luckNums[0]);
		$("#joinnumber02").text(data.data.users[0].luckNums[data.data.users[0].luckNums.length-1]);
		$("#time0").text(data.data.users[0].time);
	}
	if(data.data.users[1]){
		$("#thisuser1").text(data.data.users[1].nickName);
		$("#joinnumber11").text(data.data.users[1].luckNums[0]);
		$("#joinnumber12").text(data.data.users[1].luckNums[data.data.users[1].luckNums.length-1]);
		$("#time1").text(data.data.users[1].time);
	}
	if(data.data.users[2]){
		$("#thisuser2").text(data.data.users[2].nickName);
		$("#joinnumber21").text(data.data.users[2].luckNums[2]);
		$("#joinnumber22").text(data.data.users[2].luckNums[data.data.users[2].luckNums.length-1]);
		$("#time2").text(data.data.users[0].time);
	}
//		if(!data.data.users[0].luckNums[data.data.users[0].luckNums.length-1]){
//			$("#joinnumber02").hide();
//			$("#line0").hide();
//		}
//		if(!data.data.users[1].luckNums[data.data.users[1].luckNums.length-1]){
//			$("#joinnumber12").hide();
//			$("#line1").hide();
//		}
//		if(data.data.users[2].luckNums[data.data.users[2].luckNums.length-1]){
//			$("#joinnumber22").hide();
//			$("#line2").hide();
//		}
	});
});



$(document).ready(function () {
	var bidId = sessionStorage.getItem('bidId');
//       console.log("a="+bidId);
	$.ajax({
		method: "GET",
		url: "http://192.168.1.131:3010/users/bidRecord?bidId="+bidId,
	})
		.done(function (data) {
//		我的参与记录
			$("#hideContent1").hide();
			$("#hideContent2").hide();
			$("#hideContent3").hide();
			if(data.code!==10099) {
				if (data.data.bidRecord[0]) {
					$("#hideContent1").show();
					$("#thisuser0i").text(data.data.bidRecord[0].nickName);
					$("#joinnumber01i").text(data.data.bidRecord[0].luckNums[0]);
					$("#joinnumber02i").text(data.data.bidRecord[0].luckNums[data.data.bidRecord[0].luckNums.length - 1]);
					$("#time0i").text(data.data.bidRecord[0].time);
				}
				if (data.data.bidRecord[1]) {
					$("#hideContent2").show();
					$("#thisuser1i").text(data.data.bidRecord[1].nickName);
					$("#joinnumber11i").text(data.data.bidRecord[1].luckNums[0]);
					$("#joinnumber12i").text(data.data.bidRecord[1].luckNums[data.data.bidRecord[1].luckNums.length - 1]);
					$("#time1i").text(data.data.bidRecord[1].time);
				}
				if (data.data.bidRecord[2]) {
					$("#hideContent3").show();
					$("#thisuser2i").text(data.data.bidRecord[3].nickName);
					$("#joinnumber21i").text(data.data.bidRecord[3].luckNums[0]);
					$("#joinnumber22i").text(data.data.bidRecord[3].luckNums[data.data.bidRecord[3].luckNums.length - 1]);
					$("#time2i").text(data.data.bidRecord[2].time);
				}
			}
		});
	
});

//我的订单界面..等等和用户相关的资料users
$(document).ready(function () {
	$.ajax({
		method: "GET",
		url: "http://192.168.1.131:3010/users",
	})
		.done(function (data) {
			
			
			$("#f4").click(function () {
				if (data.msg == "请先登录") {
					location.href = 'html/sign/5.html';
				}
				else {
					location.href = 'html/main/user.html';
				}
			});
			$("#f3").click(function () {
				if (data.msg == "请先登录") {
					location.href = 'html/sign/5.html';
				}
				else {
					location.href = 'html/main/order.html';
				}
			});
			$("#f2").click(function () {
//				if (data.msg == "请先登录") {
//					location.href = 'html/sign/5.html';
//				}
//				else {
//					location.href = 'html/main/lottery.html';
//				}
				alert("修改中")
			});

		if(data.code!=10099){
			sessionStorage.setItem('userName', data.data.userName);
			$("#userNamePage").text(data.data.userName);
			
			$("#flexcontent1").hide();
			$("#flexcontent2").hide();
			
			
			//一次参与记录
			if(data.data.bidRecord[0]){
				$("#flexcontent1").show();
			$("#userbidId0").text(data.data.bidRecord[0].bidId);
			$("#usertime0").text(data.data.bidRecord[0].time);
			$("#orderId1").text(data.data.bidRecord[0].orderId);
//			console.log(data.data.bidRecord[data.data.bidRecord.length-1].orderId);
			$("#joinnumber01o").text(data.data.bidRecord[0].luckNums[0]);
			$("#joinnumber02o").text(data.data.bidRecord[0].luckNums[data.data.bidRecord[0].luckNums.length-1]);
			if(data.data.bidRecord[0].lucky){
				$("#luckyNumber1o").text(data.data.bidRecord[0].lucky);
			}else {$("#luckyNumber1o").text("暂未开奖");}
		}
		
		if(data.data.bidRecord[1]){
			$("#flexcontent2").show();
			$("#userbidId1").text(data.data.bidRecord[1].bidId);
			$("#usertime1").text(data.data.bidRecord[1].time);
			$("#orderId2").text(data.data.bidRecord[1].orderId);
			$("#joinnumber11o").text(data.data.bidRecord[1].luckNums[0]);
			$("#joinnumber12o").text(data.data.bidRecord[1].luckNums[data.data.bidRecord[1].luckNums.length-1]);
			if(data.data.bidRecord[1].lucky){
				$("#luckyNumber2o").text(data.data.bidRecord[1].lucky);
			}
			else {$("#luckyNumber2o").text("暂未开奖");}
		}
		}
//			$("#userjoinnum").text();
//			$("#state").text();

//			$("#thisuser1i").text(data.data.bidRecord[2].nickName);
//			$("#joinnumber11i").text(data.data.bidRecord[2].luckNums[0]);
//			$("#joinnumber12i").text(data.data.bidRecord[2].luckNums[data.data.bidRecord[1].luckNums.length-1]);
//			$("#time1i").text(data.data.bidRecord[2].time);
			
		});
});


//注销





