//lottery子页面切换
$(function () { 
    $("#miao2").click(function () { 
        $("iframe").attr("src", "lottery_iframe2.html"); 
    }); 

    $("#miao1").click(function () { 
        $("iframe").attr("src", "lottery_iframe.html"); 
    }); 
}); 
//下注数量逻辑
        //+++
function sub(psid) {
	var yzquantity = $(".yzquantity" + psid).val();
	if (yzquantity > 0) {
		if (yzquantity == 1) {
			alert("已到达最小数量！");
			return;
		}
		yzquantity--;
		$(".yzquantity" + psid).val(yzquantity);
		var amount = $("#ct").val() * 100 + "EOS";
		$("#amount").text(amount);
	} else {
		alert("请输入有效数量！");
	}
}
//---
function plus(psid) {
	var yzquantity = $(".yzquantity" + psid).val();
	if (yzquantity > 0) {
		yzquantity++;
		$(".yzquantity" + psid).val(yzquantity);
		var amount = $("#ct").val() * 100 + "EOS";
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
		var amount = num * 100 + "EOS";
		$("#amount").text(amount);
	}).change();
}); 


$(function () { 
	$("#miao1").click(function () { 
		$("iframe").attr("src", "1_6_1.html"); 
	}); 

	$("#miao2").click(function () { 
		$("iframe").attr("src", "1_6_2.html"); 
	}); 
}); 

