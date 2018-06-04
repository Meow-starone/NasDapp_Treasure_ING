//检测屏幕宽指定rem基准值
    (function() {
        var newRem = function() {
        var html = document.documentElement;
        html.style.fontSize = html.getBoundingClientRect().width / 10 + 'px';
        };
        window.addEventListener('resize', newRem, false);
        newRem();
    })();

    