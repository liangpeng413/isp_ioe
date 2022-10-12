package com.ruixi.ioe.service.impl;

import com.alibaba.fastjson.JSON;
import com.ruixi.ioe.core.ReturnCode;
import com.ruixi.ioe.dao.CategorySelected;
import com.ruixi.ioe.dao.CookbookTools;
import com.ruixi.ioe.dao.page.PageResult;
import com.ruixi.ioe.enums.CookbookTypeEnum;
import com.ruixi.ioe.mapper.CategorySelectedMapper;
import com.ruixi.ioe.service.CategorySelectedService;
import com.ruixi.ioe.utils.HttpClientUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**


 *@className CategorySelectedServiceImpl
 *@description  TODO
 *@author liang
 *@date 2022/10/12 3:37 下午
 */
@Slf4j
@Service
public class CategorySelectedServiceImpl implements CategorySelectedService {
    @Autowired
    private CategorySelectedMapper categorySelectedMapper;

    @Override
    public Map<String, Object> getList(CategorySelected param) {
        Map<String, Object> ret = new HashMap<>(3);
        param.setStartPage((param.getPageNo()-1)*param.getPageSize());
        List<CookbookTools> list = categorySelectedMapper.selectByQueryPage(param);
        int totalRowSize = categorySelectedMapper.selectByQueryCount(param);
        ret.put("code", ReturnCode.SUCCESS);
        ret.put("message", ReturnCode.getReturnMsg(ReturnCode.SUCCESS));
        ret.put("pageResult", new PageResult(param.getPageNo(), totalRowSize, param.getPageSize(), list));
        return  ret;
    }

    @Override
    public void createSelected(CategorySelected param) {
        //调用算法接口
        try {
            HashMap<String, Object> req = new HashMap<>();
            req.put("goodsId",param.getSku());
            req.put("cityId",null);
            req.put("debug",false);
            req.put("deviceId","5AA5E092-BEBD-4D36-9578-C089AD9B71C4");
            req.put("memberId",param.getMemberId());
            req.put("memberType","10");
            req.put("mock",null);
            req.put("property",new Object());
            req.put("requestId","5AA5E092-BEBD-4D36-9578-C089AD9B71C4-1-S-20220805150116942");
            req.put("saleChannelId","4");
            req.put("sellerId",param.getSellerid());
            req.put("shopId",param.getShopid());
            req.put("version","8.8.0.26");
            req.put("scenesCode","purchase_together_rec_filter_v5");
            HashMap<String, Object> map = new HashMap<>();
            map.put("request",req);
            map.put("auto",true);
            map.put("buildFilter",true);
            String url = "http://cp-sf-sit.recommend-ranking.sitgw.yonghui.cn/admin/utils/setScenesRedisValues";
            log.info("请求算法创建分类页绑定关系,req:{}",JSON.toJSONString(map));
            String res = HttpClientUtils.sendPostByJson(url, JSON.toJSONString(map));
            log.info("请求算法创建用户+sku+cookbookID关系,res:{}",res);
            if("true".equals(res)){
                log.info("操作成功");
            }
        } catch (Exception e) {
            e.printStackTrace();
            log.error("创建分类页绑定关系失败",e);
        }
        param.setCreateTime(new Date());
        categorySelectedMapper.insertSelective(param);
    }
}
