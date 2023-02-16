package com.ruixi.ioe.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.ruixi.ioe.core.ReturnCode;
import com.ruixi.ioe.dao.CDPModel;
import com.ruixi.ioe.dao.CDPModelQuery;
import com.ruixi.ioe.dao.CookbookTools;
import com.ruixi.ioe.dao.page.PageResult;
import com.ruixi.ioe.dto.ReqMarketRecommendDTO;
import com.ruixi.ioe.dto.ResModelDTO;
import com.ruixi.ioe.service.CheckCDPModelService;
import com.ruixi.ioe.utils.HttpClientUtils;
import com.ruixi.ioe.utils.RestTemplateUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author liang
 * @className CheckCDPModelServiceImpl
 * @description TODO
 * @date 2023/2/16 11:27 上午
 */
@Slf4j
@Service
public class CheckCDPModelServiceImpl implements CheckCDPModelService {

    @Override
    public Map<String, Object> toCheck(CDPModelQuery param) throws Exception {
        String url = "http://internet-prod.web-search.gw.yonghui.cn/actuator/dubbo/api";
//        String url = "http://internet-sit.web-search.sitgw.yonghui.cn/actuator/dubbo/api";
        HashMap<String, Object> reqMap = new HashMap<>();
        reqMap.put("secret","1234567890");
        reqMap.put("className","com.yonghui.web.search.api.SkuCodeRecommendFacadeService");
        reqMap.put("method","marketModelList");
        ArrayList<Object> list = new ArrayList<>();
        Object object = new Object();
        list.add(object);
        reqMap.put("params",list);
        String res = HttpClientUtils.sendPostByJson(url, JSON.toJSONString(reqMap));
        ResModelDTO resModelDTO = JSONObject.parseObject(res, ResModelDTO.class);
        ArrayList<CDPModel> errorModels = new ArrayList<>();
        if (resModelDTO.getSuccess()){
            for (CDPModel datum : resModelDTO.getData()) {
                HashMap<String, Object> getCDPMap = new HashMap<>();
                getCDPMap.put("secret","1234567890");
                getCDPMap.put("className","com.yonghui.web.search.api.SkuCodeRecommendFacadeService");
                getCDPMap.put("method","marketRecommend");
                ArrayList<ReqMarketRecommendDTO> reqMarketRecommends = new ArrayList<>();
                ReqMarketRecommendDTO reqParam = new ReqMarketRecommendDTO();
                reqParam.setShopId(param.getShopId());
                reqParam.setSellerId(param.getSellerId());
                reqParam.setCityId(param.getCityId());
                reqParam.setMemberId(param.getMemberId());
                reqParam.setSceneSrc("modelMarket");
                reqParam.setTopicName(datum.getTopicId());
                reqParam.setSaleChannelId(2);
                reqParam.setVersion(param.getVersion());
                reqParam.setPage(1);
                reqParam.setPageSize(30);
                reqParam.setDeviceId("5047794d-3420-4948-a9f2-2ffbe0733495");
                reqParam.setTraceId("");
                reqParam.setSceneId(8);
                reqParam.setModelCode(datum.getModelCode());
                reqMarketRecommends.add(reqParam);
                getCDPMap.put("params",reqMarketRecommends);
                log.info("调用,topicName:" + datum.getTopicName() +",modelCode:"+datum.getModelCode()+"入参："+JSON.toJSONString(getCDPMap));
                String marketRes = HttpClientUtils.sendPostByJson(url, JSON.toJSONString(getCDPMap));
                log.info("调用,topicName:" + datum.getTopicName() +",modelCode:"+datum.getModelCode()+"返回："+marketRes);
                CDPModel cdpModel = new CDPModel();
                if(marketRes == null || marketRes.isEmpty()){
                    cdpModel.setTopicId(datum.getTopicId());
                    cdpModel.setTopicName(datum.getTopicName());
                    cdpModel.setModelCode(datum.getModelCode());
                    errorModels.add(cdpModel);
                }else{
                    JSONObject jsonObject = JSONObject.parseObject(marketRes);
                    if(jsonObject.getBoolean("success")){
                        JSONObject data = jsonObject.getJSONObject("data");
                        if(data != null){
                            JSONArray jsonArray = data.getJSONArray("skuList");
                            if(null == jsonArray){
                                cdpModel.setTopicId(datum.getTopicId());
                                cdpModel.setTopicName(datum.getTopicName());
                                cdpModel.setModelCode(datum.getModelCode());
                                errorModels.add(cdpModel);                            }
                        }else{
                            cdpModel.setTopicId(datum.getTopicId());
                            cdpModel.setTopicName(datum.getTopicName());
                            cdpModel.setModelCode(datum.getModelCode());
                            errorModels.add(cdpModel);
                        }
                    }else{
                        cdpModel.setTopicId(datum.getTopicId());
                        cdpModel.setTopicName(datum.getTopicName());
                        cdpModel.setModelCode(datum.getModelCode());
                        errorModels.add(cdpModel);                    }
                }
            }
        }
        log.info("未查到推荐数据的模型有："+JSONObject.toJSONString(errorModels));
        Map<String, Object> ret = new HashMap<>(3);
        ret.put("code", ReturnCode.SUCCESS);
        ret.put("message", ReturnCode.getReturnMsg(ReturnCode.SUCCESS));
        ret.put("result", JSONObject.toJSONString(errorModels));
        return  ret;
    }
}
