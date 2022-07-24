package com.ruixi.ioe.controller.tools;

import com.ruixi.ioe.core.ReturnCode;
import com.ruixi.ioe.dao.CookbookToolsQuery;
import com.ruixi.ioe.dto.CreateCookbookParamDTO;
import com.ruixi.ioe.response.ResponseJson;
import com.ruixi.ioe.response.ResponseResult;
import com.ruixi.ioe.service.CookbookService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

/**
 * @author liang
 * @className CookbookToolsController
 * @description TODO
 * @date 2022/7/24 8:25 下午
 */
@Slf4j
@Controller
@RequestMapping("cookbook")
public class CookbookToolsController {

    @Autowired
    private CookbookService cookbookService;

    @ResponseBody
    @RequestMapping("getList")
    public ResponseJson getList(@RequestBody CookbookToolsQuery param){
        try {
            Map<String, Object> map = cookbookService.getList(param);
            if (ReturnCode.SUCCESS.equals(map.get("code"))) {
                return ResponseResult.getOkResponse(map.get("pageResult"));
            } else {
                log.error("【ScriptController.getList】 查询列表，【异常：code={}，message={}】", (String) map.get("code"), (String) map.get("message"));
                return ResponseResult.getErrorResponse((String) map.get("code"), (String) map.get("message"));
            }
        } catch (Exception e) {
            log.error("分页查询报错{}", e);
            return ResponseResult.getErrorResponse(ReturnCode.ERROR, ReturnCode.getReturnMsg(ReturnCode.ERROR));
        }
    }

    @ResponseBody
    @RequestMapping("createCookbook")
    public ResponseJson createCookbookTools(@RequestBody CreateCookbookParamDTO param){
        try {
            cookbookService.createCookbookTools(param);
            return ResponseResult.getOkResponse(ReturnCode.SUCCESS);
        } catch (Exception e) {
            log.error("创建菜谱失败", e);
            return ResponseResult.getErrorResponse(ReturnCode.ERROR, ReturnCode.getReturnMsg(ReturnCode.ERROR));
        }
    }
}
