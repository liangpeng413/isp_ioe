package com.ruixi.ioe.controller.check;

import com.ruixi.ioe.core.ReturnCode;
import com.ruixi.ioe.dao.CDPModelQuery;
import com.ruixi.ioe.response.ResponseJson;
import com.ruixi.ioe.response.ResponseResult;
import com.ruixi.ioe.service.CheckCDPModelService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

/**
 * @author liang
 * @className CheckCMSRecommend
 * @description TODO
 * @date 2023/2/16 11:13 上午
 */
@Slf4j
@Controller
@RequestMapping("check")
public class CheckCMSRecommendController {
    @Autowired
    private CheckCDPModelService checkCDPModelService;

    /**
     * @desc 检查模型市场cms活动位推荐商品是否正常，返回无数据或者存在问题的topicId+modelCode
     * @param param
     * @return
     */
    @ResponseBody
    @RequestMapping("cdp")
    public ResponseJson checkCDPModel(@RequestBody CDPModelQuery param){
        try {
            Map<String, Object> map = checkCDPModelService.toCheck(param);
            if (ReturnCode.SUCCESS.equals(map.get("code"))) {
                return ResponseResult.getOkResponse(map.get("result"));
            } else {
                log.error("【CheckCMSRecommendController.checkCDPModel】 检查cdp模型异常，【异常：code={}，message={}】", (String) map.get("code"), (String) map.get("message"));
                return ResponseResult.getErrorResponse((String) map.get("code"), (String) map.get("message"));
            }
        } catch (Exception e) {
            log.error("检查cdp模型异常{}", e);
            return ResponseResult.getErrorResponse(ReturnCode.ERROR, ReturnCode.getReturnMsg(ReturnCode.ERROR));
        }
    }

}
