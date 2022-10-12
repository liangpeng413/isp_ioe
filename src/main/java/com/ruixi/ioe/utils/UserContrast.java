package com.ruixi.ioe.utils;

import java.text.SimpleDateFormat;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

/**
 * @author liang
 * @className UserContrast
 * @description TODO
 * @date 2022/9/6 10:55 上午
 */
public class UserContrast {

    public static void main(String[] args) {

        String historyUser = "裴赛赛;白丰凯;白京陇;白小龙;白雅航;柏祝林;蔡欣;曹翰辰;曹技;曹强;曹世明;曹亚云;曾波波;曾晨光;曾科燕;曾强;曾泽霖;曾曌翾;查浩;常超杰;昌呈呈;常亚彬;陈诚;陈成杰;陈辰光;陈春雪;陈峰飞;陈淦;程博宇;程嘉伟;程民醒;程鹏;程帅;陈广建;陈广良;程英;成苑;陈浩;陈洪;陈欢;陈焕文;陈辉;陈佳恒;陈杰夫;陈杰金;陈静;陈锦泳;陈军军;陈开锋;陈力;陈丽娟;陈龙;陈明;陈奇;陈容军;陈瑞;陈善保;陈守乐;陈思弹;陈太明;陈涛;陈卫;陈晓斌;陈小芳;陈晓勇;陈雅雯;陈颖;陈勇;陈云清;陈玉香;陈振宇;陈志远;初健夫;楚楠楠;崔艺艺;崔玉焕;戴杰;戴群特;代勇;单付尚;David;邓斌;邓波;邓海波;邓明慧;邓毓强;刁明见;狄光敏;丁海明;丁慧君;丁凯;丁庆丰;丁仁周;丁姗姗;丁银辉;丁志豪;董骏飞;董乐才;董千慧;董洵;董自辉;窦一豪;段以元;杜宏量;杜康;杜琼;杜升阳;杜忠泽(首页客服);Ezio;樊川;方承维;范国徽;房延鹏;房宇亮;樊金;樊凯;樊龙夫;范珮;范培华;范升旭;范志强;费建垒;冯昌义;冯候琴;冯欢欢;冯灵通;冯立鹏;冯帅炬;冯艺灵;符洪斌;付龙飞;付提;傅增森;高冲;皋峰;高琳;高李琴;高朋朋;高松;龚兵光;龚俊峰;宫雯;宫永鹏;管彬(Bing);管海燕;关向景;桂方强;桂梦辉;顾佳雯;郭浩柱;郭继成;郭杰;郭濛;郭鹏;国爽(水逆请退散);郭万新;郭欣晟;郭章勇;郭振弘(门店小时工);郭振声;郭智捷;郭子煊;韩白静;韩丹妮;韩吉;韩江霖;韩鹏;韩肖肖;何君;贺凯;何雷;何丽芳;和龙;何南南;何艳;何忠;洪冬;洪振榕;侯晓芸;侯熠;侯义帅;侯志远;滑安东(up skr);华斌;怀虎;黄超;黄琛;黄锦妹;黄骏宇;黄林;黄玲;黄媚芳;黄鹏;黄蕊云;黄圣俊;黄书竞;黄涛;黄小琳;黄小雪;黄鑫;黄亚玲;黄营;黄玉飞;黄振;黄珠妹;桓少云;胡缓缓;胡璟璟;胡凯豪;胡路杰;霍国栋;胡清泉;胡文浩;胡勇;胡玥祺;胡志鹏;胡周丽;贾德民;姜博伦;姜驰;姜方元;江海艳(.);姜浩;江泓哲;姜捷萌;蒋焜;江林;姜伦;蒋攀攀;蒋天赐;江玉华;蒋振伟;江忠正;焦健;焦瑞(Jerry);贾志宇;解红辉;揭莲花;金蓓蓓;金柳余;靳平;纪志伟;季中原;瞿成锋;鞠洪涛;康国伟;康叔冬;亢治虎;柯友亮;况仁枭;赖必强;赖武法;雷鹏;雷钦军;雷正伟;李昂;梁佛金;梁留涛;梁鹏鹏;梁小坤;李翱;李斌;李冰;李博;李博康;李超群;李成俊;李成亮;李德高;李钿田;黎迪斯;李栋堂;李东洋;李凡;李国宝;李国辉;李浩;李华良;李辉;李会萌;李慧霞;李江超;李金波;李魁;李兰杰;李磊;李雷;李立翔;李末;林斌;林芳丽;林烽;林冠;凌子;林浩东;林江;林建山;林玲;林盟杰;林梦宁;林起翔;林天成;林晓菁;林晓宇;林鑫;李鹏飞;李舒昊(统计工);李思远;刘安森;刘安洋;刘保华;刘冰洋;刘博林;刘灿;刘超;刘朝敏;刘朝政;刘陈超;刘聪;刘登云;刘丁剑;刘东;刘恩赐;刘芳;刘冠达;刘贵珍;刘宏;刘华星;刘化扬;刘晖;刘江;刘婧;刘浪;刘磊;刘丽;刘亮亮;柳力丽;刘林;刘力源;刘洛兵;柳满义;刘孟真;刘楠;刘鹏;刘朋双;刘巧雪;刘起佳;刘钦涛;刘秋红;刘瑞灵;刘瑞志;刘润斌;刘涛;刘婉莹;刘伟;刘文杰;刘祥龙;刘贤俊;刘先钊;刘晓耘;刘欣婷;刘秀连;刘秀秀;刘妍;刘燕;刘阳生;柳毅;刘毅;刘一慧;刘意荣;刘伊婷;刘永峰;刘岳;刘忠凯;刘梓城;李卫东;李伟煜;李雯;李文睿;李相慧;李先钊;李晓博;李学刚;李艳林;李岩松(卖菜小弟);李艳霞;李叶;李易;李应硕;李园园;李云勇;李雨薇;李战胜;李政磊;李祖超;龙坤;龙秋吉;龙章潮;娄焕莉;栾冰轮;卢潮;陆成风;逯海水;罗宬;罗嘉昊;罗金燕;罗荣超;罗时迁;罗珍;雒臻炜;陆小玲;卢小鹏;陆徐枫;卢玉;吕东;吕顺朝;吕维林;马聃;马汉;马浩成;马吉辉;马锦镛;马梦媛;茅丹丹;马武瑞;马燕钦;马义;马义然;马赟蕾;孟凡诤;孟腾腾;闵雪山;米威;米志华;牟良;莫文;聂钰芪;聂震;宁夏(Fisher);宁自强;牛倩倩;牛甜甜;牛岳;欧阳志;庞清平;潘秋烜;潘望实;潘毅丰;潘志伟;裴苗苗;彭爱军;彭昶(彭茂密);彭晶;彭容;彭诗媛;彭勇升;钱志中;乔殿尚;齐百超;秦成;卿撰;秦磊;邱洁;邱锐;邱文昊;曲宗阳;饶君;饶正锋;任凯;任宇峰;任宇磊;任玉楠;任子姣;荣钰豪;阮俊彦;阮莹;汝浩冬;茹祥;上宝丽;邵长昊;笙洪国;盛茂林;盛若男;沈刘;沈松;沈晓倩;佘荣平;佘志东;史保瑞;施俊(尼克叔叔);施银秋;帅志虎;舒汗盛;宋典津;宋俊良;宋琦;宋强;孙安健;孙超;孙德昂;孙飞;孙飞;孙华勇;孙记根;孙俊杰;孙雷;孙林玲;孙秋彤;孙容容;孙士淼;孙顺;孙婷婷;孙伟;孙晓宁;孙晓彤;苏小吉;苏逸凡;苏昭荣;谭斌;唐佳敏;唐刘;汤明杰;唐小龙;谭浩文;谭明庆;覃晓玲;谭子健;陶峰;陶广奉;陶健;陶俊峰;滕玉锋(咸蛋超人);田彬彬;田翠翠;田迪;田飞飞;田果;田闪闪;田伟琼;田远伟;铁伟;题华龙;Vincent(Vincent);汪斌;王兵;王碧野;汪畅畅;王超;汪成宝;王成立;王从举;王大朋;汪飞;王海地;王海龙;王颢;王辉;王辉;王佳峰;王家佳;王佳杰;王剑;王建华;王建明;王金灿;王静;王金刚;王骏;王乐;王磊;王雷;王亮;王令;王龙;王梦杰;王梦志;王明;王培;王启凡;王权;王瑞;王瑞玲;王森;王世杰;王帅;王帅利;王涛;王亭;汪伟;王伟;王伟龙;王微微;王文斌;王文博;王文学;王晓东;王小明;汪新月;王妍;王琰;王耀辉;王亚琪;王亚伟;王宇;王元存;王月明;王长春;王召;王昭;王震;王子超;万坚;万小大;魏承锦;韦德智;魏东东;位冬冬;魏海林;魏林林;温江江;文凯;温增麟(Mark);吴大伟;吴迪;吴迪;吴海青;吴江淮;吴佳玮;吴炯;吴菊红;吴凌风;伍美玲;吴尚铮;吴炜;吴晓龙;吴幸;吴兴源;吴亚楠;吴洋洋;吴晔辉;吴有为;吴祖贤;夏杰;肖劲松;肖龙;肖少华;肖雄;夏渠红;夏宇;夏长琴;席东毅;谢恩鑫;谢航;谢恒达;谢虹文;谢向前;谢雪萍;席江涛;邢晖;邢金光;熊烨;熊中粒;修奇;轩留城;宣善波;许波;徐畅;徐国荣;徐皓;徐红春;许可;徐奎涛;徐亮;徐林山;徐蒙;徐培庆;徐婷婷;许伟;徐文刚;徐祥锋;徐玄;徐旭峰;徐颖;徐正江;徐宙;严安;杨超凡;杨冲;杨川;杨传涛;杨帆;杨国利;杨国伟;杨海淘;杨浩冉;杨宏伟;杨建;杨捷;杨晋;杨晶;杨礼;杨猛;杨任远;杨硕;杨涛;杨腾飞;杨小春;杨小军;杨小委;杨玉琴;杨召雷;杨子琨;严浩;严恒;颜军伟;严贤良;晏雪;严志波;叶荣杰;易大成;尹东杰;游俊杰;游振鑫;尤志明;袁秀涛;袁旭;袁正友;余聪;俞迪;岳胜男;岳文谦;岳晓;余航;俞辉;喻康帅;余莉莉;余雅芳;翟陈阳;翟爽爽;张佰发;张斌;张驰;张楚荻;章单锋;张德惠;张灯皖;张栋安;张恩利;张伏平;张海;张含含;张洪祯;张怀智;张焕蒙;张晖;张汇程;张虎仪;张将凤;张建鹏;张建珍;张金钰;张君卓;张康峰;张来聪;张磊;张雷;张乐天;张莉;张灵;张灵昊;张利源;张理远;张马超;张敏;张明;张宁宁;张培;章佩;张平;张清波;张琼;张瑞敏;张上亮;张胜荣;张盛文;张数云;张松;张涛;张天芝;詹国松;张婉琪;张伟;张维;张伟;张伟航;张文悦;张翔;张晓林;张小燕;张夕楠;张信德;张心妍;张昕宇;张秀;张旭川;章洋;张亚萍;张毅;张玉;张跃;张雨濛;张雨蓉;张振;张致远;张中原;赵百云;赵健;赵俊;赵君宇;赵利;赵刘磊;赵慕晗;赵琪;赵茹洁;赵士哲;赵帅;赵天龙;赵晓东;赵晓宇;赵岩;赵亚男;赵泽霖;赵志飞;郑钢;郑华杰;郑继明;郑金光;郑凯;郑立臣;郑璐瑶;郑萌;郑敏霞;郑晓丹;郑姚炀;郑有佳;郑玉俊;郑章辉;钟依倩;周彬;周兵兵;周超;周成晓;周闯;周迪;周鼎;周佳鹏;周俊;周军业;周亮;周龙;周伦贵;周绍景;周书丽;周显;周亚龙;周艳;周洋阳;周严涛;周业普;周珍敏;周志露;朱阿进;庄岩;朱博文;朱达生;朱铎弢;诸葛朝寅;朱家民;朱金娟;祝尚志;朱帅;朱宇航;宗海;邹兵;邹建锋;邹雷;邹晓杰";
        String newUser = "裴赛赛;白丰凯;白京陇;白小龙;白雅航;柏祝林;蔡欣;曹翰辰;曹技;曹强;曹世明;曹亚云;曾波波;曾晨光;曾科燕;曾强;曾泽霖;曾曌翾;查浩;常超杰;昌呈呈;常亚彬;陈诚;陈成杰;陈辰光;陈春雪;陈峰飞;陈淦;程博宇;程嘉伟;程民醒;程鹏;程帅;陈广建;陈广良;程英;成苑;陈浩;陈洪;陈欢;陈焕文;陈辉;陈佳恒;陈杰夫;陈杰金;陈静;陈锦泳;陈军军;陈开锋;陈力;陈丽娟;陈龙;陈明;陈奇;陈容军;陈瑞;陈善保;陈守乐;陈思弹;陈太明;陈涛;陈卫;陈晓斌;陈小芳;陈晓勇;陈雅雯;陈颖;陈勇;陈云清;陈玉香;陈振宇;陈志远;初健夫;楚楠楠;崔艺艺;崔玉焕;戴杰;戴群特;代勇;单付尚;David;邓斌;邓波;邓海波;邓明慧;邓毓强;刁明见;狄光敏;丁海明;丁慧君;丁凯;丁庆丰;丁仁周;丁姗姗;丁银辉;丁志豪;董骏飞;董乐才;董千慧;董洵;董自辉;窦一豪;段以元;杜宏量;杜康;杜琼;杜升阳;杜忠泽(首页客服);Ezio;樊川;方承维;范国徽;房延鹏;房宇亮;樊金;樊凯;樊龙夫;范珮;范培华;范升旭;范志强;费建垒;冯昌义;冯候琴;冯欢欢;冯灵通;冯立鹏;冯帅炬;冯艺灵;符洪斌;付龙飞;付提;傅增森;高冲;皋峰;高琳;高李琴;高朋朋;高松;龚兵光;龚俊峰;宫雯;宫永鹏;管彬(Bing);管海燕;关向景;桂方强;桂梦辉;顾佳雯;郭浩柱;郭继成;郭杰;郭濛;郭鹏;国爽(水逆请退散);郭万新;郭欣晟;郭章勇;郭振弘(门店小时工);郭振声;郭智捷;郭子煊;韩白静;韩丹妮;韩吉;韩江霖;韩鹏;韩肖肖;何君;贺凯;何雷;何丽芳;和龙;何南南;何艳;何忠;洪冬;洪振榕;侯晓芸;侯熠;侯义帅;侯志远;滑安东(up skr);华斌;怀虎;黄超;黄琛;黄锦妹;黄骏宇;黄林;黄玲;黄媚芳;黄鹏;黄蕊云;黄圣俊;黄书竞;黄涛;黄小琳;黄小雪;黄鑫;黄亚玲;黄营;黄玉飞;黄振;黄珠妹;桓少云;胡缓缓;胡璟璟;胡凯豪;胡路杰;霍国栋;胡清泉;胡文浩;胡勇;胡玥祺;胡志鹏;胡周丽;贾德民;姜博伦;姜驰;姜方元;江海艳(.);姜浩;江泓哲;姜捷萌;蒋焜;江林;姜伦;蒋攀攀;蒋天赐;江玉华;蒋振伟;江忠正;焦健;焦瑞(Jerry);贾志宇;解红辉;揭莲花;金蓓蓓;金柳余;靳平;纪志伟;季中原;瞿成锋;鞠洪涛;康国伟;康叔冬;亢治虎;柯友亮;况仁枭;赖必强;赖武法;雷鹏;雷钦军;雷正伟;李昂;梁佛金;梁留涛;梁鹏鹏;梁小坤;李翱;李斌;李冰;李博;李博康;李超群;李成俊;李成亮;李德高;李钿田;黎迪斯;李栋堂;李东洋;李凡;李国宝;李国辉;李浩;李华良;李辉;李会萌;李慧霞;李江超;李金波;李魁;李兰杰;李磊;李雷;李立翔;李末;林斌;林芳丽;林烽;林冠;凌子;林浩东;林江;林建山;林玲;林盟杰;林梦宁;林起翔;林天成;林晓菁;林晓宇;林鑫;李鹏飞;李舒昊(统计工);李思远;刘安森;刘安洋;刘保华;刘冰洋;刘博林;刘灿;刘超;刘朝敏;刘朝政;刘陈超;刘聪;刘登云;刘丁剑;刘东;刘恩赐;刘芳;刘冠达;刘贵珍;刘宏;刘华星;刘化扬;刘晖;刘江;刘婧;刘浪;刘磊;刘丽;刘亮亮;柳力丽;刘林;刘力源;刘洛兵;柳满义;刘孟真;刘楠;刘鹏;刘朋双;刘巧雪;刘起佳;刘钦涛;刘秋红;刘瑞灵;刘瑞志;刘润斌;刘涛;刘婉莹;刘伟;刘文杰;刘祥龙;刘贤俊;刘先钊;刘晓耘;刘欣婷;刘秀连;刘秀秀;刘妍;刘燕;刘阳生;柳毅;刘毅;刘一慧;刘意荣;刘伊婷;刘永峰;刘岳;刘忠凯;刘梓城;李卫东;李伟煜;李雯;李文睿;李相慧;李先钊;李晓博;李学刚;李艳林;李岩松(卖菜小弟);李艳霞;李叶;李易;李应硕;李园园;李云勇;李雨薇;李战胜;李政磊;李祖超;龙坤;龙秋吉;龙章潮;娄焕莉;栾冰轮;卢潮;陆成风;逯海水;罗宬;罗嘉昊;罗金燕;罗荣超;罗时迁;罗珍;雒臻炜;陆小玲;卢小鹏;陆徐枫;卢玉;吕东;吕顺朝;吕维林;马聃;马汉;马浩成;马吉辉;马锦镛;马梦媛;茅丹丹;马武瑞;马燕钦;马义;马义然;马赟蕾;孟凡诤;孟腾腾;闵雪山;米威;米志华;牟良;莫文;聂钰芪;聂震;宁夏(Fisher);宁自强;牛倩倩;牛甜甜;牛岳;欧阳志;庞清平;潘秋烜;潘望实;潘毅丰;潘志伟;裴苗苗;彭爱军;彭昶(彭茂密);彭晶;彭容;彭诗媛;彭勇升;钱志中;乔殿尚;齐百超;秦成;卿撰;秦磊;邱洁;邱锐;邱文昊;曲宗阳;饶君;饶正锋;任凯;任宇峰;任宇磊;任玉楠;任子姣;荣钰豪;阮俊彦;阮莹;汝浩冬;茹祥;上宝丽;邵长昊;笙洪国;盛茂林;盛若男;沈刘;沈松;沈晓倩;佘荣平;佘志东;史保瑞;施俊(尼克叔叔);施银秋;帅志虎;舒汗盛;宋典津;宋俊良;宋琦;宋强;孙安健;孙超;孙德昂;孙飞;孙飞;孙华勇;孙记根;孙俊杰;孙雷;孙林玲;孙秋彤;孙容容;孙士淼;孙顺;孙婷婷;孙伟;孙晓宁;孙晓彤;苏小吉;苏逸凡;苏昭荣;谭斌;唐佳敏;唐刘;汤明杰;唐小龙;谭浩文;谭明庆;覃晓玲;谭子健;陶峰;陶广奉;陶健;陶俊峰;滕玉锋(咸蛋超人);田彬彬;田翠翠;田迪;田飞飞;田果;田闪闪;田伟琼;田远伟;铁伟;题华龙;Vincent(Vincent);汪斌;王兵;王碧野;汪畅畅;王超;汪成宝;王成立;王从举;王大朋;汪飞;王海地;王海龙;王颢;王辉;王辉;王佳峰;王家佳;王佳杰;王剑;王建华;王建明;王金灿;王静;王金刚;王骏;王乐;王磊;王雷;王亮;王令;王龙;王梦杰;王梦志;王明;王培;王启凡;王权;王瑞;王瑞玲;王森;王世杰;王帅;王帅利;王涛;王亭;汪伟;王伟;王伟龙;王微微;王文斌;王文博;王文学;王晓东;王小明;汪新月;王妍;王琰;王耀辉;王亚琪;王亚伟;王宇;王元存;王月明;王长春;王召;王昭;王震;王子超;万坚;万小大;魏承锦;韦德智;魏东东;位冬冬;魏海林;魏林林;温江江;文凯;温增麟(Mark);吴大伟;吴迪;吴迪;吴海青;吴江淮;吴佳玮;吴炯;吴菊红;吴凌风;伍美玲;吴尚铮;吴炜;吴晓龙;吴幸;吴兴源;吴亚楠;吴洋洋;吴晔辉;吴有为;吴祖贤;夏杰;肖劲松;肖龙;肖少华;肖雄;夏渠红;夏宇;夏长琴;席东毅;谢恩鑫;谢航;谢恒达;谢虹文;谢向前;谢雪萍;席江涛;邢晖;邢金光;熊烨;熊中粒;修奇;轩留城;宣善波;许波;徐畅;徐国荣;徐皓;徐红春;许可;徐奎涛;徐亮;徐林山;徐蒙;徐培庆;徐婷婷;许伟;徐文刚;徐祥锋;徐玄;徐旭峰;徐颖;徐正江;徐宙;严安;杨超凡;杨冲;杨川;杨传涛;杨帆;杨国利;杨国伟;杨海淘;杨浩冉;杨宏伟;杨建;杨捷;杨晋;杨晶;杨礼;杨猛;杨任远;杨硕;杨涛;杨腾飞;杨小春;杨小军;杨小委;杨玉琴;杨召雷;杨子琨;严浩;严恒;颜军伟;严贤良;晏雪;严志波;叶荣杰;易大成;尹东杰;游俊杰;游振鑫;尤志明;袁秀涛;袁旭;袁正友;余聪;俞迪;岳胜男;岳文谦;岳晓;余航;俞辉;喻康帅;余莉莉;余雅芳;翟陈阳;翟爽爽;张佰发;张斌;张驰;张楚荻;章单锋;张德惠;张灯皖;张栋安;张恩利;张伏平;张海;张含含;张洪祯;张怀智;张焕蒙;张晖;张汇程;张虎仪;张将凤;张建鹏;张建珍;张金钰;张君卓;张康峰;张来聪;张磊;张雷;张乐天;张莉;张灵;张灵昊;张利源;张理远;张马超;张敏;张明;张宁宁;张培;章佩;张平;张清波;张琼;张瑞敏;张上亮;张胜荣;张盛文;张数云;张松;张涛;张天芝;詹国松;张婉琪;张伟;张维;张伟;张伟航;张文悦;张翔;张晓林;张小燕;张夕楠;张信德;张心妍;张昕宇;张秀;张旭川;章洋;张亚萍;张毅;张玉;张跃;张雨濛;张雨蓉;张振;张致远;张中原;赵百云;赵健;赵俊;赵君宇;赵利;赵刘磊;赵慕晗;赵琪;赵茹洁;赵士哲;赵帅;赵天龙;赵晓东;赵晓宇;赵岩;赵亚男;赵泽霖;赵志飞;郑钢;郑华杰;郑继明;郑金光;郑凯;郑立臣;郑璐瑶;郑萌;郑敏霞;郑晓丹;郑姚炀;郑有佳;郑玉俊;郑章辉;钟依倩;周彬;周兵兵;周超;周成晓;周闯;周迪;周鼎;周佳鹏;周俊;周军业;周亮;周龙;周伦贵;周绍景;周书丽;周显;周亚龙;周艳;周洋阳;周严涛;周业普;周珍敏;周志露;朱阿进;庄岩;朱博文;朱达生;朱铎弢;诸葛朝寅;朱家民;朱金娟;祝尚志;朱帅;朱宇航;宗海;邹兵;邹建锋;邹雷;" +
                "邹晓杰";
        List<String> history = Arrays.asList(historyUser.split(";"));
        List<String> news = Arrays.asList(newUser.split(";"));
        StringBuffer buffer = new StringBuffer();
        for (String s : history) {
            if (!newUser.contains(s)) {
                buffer.append(s + ";");
            }
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        if (null == buffer || buffer.length() == 0) {
            System.out.println(sdf.format(new Date()) + ": 无毕业学员---");
        } else {
            System.out.println(sdf.format(new Date()) + ": 毕业学员：（" + buffer.toString() + "）");
        }

        // 2022-09-20: 毕业学员：（池至靖;丁敏;杜琼(正能量);杜忠泽(营销客服);耿晓菊;沙凯健;施科强;吴晖;杨丽;周显(漱石);）

    }
}
