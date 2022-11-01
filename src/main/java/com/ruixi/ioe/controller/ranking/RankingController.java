package com.ruixi.ioe.controller.ranking;

import com.ruixi.ioe.core.ReturnCode;
import com.ruixi.ioe.dao.RankingDetail;
import com.ruixi.ioe.dao.ScriptQuery;
import com.ruixi.ioe.response.ResponseJson;
import com.ruixi.ioe.response.ResponseResult;
import com.ruixi.ioe.service.RankingService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

/**
 * @author liang
 * @className RankingController
 * @description TODO
 * @date 2022/11/1 5:39 下午
 */
@Slf4j
@Controller
@RequestMapping("ranking")
public class RankingController {
    @Autowired
    private RankingService rankingService;

    @ResponseBody
    @RequestMapping("queryPage")
    public ResponseJson getList(@RequestBody RankingDetail queryParam) {
        try {
            Map<String, Object> map = rankingService.getList(queryParam);
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
    @RequestMapping("create")
    public ResponseJson create(@RequestBody RankingDetail param) {
        try {
            rankingService.add(param);
            return ResponseResult.getOkResponse(ReturnCode.SUCCESS);
        } catch (Exception e) {
            log.error("脚本创建失败", e);
            return ResponseResult.getErrorResponse(ReturnCode.ERROR, ReturnCode.getReturnMsg(ReturnCode.ERROR));
        }
    }



}
