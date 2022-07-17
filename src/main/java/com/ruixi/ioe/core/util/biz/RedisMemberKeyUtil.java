package com.ruixi.ioe.core.util.biz;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by lipeijie on 2018/3/27.
 */
public class RedisMemberKeyUtil {
    /**
     * 黑白名单渠道MAP
     */
    public static Map<Integer,String> blackWhiteChannelMap;
    /**
     * 黑白名单类型MAP
     */
    public static Map<String,String> blackWhiteListTypeMap;

    /**
     * 用户黑名单关键字
     */
    public static final String BLACK_WHITE_LIST_BLACK = "black";
    /**
     * 用户白名单关键字
     */
    public static final String BLACK_WHITE_LIST_WHITE = "white";
    /**
     * 产品推荐白名单
     */
    public static final String WHITE_WHITE_LIST_RODUCTWHITE = "productWhite";

    static {
        blackWhiteChannelMap = new HashMap<>(2);
        blackWhiteChannelMap.put(1,"qb_member_");
        blackWhiteChannelMap.put(2,"wk_member_");
        blackWhiteChannelMap.put(0,"wk_member_");
        blackWhiteChannelMap.put(4,"hd_member_");

        blackWhiteListTypeMap = new HashMap<>(2);
        blackWhiteListTypeMap.put("1","black");
        blackWhiteListTypeMap.put("2","white");
        blackWhiteListTypeMap.put("4","white");
        // 产品推荐的黑名单
        blackWhiteListTypeMap.put("productWhite","productWhite");

    }
    /**
     * 根据黑白名单的渠道类型、用户ID获取redis服务器中 memberkey
     * @param blackWhiteChannel
     * @param memberId
     * @return
     */
    public static String getMemberKey(Integer blackWhiteChannel,Long memberId){
        return blackWhiteChannelMap.get(blackWhiteChannel)+memberId;
    }

    /**
     * 根据blackWhiteType获取redis字典表中值
     * @param blackWhiteType
     */
    public static String getListTypeKey(String blackWhiteType){
        return blackWhiteListTypeMap.get(blackWhiteType);
    }
}
