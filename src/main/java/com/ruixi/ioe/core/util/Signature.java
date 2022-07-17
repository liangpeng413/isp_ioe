package com.ruixi.ioe.core.util;

import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

/**
 * User: rizenguo
 * Date: 2014/10/29
 * Time: 15:23
 */
@Slf4j
public class Signature {

    /**
     * 签名算法
     * @param map
     * @return
     */
    public static String getSign(Map<String,Object> map,String key){
        ArrayList<String> list = new ArrayList<String>();
        for(Map.Entry<String,Object> entry:map.entrySet()){
            if(!StringUtil.isEmpty(entry.getValue().toString())){
                list.add(entry.getKey() + "=" + entry.getValue() + "&");
            }
        }
        int size = list.size();
        String [] arrayToSort = list.toArray(new String[size]);
        Arrays.sort(arrayToSort, String.CASE_INSENSITIVE_ORDER);
        StringBuilder sb = new StringBuilder();
        for(int i = 0; i < size; i ++) {
            sb.append(arrayToSort[i]);
        }
        String result = sb.toString();
        result += "key=" + key;
        log.info("Sign Before MD5:" + result);
        result = MD5.MD5Encode(result).toUpperCase();
        log.info("Sign Result:" + result);
        return result;
    }

    public static void main(String[] args) {
        Map<String,Object> map = new HashMap<>();
        map.put("nonceStr","QmVWXCBaZyRMLcEBOYCVKBdiabRjvLrb");
        map.put("appId","vip_plus");
        map.put("mobile","18688855479");
        map.put("timestamp","1520999320220");
        map.put("couponIds","55");
        String key = "sKAoSyTRwYDOAijFJoHqnJCuiawZEKnFnOuaNMTMSLegBuvIzfnotiEdsWeGGANSNIEPRCpspGjpafFQqdVPMJdbpMrgbxQjTvjhtbjRwfGhMBGhDaJGcXavctAbvBLi";
        System.out.println(getSign(map,key));
    }

}
