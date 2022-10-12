package com.ruixi.ioe.controller.category;

import com.ruixi.ioe.core.ReturnCode;
import com.ruixi.ioe.dao.CategorySelected;
import com.ruixi.ioe.dao.CookbookToolsQuery;
import com.ruixi.ioe.dto.CreateCookbookParamDTO;
import com.ruixi.ioe.response.ResponseJson;
import com.ruixi.ioe.response.ResponseResult;
import com.ruixi.ioe.service.CategorySelectedService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

/**
 * @author liang
 * @className CategorySelectContorller
 * @description TODO
 * @date 2022/10/12 3:23 下午
 */
@Slf4j
@Controller
@RequestMapping("categorySelected")
public class CategorySelectController {

    @Autowired
    private CategorySelectedService categorySelectedService;

    @ResponseBody
    @RequestMapping("getList")
    public ResponseJson getList(@RequestBody CategorySelected param){
        try {
            Map<String, Object> map = categorySelectedService.getList(param);
            if (ReturnCode.SUCCESS.equals(map.get("code"))) {
                return ResponseResult.getOkResponse(map.get("pageResult"));
            } else {
                log.error("【CategorySelectController.getList】 查询列表，【异常：code={}，message={}】", (String) map.get("code"), (String) map.get("message"));
                return ResponseResult.getErrorResponse((String) map.get("code"), (String) map.get("message"));
            }
        } catch (Exception e) {
            log.error("分页查询报错{}", e);
            return ResponseResult.getErrorResponse(ReturnCode.ERROR, ReturnCode.getReturnMsg(ReturnCode.ERROR));
        }
    }

    @ResponseBody
    @RequestMapping("createSelected")
    public ResponseJson createSelected(@RequestBody CategorySelected param){
        try {
            categorySelectedService.createSelected(param);
            return ResponseResult.getOkResponse(ReturnCode.SUCCESS);
        } catch (Exception e) {
            log.error("创建分类页数据关联失败", e);
            return ResponseResult.getErrorResponse(ReturnCode.ERROR, ReturnCode.getReturnMsg(ReturnCode.ERROR));
        }
    }



}
