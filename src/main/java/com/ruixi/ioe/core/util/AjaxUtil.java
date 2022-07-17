package com.ruixi.ioe.core.util;

import javax.servlet.http.HttpServletRequest;

/**
 * Created with IntelliJ IDEA.
 * Description:
 * User: zhangxiongbiao
 * Date: 2017-04-01
 * Time: 下午6:13
 */
public class AjaxUtil {
    public  static  boolean isAjax(HttpServletRequest request){
        return  (request.getHeader("X-Requested-With") != null  && "XMLHttpRequest".equals( request.getHeader("X-Requested-With").toString())   ) ;
    }
}
