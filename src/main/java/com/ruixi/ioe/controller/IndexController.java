package com.ruixi.ioe.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author liang
 * @className IndexController
 * @description TODO
 * @date 2022/7/16 1:25 下午
 */
@Controller
public class IndexController {
    /**
     * @DEST 跳转至首页
     * @return
     */
    @RequestMapping("login")
    public static String getSuccessUrl(){
        return "index";
    }

    /**
     * @deprecated 跳转至菜谱数据创建
     * @return
     */
    @RequestMapping(value="/cookbook/create")
    public String resTab(){
        return "/cookbook/create";
    }

    /**
     * @deprecated 跳转至菜谱数据创建
     * @return
     */
    @RequestMapping(value="/category/selected")
    public String resCategory(){
        return "/category/selected";
    }

    /**
     * @deprecated 跳转至菜谱数据创建
     * @return
     */
    @RequestMapping(value="/scripts/jiaobook")
    public String jiaoBook(){
        return "/scripts/jiaobook";
    }

    /**
     * @deprecated 跳转至榜单创建
     * @return
     */
    @RequestMapping(value="/ranking/updateRanking")
    public String updateRanking(){
        return "/ranking/updateRanking";
    }

    /**
     * @deprecated 模型市场检查
     * @return
     */
    @RequestMapping(value="/check/cmsCheck")
    public String cmsCheck(){
        return "/check/cms_check";
    }


}
