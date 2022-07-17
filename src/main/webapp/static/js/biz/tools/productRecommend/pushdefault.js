
            var data = ["篮球", "足球", "乒乓球", "羽毛球",
                "棒球", "中国大陆", "国贸银行", "国际组织",
                "国", "国际", "E动国际", "良心", "良人", "教育",
                "中国", "国人", "中国人民", "义务教育",
                "应试教育", "教训"
            ];

            var listData = [
                // 网贷
                {
                    id: "0",
                    name: "篮球",
                    str: "产品名称",
                    str2: "推荐语",
                    str3: "按钮图片",
                    str4: "操作"
                },
                // 基金
                {
                    id: "1",
                    name: "足球",
                    str: "产品名称",
                    str2: "推荐语",
                    str3: "按钮图片",
                    str4: "操作"
                },
                // 保险
                {
                    id: "2",
                    name: "排球",
                    str: "产品名称",
                    str2: "推荐语",
                    str3: "按钮图片",
                    str4: "操作"
                }
            ]

            // 三级联动
            sheng();

            function sheng() {
                var arr1 = ['<option value="">请选择省</option>'];
                $.each(cityData3, function (v, z) {
                    arr1.push('<option value="', z.value, '">', z.text, '</option>');
                });
                $('#pro').html(arr1.join(''));
            }
            //给省添加change事件
            $('#pro').change(function () {
                var $this = $(this),
                    proV = this.value;
                N(proV);
                $('#area').html('<option value="">请选择</option>');
            });
            //获取市级数据
            function N(num) {
                $.each(cityData3, function (v, z) {
                    if (num == z.value) {
                        arr2 = z.children;
                        shi(arr2);
                    }
                });
            }
            //渲染市级数据oye
            function shi(val) {
                var arr2 = ['<option value="">请选择</option>'];
                $.each(val, function (v, z) {
                    arr2.push('<option value="', z.value, '">', z.text, '</option>');
                });
                $('#city').html(arr2.join(''));
            }
            //给市级添加change事件
            $('#city').change(function () {
                var $this = $(this),
                    cityV = this.value;
                end(cityV);
            });
            //获取区级数据
            function end(num) {
                $.each(arr2, function (v, z) {
                    if (num == z.value) {
                        arr3 = z.children;
                        qu(arr3);
                    }
                });
            }
            //渲染区级数据
            function qu(val) {
                var arr3 = ['<option value="">请选择区</option>'];
                $.each(val, function (v, z) {
                    arr3.push('<option value="', z.value, '">', z.text, '</option>');
                });
                $('#area').html(arr3.join(''));
            }


            // 模糊搜索
            var curidx, lisz, curvale, list = [], arr = [], liText, lisArr = [], arrData = [], vals;
            var addevent = function () {
                $("#searchShop").keyup(inputonchange).click(oninptclk).focus(oniptcus);
                // $("#ul").on("click", "li", onlisclk);
                $("#btn").click(btnclick);
            }
            var btnclick = function () {
                var $input = $("#searchShop").val();
                if ($input == '') {
                    alert("请输入要搜索的内容");
                }
            }
            // var onlisclk = function (e) {
            //     $(this).addClass("on").siblings(".on").removeClass("on");
            //     var e = $(this).text();
            //     var nums = $(this).val()
            //     $(this).parent().hide();
            //     list.push('<li value=', nums, '>' + e + '</li>');
            //     $('#conters-ul').html(list.join(""))
            //     $("#searchShop").text('')
            // }

            var oniptcus = function () {
                $(this).trigger("keyup");
            }
            var oninptclk = function (e) {
                e.stopPropagation();
                $("#ul").show();
            }

            var inputonchange = function (e) {
                var curvalue = this.value;
                if ($.trim(curvalue) == "") {
                    $("#ul").empty();
                    $("#ul").hide();
                    return;
                }
                if (e.keyCode == 38) {
                    dealli(false);
                } else if (e.keyCode == 40) {
                    dealli(true);
                } else if (e.keyCode == 13) {

                } else {
                    renderlist(curvalue)
                };
            }
            var dealli = function (bln) {
                if (curidx || curidx == 0) {
                    if (bln) {
                        curidx++;
                        if (curidx > lisz - 1) {
                            curidx = 0;
                        }
                    } else {
                        curidx--;
                        if (curidx < 0) {
                            curidx = lisz - 1;
                        }
                    }
                } else {
                    if (bln) {
                        curidx = 0;
                    } else {
                        curidx = lisz - 1;
                    }
                }
                $("#ul li").eq(curidx).addClass("on").siblings(".on").removeClass("on");
                $("#searchShop").val($("#ul li.on").text());
            }
            var renderlist = function (cle) {
                curidx = null;
                var $ul = $("#ul"),
                    lisarr = [];
                $.each(listData, function (i, v) {
                    if (v.name.indexOf(cle) > -1) {
                        lisarr.push('<li value=', v.id, '>' + v.name + '</li>');
                    }
                })
                $ul.html(lisarr.join("")).show();
                lisz = $("#ul li").size();

            }

            // 右边li添加颜色
            var liListText = [];
            $('.lisul').on('click', 'li', function () {
                // $('#ul .on').removeClass('on');
                if ($('.on').size() == 3) {
                    $(this).addClass('on').siblings('.on').removeClass('on');
                } else {
                    $(this).addClass('on');
                }

            });

            // 双击右边li取消
            $('.lisul').on('dblclick', 'li', function () {
                $(this).removeClass('on');
            });


            // 给右边盒子添加li 给下面添加
            // var addFn = function(){
            //      // 给右边盒子添加li
            //     lisArr.push('<li value=',vals,'>',liText,'</li>');

            //     $('#conters-ul').html(lisArr.join(''));

            // }

            //往上移动
            $('.arrow-ss').click(function () {
                var index = $('.lisul').find('.on'),      //找到选中的li
                    liSzie = index.size();
                for (var i = 0; i < liSzie; i++) {
                    if (index.index() != 0) {                            //只要【下标值】不是0，都可以上移
                        index.prev().before(index);
                    }
                }
            });

            // 往下移动
            $('.arrow-bb').click(function () {
                var index = $('.lisul').find('.on');
                if (index.index() != length - 1) {                    //只要【下标值】不是最后一个都可以下移
                    index.next().after(index);
                }
            });
            // 往右移
            $('.y').click(function () {
                list = [];
                Arr=[];
                lisArr.push('<li>', liText, '</li>');
                $('.lisul').html(lisArr.join(''));
                $('#conters-ul li ').removeClass('on');
            });

            // 确定操作
            $('.hadnleBtn').click(function () {
                list = [];
                $.each(listData, function (index, val) {
                    if (val.name === liText) {
                        arrData.push('<ol class="pushOl">',
                            '<li>', val.id, '</li>',
                            '<li class="category_zl">', val.name, '</li>',
                            '<li>', val.str, '</li>',
                            '<li>', val.str2, '</li>',
                            '<li>', val.str3, '</li>',
                            '<li class="liBlue" value=', val.id, '><span class="headleLook">', val.str4, '</span></li>',
                            '</ol>'
                        )
                    }
                });
                $('.conter_div').html(arrData.join(''))

                $('#conters-ul li').remove();
                $('.lisul li').remove();
                $('.on').removeClass('on')

            });

            $('.Upload').click(function () {

            });
            addevent();
            // 判断选择名单显示隐藏
            $('#headleIsshow ').change(function () {
                if ($("#headleIsshow option:selected").text() == '白名单') {
                    $('.isshow').css({ 'display': 'block' })
                } else {
                    $('.isshow').css({ 'display': 'none' })
                }
            });

            // 选择名单 搜索按钮
            $('.Spinner').click(function (event) {
                // var text = $(".inpt").val();
                // if(text != ""){
                //     $('.isshow ol').css({ 'display': 'none' });
                // }
                event.stopPropagation();
            });
            // 关闭下拉框
            $('.isshow ol').on('click', 'li', function (event) {
                $('.inpt').val($(this).text())
                $('.isshow ol').css({ 'display': 'none' });
                event.stopPropagation();
            });

            $(document).click(function () {
                // 关闭下拉框
                $(".isshow ol").hide();
            });





            var Arr = [];

            // 修改部分

            //  给左边盒子添加li
            $('#ul').on('click', 'li', function () {
                var liText = $(this).text();
                Arr.push('<li>', liText, '</li>');
                $("#conters-ul").html(Arr.join(""));
                $('#ul').hide();
            })


            $("#conters-ul").on("click", 'li', function () {
                $(this).addClass('on').siblings('.on').removeClass('on');
                liText = $(this).text();
                vals = $(this).val();
            });

            $("#conters-ul li").hover(function () {
                $(this).addClass('on').siblings('.on').removeClass('on');
            })


            // 往回移
            $('.z').click(function () {
                $('.on').remove();
            });


            // 判断弹出框显示隐藏
            $('.conter-xia').on('click', '.headleLook', function () {
                var a = $(this).parent().val();
                if (a === 0) {
                    // 篮球就是网贷
                    $('.popups').css({ 'display': 'block' })
                    $('.Peer-to-peer').css({ 'display': 'block' })
                    $('.fund').css({ 'display': 'none' })
                    $('.Insurance').css({ 'display': 'none' })
                }
                if (a === 1) {
                    // 足球等于 基金
                    $('.popups').css({ 'display': 'block' })
                    $('.fund').css({ 'display': 'block' })
                    $('.Peer-to-peer').css({ 'display': 'none' })
                    $('.Insurance').css({ 'display': 'none' })
                }
                if (a === 2) {
                    // 排球等于保险
                    $('.popups').css({ 'display': 'block' })
                    $('.Insurance').css({ 'display': 'block' })
                    $('.fund').css({ 'display': 'none' })
                    $('.Peer-to-peer').css({ 'display': 'none' })
                }
            })

            // 关闭弹出框
            $('.shut_zl').click(function () {
                $('.popups').css({ 'display': 'none' })
            })




            // 精准搜索
            var curIdx, liSz;
            $('.inpt').keyup(function (e) {
                $('.isshow ol').css({ 'display': 'block' });
                var curVle = this.value,
                    $ul = $(".isshow ol"),
                    lisArr = [];
                if ($.trim(curVle) == "") {
                    $ul.hide();
                    return;
                }
                if (e.keyCode == 38) {
                    dealLi(false);
                } else if (e.keyCode == 40) {
                    dealLi(true);
                } else if (e.keyCode == 13) {
                    var curSelVle = $(".on").text();
                    $(".inpt").val(curSelVle);
                    $(".isshow ol").hide();
                } else {
                    $.each(data, function (i, v) {
                        if (v.indexOf(curVle) > -1) {
                            lisArr.push('<li>', v, '</li>');
                        }
                    });
                    $ul.html(lisArr.join(""));
                    liSz = $ul.find("li").size();
                    curIdx = null;
                };
            })


            $('.isshow ol').on('click', 'li', onLiClk);
            var onLiClk = function () {
                var curVle = $(this).text();
                $(".inpt").val(curVle);
            };


            var onIptFcs = function () {
                $(this).trigger("keyup");
            };

            function dealLi(bln) {
                if (curIdx || curIdx == 0) {
                    bln ? curIdx++ : curIdx--;
                    if (curIdx > liSz - 1) {
                        curIdx = 0;
                    }
                    if (curIdx < 0) {
                        curIdx = liSz - 1;
                    }
                } else {
                    if (bln) {
                        curIdx = 0;
                    } else {
                        curIdx = liSz - 1;
                    }
                }
                $(".isshow ol li").eq(curIdx).addClass("on").siblings(".on").removeClass("on");
            }






            // 判断推荐产品是否显示 
            $('#city').change(function(){
                var a = $(this).val();
                if(a > 130000){
                    $('#select_zl').css({'display':'block'})
                }
            })
            
            // 推荐产品框
            $('#select_zl').change(function(){
                console.log(1)
                $("#conters-ul li").remove();
                lisArr = [];
                Arr = [];
            })








            // 公共部分
            $(document).ready(function () {
                $('.buttonMessage').hide()
                $('.imageMessage').hide()
            })
            // 默认显示确定按钮
            $('.defaultMessageBtn').click(function () {
                var homeBgColor = $('.homeBgColor').val()
                var homeTitle = $('.homeTitle').val()
                $('#iframes').contents().find('body').css({
                    background: homeBgColor
                })
                $("#iframes").contents().title = homeTitle
                console.log($("iframe").contents())
            })
            // 点击组件部分
            $('.setBtnFunction').click(function () {
                $('.defaultMessage').hide()
                $('.imageMessage').hide()
                $('.buttonMessage').show()
                $(this).addClass('active').siblings().removeClass('active')
            })
            $('.imgBtnFunction').click(function () {
                $('.defaultMessage').hide()
                $('.buttonMessage').hide()
                $('.imageMessage').show()
                $(this).addClass('active').siblings().removeClass('active')
            })

            // 图片设定确定按钮
            $('.imageMessageBtn').click(function () {
                var imgRadius = $('.imgRadius').val(),
                    imgLink = $('.imgLink').val(),
                    imgWidth = $('.imgWidth').val(),
                    imgHeight = $('.imgHeight').val(),
                    imgJumpLink = $('.imgJumpLink').val()

                $('.imgBtnFunction').removeClass('active')

                $('.defaultMessage').show()
                $('.imageMessage').hide()
                $("#iframes").contents().find("body").append(`<img style="width:${imgWidth}rem;height:${imgHeight}rem;border-radius:${imgRadius};" src=${imgLink}>`)
            })

            // 按钮设定确定按钮
            $('.buttonMessageBtn').click(function () {
                var btnWord = $('.btnWord').val(),
                    btnRadius = $('.btnRadius').val(),
                    btnFrame = $('.btnFrame').val(),
                    btnWidth = $('.btnWidth').val(),
                    btnHeight = $('.btnHeight').val(),
                    btnColor = $('.btnColor').val(),
                    btnJumpLink = $('.btnJumpLink').val(),
                    btnWordColor = $('.btnWordColor').val(),
                    btnWordSize = $('.btnWordSize').val()
                $('.setBtnFunction').removeClass('active')

                $('.defaultMessage').show()
                $('.buttonMessage').hide()
                if (btnWord) {
                    $('#iframes').contents().find('body').append(`<button style="background:${btnColor};width:${btnWidth}rem;height:${btnHeight}rem;border-radius:${btnRadius};border:${btnFrame};font-size:${btnWordSize}px;color:${btnWordColor}">${btnWord}</button>`)
                }
            })