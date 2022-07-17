package com.ruixi.ioe.controller.scripts;

import com.ruixi.ioe.core.ReturnCode;
import com.ruixi.ioe.dao.ScriptQuery;
import com.ruixi.ioe.dao.ScriptTable;
import com.ruixi.ioe.response.ResponseJson;
import com.ruixi.ioe.response.ResponseResult;
import com.ruixi.ioe.service.ScriptService;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.binding.MapperMethod;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Map;

/**
 * @author liang
 * @className ScriptController
 * @description TODO
 * @date 2022/7/17 8:55 下午
 */
@Slf4j
@Controller
@RequestMapping("scripts")
public class ScriptController {
    @Autowired
    private ScriptService scriptService;

    @ResponseBody
    @RequestMapping("queryPage")
    public ResponseJson getList(@RequestBody ScriptQuery queryParam) {
        try {
            Map<String, Object> map = scriptService.getList(queryParam);
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
    @RequestMapping("add")
    public ResponseJson add (@RequestBody ScriptTable param){
        try {
            scriptService.add(param);
            return ResponseResult.getOkResponse(ReturnCode.SUCCESS);
        } catch (Exception e) {
            log.error("脚本创建失败", e);
            return ResponseResult.getErrorResponse(ReturnCode.ERROR, ReturnCode.getReturnMsg(ReturnCode.ERROR));
        }
    }

    @ResponseBody
    @GetMapping("check")
    public ResponseJson check (Integer id){
        try {
            scriptService.check(id);
            return ResponseResult.getOkResponse(ReturnCode.SUCCESS);
        } catch (Exception e) {
            log.error("操作失败", e);
            return ResponseResult.getErrorResponse(ReturnCode.ERROR, ReturnCode.getReturnMsg(ReturnCode.ERROR));
        }
    }
}
