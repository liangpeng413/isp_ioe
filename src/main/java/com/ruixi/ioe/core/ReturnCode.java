package com.ruixi.ioe.core;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * @author  zhangxiongbiao
 * @date 16-12-20.
 */
public class ReturnCode {
    /**操作成功*/
    public static String SUCCESS = "000";
    /**服务器异常*/
    public static String ERROR = "001";
    /**校验异常*/
    public static String VAILDERROR = "002";
    /**请求参数不全,或者不完整*/
    public static String REQUEST_PARAM_ERROR="002";
    /**数据库操作失败*/
    public static String DB_OPERATION_FAILURE = "003";
    /**非法操作*/
    public static String FORBIDDEN_OPERATION = "004";
    /**参数为空**/
    public static String REQUEST_PARAM_NONE="998";
    /**参数部分为空**/
    public static String REQUEST_PARAM_NOTNONE="997";
    /**参数接口验证不通过**/
    public static String REQUEST_PARAM_FAIL="999";

    /**已有活动安排*/
    public static String HAVA_ERROR = "005";

    /**同步失败*/
    public static String TOAPP_ERROR = "006";

    /**数据不存在*/
    public static String NOT_MEMBER = "007";
    /**已有同一时段的相同场景banner*/
    public static String YET_SCENE_ERROR = "008";
    /**已有全部场景资源位生效中*/
    public static String YET_ALL_SCENE_ERROR = "009";

    /** 文件上传失败  */
    public static String FILE_UPLOAD_FAILURE = "100";
    /** 文件上传远端异常 */
    public static String FILE_UPLOAD_REMOTE_ERROR = "101";

    /** 接口返回不成功*/
    public static String INTERFACE_NOT_SUCCESS="102";

    public static String INTERFACE_ERROR="103";

    public static String DATA_NOT_EXIS="104";

    public static String DATA_MORE="105";

    public static String DATA_MATCH_EXIS="106";
    /** 数据状态有误 */
    public static String DATA_STATUS_ERROR = "107";

    public static String STATUSCODE="200";// 状态码

    public static String NO_PRODUCT="201";// 查无此产品

    public static String BASE_BIGGER_EXP="202";// 基础利率大于2分之一的扩展利率

    public static String FIX_FUSHU="203";// 扩展回报率不能位负数

    public static String FIX_ERROR="204";// 修改失败

    public static String TABLE_ERROR="205";

    public static String BATCH_NUMBER_REPEAT="206";//重复批次

   // public static String CASH_TEMPLATE_ERROR="207";//现金模板使用错误

   // public static String GENERAL_TEMPLATE_ERROR="208";//普通模板使用错误

    public static String  TEMPLATE_ERROR="209";//模板错误，

    public static String  CASH_COUPON_ERROR="210";
    //存在回调中特权加息名单
    public static String  EXISTS_CALLBACK_ERROR="301";
    //上传的特权加息名单应少于10000条
    public static String  OVER_COUNT_ERROR="302";
    //去重后记录数为0
    public static String  ZERO_COUNT_ERROR="601";

    public static String HAVA_PRODUCT_ERROR = "211";
    //上传用户名单超过最大值
    public static String UPLOAD_USERLIST_MORETHANMAX_ERROR = "099";
    //上传用户名单数量为0
    public static String UPLOAD_USERLIST_NULL_ERROR = "098";

    public static String SOURCE_TIME_DOUBLICATION = "110";

    public static String PUSH_FALIED = "111";
    //创建外呼任务失败
    public static String CREATE_CALL_TASK_FALIED = "1000";


    public static Integer SERVICE_CODE_ZERO=0;

    public static Integer SERVICE_CODE_ONE=1;

    public static Integer SERVICE_CODE_TWO=2;

    public static String NO_DEL = "1001";
    public static String NO_UPDATE = "1002";

    public static String TASK_NAME_EXIST="1003";

    public static  String PULL_LCPRODUCT_ISNULL="1111";
    public static  String SYS_LOG_ERROR="1112";




    public static String PLEASE_SELECT_MEMBER_NAME="1004";

    public static String QB_CONTENT_314="314";
    public static String COUPON_TIME_CHECK_NOT_PASS="1005";
    public static String POINT_TIME_CHECK_NOT_PASS="1006";
    public static String COUPON_COUNT_CHECK_NOT_PASS="1007";

    /**
     * 名单正在上传中请勿重复上传
     */
    public static String NO_REPEAT_IMPORT="222";

    /**
     * 当日数据已存在不可重复上传
     */
    public static String DISTINCT_DATA="903";


    //事件类型已存在
    public static String CALENDAR_TYPE_EXIST="900";
    //事件类型已存在无法生效
    public static String CALENDAR_TYPE_EXIST_NO_EFFET="901";

    public static String PUSH_ERROR="902";

    public static String getReturnMsg(String code){
        return codeMap.get(code);
    }

    public static Map<String, String> codeMap = new HashMap<String, String>();
    public static ArrayList<String> ignoreUrls = new ArrayList<String>();

    public static void initErrorMap() {
    		codeMap.put(STATUSCODE, "请求成功");
    		codeMap.put(CREATE_CALL_TASK_FALIED, "创建外呼任务失败");
        codeMap.put(SUCCESS, "操作成功");
        codeMap.put(ERROR, "操作失败 ");
        codeMap.put(REQUEST_PARAM_ERROR, "请求参数异常");
        codeMap.put(DB_OPERATION_FAILURE, "数据库操作失败");
        codeMap.put(FORBIDDEN_OPERATION, "非法操作,禁止操作");
        codeMap.put(FILE_UPLOAD_FAILURE, "文件上传失败");
        codeMap.put(FILE_UPLOAD_REMOTE_ERROR, "文件上传远端异常");
        codeMap.put(HAVA_ERROR, "已有活动安排");
        codeMap.put(TOAPP_ERROR, "同步APP数据失败,请找攻城狮协同解决");
        codeMap.put(INTERFACE_NOT_SUCCESS, "接口返回不成功");
        codeMap.put(INTERFACE_ERROR, "接口服务器异常");
        codeMap.put(DATA_NOT_EXIS, "数据不存在");
        codeMap.put(DATA_MATCH_EXIS,"产品code不存在");
        codeMap.put(DATA_STATUS_ERROR,"数据状态有误");
        codeMap.put(DATA_MORE, "包含多条数据");
        codeMap.put(NOT_MEMBER,"数据不存在");
        codeMap.put(TABLE_ERROR,"上传表格与正确格式不符");
        codeMap.put(REQUEST_PARAM_NONE, "参数为空");
        codeMap.put(REQUEST_PARAM_NOTNONE, "参数部分为空");
        codeMap.put(REQUEST_PARAM_FAIL, "参数接口验证不通过");
        codeMap.put(NO_PRODUCT,"查无此产品");
        codeMap.put(FIX_FUSHU,"扩展回报率不能位负数");
        codeMap.put(BASE_BIGGER_EXP,"扩展利率大于一半基础利率");
        codeMap.put(FIX_ERROR,"向悟空推送数据失败");
        codeMap.put(BATCH_NUMBER_REPEAT,"重复批次");
       // codeMap.put(CASH_TEMPLATE_ERROR, "模板错误，请使用现金券模板");
        //codeMap.put(GENERAL_TEMPLATE_ERROR, "模板错误，请使用普通券模板");
        codeMap.put(TEMPLATE_ERROR, "模板错误，请下载对应模板后重试！");
        codeMap.put(CASH_COUPON_ERROR, "请检查现金券ID是否存在");
        codeMap.put(EXISTS_CALLBACK_ERROR, "存在进行中的任务，请稍后再试！");
        codeMap.put(HAVA_PRODUCT_ERROR, "已存在该产品的助力加息记录");
        codeMap.put(ZERO_COUNT_ERROR, "去重后记录数为0");
        codeMap.put(YET_SCENE_ERROR, "已存在同一时段相同场景配置");
        codeMap.put(YET_ALL_SCENE_ERROR, "已有全部场景资源位生效中");
        codeMap.put(UPLOAD_USERLIST_MORETHANMAX_ERROR, "上传失败,上传用户名单超过最大数量限制，上限为");
        codeMap.put(UPLOAD_USERLIST_NULL_ERROR, "上传用户名单数量为0,上传失败");
        codeMap.put(SOURCE_TIME_DOUBLICATION, "已选择用户来源在当前时间范围已有配置，请重新选择!");
        codeMap.put(PUSH_FALIED, "审核推送失败，请检查！");
        codeMap.put(NO_DEL, "不可删除");
        codeMap.put(NO_UPDATE, "不可修改");
        codeMap.put(TASK_NAME_EXIST, "任务名已存在");
        codeMap.put(PULL_LCPRODUCT_ISNULL, "拉取产品中心数据为空");
        codeMap.put(PLEASE_SELECT_MEMBER_NAME, "请选择用户名单");
        codeMap.put(NO_REPEAT_IMPORT, "黑白名单正在导入中请勿重复导入数据");
        codeMap.put(QB_CONTENT_314, "已创建相同类型榜单");
        codeMap.put(SYS_LOG_ERROR, "系统日志请求记录失败");
        codeMap.put(COUPON_TIME_CHECK_NOT_PASS,"该配置的生效时间与卡券的投放时间不匹配，请检查后重试！");
        codeMap.put(COUPON_COUNT_CHECK_NOT_PASS,"卡券剩余数量不足，请检查后重试！");
        codeMap.put(POINT_TIME_CHECK_NOT_PASS,"该配置的生效时间与积分的投放时间不匹配，请检查后重试！");
        codeMap.put(CALENDAR_TYPE_EXIST, "該事件类型规则已存在，无法创建");
        codeMap.put(CALENDAR_TYPE_EXIST_NO_EFFET, "该事件类型规则已存在，无法生效");
        codeMap.put(DISTINCT_DATA, "当日数据已存在不可重复上传");

    }
    /**
     * 初始化应该被忽视的请求的url，<pre>忽视规则:<font color="red">当请求url包含忽视列表中某个字符串时，就判定为该忽视的url</font></pre>
     */
    public static void initIgnoreUrls(){
        ///所有不需要登陆的请求路劲都应该添加进来

        // 接口
        ignoreUrls.add("/inter/mp/");
        ignoreUrls.add("/smartIVR/vmStatusCallBack");
        ignoreUrls.add("/query/levelone");

    }
    /**
     * 判断请求URL是否忽略,<font color="red">忽视规则:当请求url包含忽视列表中某个字符串时，就判定为该忽视的url</font>
     * @return
     */
    public static boolean isIgnoreUrl(String url){
        if(null==ReturnCode.ignoreUrls || ReturnCode.ignoreUrls.size()==0){
            ///未设置忽视列表，所有地址都需要权限访问
            return false;
        }
        for(String str:ReturnCode.ignoreUrls){
            if(url.contains(str)){
                return true;
            }
        }
        return false;
    }
    static{
        initErrorMap();
        initIgnoreUrls();
    }
}
