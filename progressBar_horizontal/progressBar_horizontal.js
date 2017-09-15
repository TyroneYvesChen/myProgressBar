(function($){
    function ProgressBar(element, options) {
        this.tag = false;
        this.ox = 0;
        this.left = 0;
        this.bgleft = 0;
        this.options = options
        this.init(element)
    }

    var _progressBar = ProgressBar.prototype;

    _progressBar.init = function (element) {
        var dom = this.createDom();
        this.mouseDownEvent(dom);
        this.mouseUpEvent();
        this.mouseMoveEvent(dom);
        this.clickEvent(dom);
        this.params = {
            ele: element
        };
        $(element).append(dom)
    }

    _progressBar.createDom = function () {
        var dom = $('<div class="my-progress">'
            +'<div class="my-progress_bg">'
            +'<div class="my-progress_bar"></div>'
            +'</div>'
            +'<div class="my-progress_btn"></div>'
            +'</div>')
        return dom
    }

    _progressBar.mouseDownEvent = function (dom) {
        var _this = this
        $(dom).find(".my-progress_btn").mousedown(function(e) {
            _this.ox = e.pageX - _this.left;
            _this.tag = true;
        });
    }

    _progressBar.mouseUpEvent = function () {
        var _this = this
        $(document).mouseup(function() {
            _this.tag = false;
            document.onmousemove = null; //弹起鼠标不做任何操作
        });
    }

    _progressBar.mouseMoveEvent = function (dom) {
        var _this = this;
        $(dom).mousemove(function(e) {//鼠标移动
            var barWidth = $(dom).find(".my-progress_bg").width()
            if (_this.tag) {
                _this.left = e.pageX - _this.ox;
                if (_this.left <= 0) {
                    _this.left = 0;
                }else if (_this.left > barWidth) {
                    _this.left = barWidth;
                }
                $(dom).find('.my-progress_btn').css('left', _this.left);
                $(dom).find('.my-progress_bar').width(_this.left);
                var percent = parseInt((_this.left/barWidth)*100);
                _this.params.percent = percent;
                _this.options.callBack && typeof _this.options.callBack == "function" && _this.options.callBack(_this.params);
            }
            //防止选择内容--当拖动鼠标过快时候，弹起鼠标，bar也会移动，修复bug
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        });
    }

    _progressBar.clickEvent = function (dom) {
        var _this = this;
        $(dom).find('.my-progress_bg').click(function(e) {//鼠标点击
            var barWidth = $(dom).find(".my-progress_bg").width()
            if (!_this.tag) {
                _this.bgleft = $(dom).find('.my-progress_bg').offset().left;
                _this.left = e.pageX - _this.bgleft;
                if (_this.left <= 0) {
                    _this.left = 0;
                }else if (_this.left > barWidth) {
                    _this.left = barWidth;
                }
                $(dom).find('.my-progress_btn').css('left', _this.left);
                $(dom).find('.my-progress_bar').animate({width:_this.left},300);
                var percent = parseInt((_this.left/barWidth)*10000)/100;
                _this.params.percent = percent;
                _this.options.callBack && typeof _this.options.callBack == "function" && _this.options.callBack(_this.params);
            }
        });
    }

    $.fn.progressBar = function (options) {
        return this.each(function () {
            new ProgressBar(this, options);
        })
    };

})(jQuery);
