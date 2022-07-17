package com.ruixi.ioe.core.util;

import java.util.regex.Pattern;

/**
 * Created with IntelliJ IDEA.
 * Description:
 * User: zhangxiongbiao
 * Date: 2017-03-27
 * Time: 下午2:22
 */
public class MobileUtil {
    private static String mobile_regex = "^1[0-9]{10}$";

    public static boolean isMobile(String string){
        return Pattern.matches(mobile_regex, string);
    }

    public static void main(String[] args) {
        System.out.println(isMobile("12301557534"));
    }
}
