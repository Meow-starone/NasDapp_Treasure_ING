$.ajaxSetup({ xhrFields: {withCredentials: true}});


//lottery子页面切换
$(function () { 
	$("#miao1").click(function () { 
		$("iframe").attr("src", "lottery_iframe.html"); 
	}); 

	$("#miao2").click(function () { 
		$("iframe").attr("src", "lottery_iframe2.html"); 
	}); 
}); 
//下注数量逻辑
        //+++
//6的倍数会溢出
var pricebid = sessionStorage.getItem('pricebid');
var remainCt = sessionStorage.getItem('remainCt');
//console.log(pricebid);
function sub(psid) {
	var yzquantity = $(".yzquantity" + psid).val();
	if (yzquantity > 0) {
		if (yzquantity == 1) {
//			alert("已到达最大数量！");
			return;
		}
		yzquantity--;
		$(".yzquantity" + psid).val(yzquantity);
		var amount = ($("#ct").val() * pricebid).toFixed(3) + "Nas";
		$("#amount").text(amount);
	} else {
		alert("请输入有效数量！");
	}
}
//---
function plus(psid) {
	var yzquantity = $(".yzquantity" + psid).val();
	if (yzquantity > 0) {
		if (yzquantity == remainCt) {
			alert("已到达可购买最大数量！");
			return;
		}
		yzquantity++;
		$(".yzquantity" + psid).val(yzquantity);
		var amount = ($("#ct").val() * pricebid).toFixed(3) + "Nas";
		$("#amount").text(amount);
	} else {
		alert("请输入有效数量！");
	}

}

function yzquantity(psid) {
	var yzquantity = $(".yzquantity" + psid).val();
	var reg = /^[0-9]*$/;
	reg.test(yzquantity);
	if (reg.test(yzquantity) == false) {
		alert("请输入有效数量！");

	}else{
		$(".yzquantity" + psid).val(yzquantity);
	}
}

$(function () {

	$("#ct").change(function () {
		var num = $(this).val();
		var amount = (num * pricebid).toFixed(3) + "Nas";
		$("#amount").text(amount);
	}).change();
});

//banner轮播
var t;
var index = 0;
t = setInterval(play, 3000)//自动播放
function play() {
    index++;
    if (index > 4) {
        index = 0
    }
    // console.log(index)
    $("#lunbobox ul li").eq(index).css({
        "background-color": "rgba(204,204,204,0.9)",
        "border": "1px solid #ffffff"
    }).siblings().css({
        "background-color": "rgba(204,204,204,0.7)",
        "border": ""
    })

    $(".lunbo a ").eq(index).fadeIn(1000).siblings().fadeOut(1000);
};
///点击鼠标 图片切换
$("#lunbobox ul li").click(function() {

    //添加 移除样式
    //$(this).addClass("lito").siblings().removeClass("lito"); //给当前鼠标移动到的li增加样式 且其余兄弟元素移除样式   可以在样式中 用hover 来对li 实现
    $(this).css({
        "background-color": "rgba(204,204,204,0.9)",
        "border": "1px solid #ffffff"
    }).siblings().css({
        "background-color": "rgba(204,204,204,0.7)",
    })
    var index = $(this).index(); //获取索引 图片索引与按钮的索引是一一对应的
    // console.log(index);

    $(".lunbo a ").eq(index).fadeIn(1000).siblings().fadeOut(1000); // siblings  找到 兄弟节点(不包括自己）
});


//首页消息滚动
$(function() {
    //获得当前<ul>
    var $uList = $(".newright ul");
    var timer = null;
    //触摸清空定时器
    $uList.hover(function() {
        clearInterval(timer);
    },
    function() { //离开启动定时器
        timer = setInterval(function() {
            scrollList($uList);
        },
        3000);
    }).trigger("mouseleave"); //自动触发触摸事件
    //滚动动画
    
    function scrollList() {
        //获得当前<li>的高度
        var scrollHeight = $("ul li:first").height()*6.5;
//        console.log(scrollHeight);
        //滚动出一个<li>的高度
        $uList.stop().animate({
            marginTop: -scrollHeight
        },
        1300,
        function() {
            //动画结束后，将当前<ul>marginTop置为初始值0状态，再将第一个<li>拼接到末尾。
            $uList.css({
                marginTop:0
            }).find("li:first").appendTo($uList);
        });
    }
});


//开奖信息子页面切换
$(function () { 
	$("#canyu1").click(function () { 
		$("iframe").attr("src", "1_6_1.html"); 
	}); 

	$("#canyu2").click(function () { 
		$("iframe").attr("src", "1_6_2.html"); 
	}); 
}); 


//复制收款地址
function copy(){
	alert("复制成功")
}


//转出币调用钱包
function clicked() {
    let Nebpay = require('nebpay');
    let nebpay = new Nebpay();
        // let args = ["n1SAQy3ix1pZj8MPzNeVqpAmu1nCVqb5w8c"];
        var callArgs = "[\"" + $("#search_value").val() + "\",\"" + $("#add_value").val() + "\"]";
        var toaddress = $("#telephone").val();
        var amount = $("#password").val();
        var callFunction = "save";
        var options = {
                listener: undefined,//根据需求返回值
            };
        nebpay.call(
                    toaddress, 
                    amount,
                    callFunction, 
                    callArgs,
                    options 
                    );
}


//修改密码逻辑
$(function(){
    $(".passrevise").click(function(){ 
        var a = $("#telephone").val();
        var b = $("#password").val();
        var c = 1;
        var reg = /^[a-zA-Z0-9]{8,12}$/;
        abreg = reg.test(a) && reg.test(b);
        
        if(a!==b){alert("两次输入的密码不一致");
                  $("#telephone").val("");
                  $("#password").val("");
                  c = 0;
        }
        else{
                if(abreg == false){
                    alert("密码长度为8-12位");
                    $("#telephone").val("");
                    $("#password").val("");
                    c = 0;
                }
            }
            console.log(c);
        if(c == 1){
                    $.ajax({
                            url: "http://192.168.1.212:3010/users/password",
                            type: "POST",
                            data: {password:$("#password").val()},
                            dataType: "json",
//											      xhrFields: {
//												       withCredentials: true
//											      },
                            success: function(data){
                                     console.log(body);
                                     console.log(data.code,data.msg);       
                            }
                    });
        }
    });
});

//登录逻辑
  $(function(){
		
    $(".loginfind").click(function(){
      var a = $("#filed").val(); 
      var b = $("#password").val();
      var c = 1;
      var reg = /^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){3,15}|1[0-9]{10}$/;
      areg = reg.test(a);

      if(areg==false){alert("请输入正确的用户名");
      $("#filed").val("");
      $("#password").val("");
      c = 0;
    }
    else{
      console.log(c);
      if(c == 1){
        var body = {filed:a,password:b};
        $.ajax({
//					crossDomain: true,
          type: "POST",
          url: "http://192.168.1.131:3010/login",
          data: body,
					
//					xhrFields: {
//						withCredentials: true
//					},
          success: function(data){
            console.log(body);
            console.log(data.code,data.msg);
            alert(data.msg);
            location.href = '../main/user.html'
          }
        })
      }  
    }
  });
  });

  //注册逻辑
  $(document).ready(function(){
   $(".register").click(function(){
		 
     var body ={
       userName: $("#telephone").val(), 
       password: $("#password").val(),
       address: $("#verification").val()
           // verification: $("#verification").val()
           // invitation: $("#invitation").val()
         }
//		 const nameReg = /^[^0-9].{5,11}$/
//		 nameReg.test(body.userName);
//		 if(!nameReg.test(body.userName)){//不允许注册
//
//		 }
         console.log(body)
         $.post('http://192.168.1.131:3010/register',body)
//		     $.ajaxSetup({ xhrFields: {withCredentials: true}})
         .done((data)=>{
          console.log(data)
          if(data.code==0){
            window.location.href = '../sign/5.html'
            // alert(data.msg)
          }
          else
            {alert(data.msg)}
        })
         .fail(err=>{
          console.log(err)
        })
       });
 });
//注销
$(function(){
	$("#setout").click(function(){
//		var body = {filed:a,password:b};
		$.ajax({
			type: "GET",
			url: "http://192.168.1.131:3010/loginout",
//			data: body,
			success: function(data){
				console.log(data.code,data.msg);
				if(data.msg == 'suc'){
					location.href = '../sign/5.html'
				}
			}
		})
	});
});


//Tab切换
$(function(){
	$("#miao1").click(function(){
		$("#miao2").removeClass("willopen_2");
		$("#miao1").addClass("over_2");
	});
	$("#miao2").click(function(){
		$("#miao1").removeClass("over_2");
		$("#miao2").addClass("willopen_2");
	});
});
$(function(){
	$("#canyu1").click(function(){
		$("#canyu2").removeClass("willopen_2");
		$("#canyu1").addClass("over_2");
	});
	$("#canyu2").click(function(){
		$("#canyu1").removeClass("over_2");
		$("#canyu2").addClass("willopen_2");
	});
});



//临时保存商品点击事件

//点击展示更多
$(document).ready(function(){
	$("#showmore").click(function(){        //当“展开全文”按钮点击的时候
		$("#hideContent3").show();             //展示未完全显示的那部分内容
	});
});

function noticing(){
	alert("暂未开放，敬请期待")
}

