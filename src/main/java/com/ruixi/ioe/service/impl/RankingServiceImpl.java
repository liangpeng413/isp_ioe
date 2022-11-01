package com.ruixi.ioe.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.ruixi.ioe.core.ReturnCode;
import com.ruixi.ioe.dao.RankingDetail;
import com.ruixi.ioe.dao.ScriptTable;
import com.ruixi.ioe.dao.page.BaseResult;
import com.ruixi.ioe.dao.page.PageResult;
import com.ruixi.ioe.mapper.RankingDetailMapper;
import com.ruixi.ioe.service.RankingService;
import com.ruixi.ioe.utils.HttpClientUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author liang
 * @className RankingServiceImpl
 * @description TODO
 * @date 2022/11/1 6:03 下午
 */
@Slf4j
@Service
public class RankingServiceImpl implements RankingService {
    @Autowired
    private RankingDetailMapper rankingDetailMapper;
    @Override
    public Map<String, Object> getList(RankingDetail param) {
        Map<String, Object> ret = new HashMap<>(3);
        param.setStartPage((param.getPageNo()-1)*param.getPageSize());
        List<RankingDetail> list = rankingDetailMapper.selectByList(param);
        int totalRowSize = rankingDetailMapper.countList(param);
        ret.put("code", ReturnCode.SUCCESS);
        ret.put("message", ReturnCode.getReturnMsg(ReturnCode.SUCCESS));
        ret.put("pageResult", new PageResult(param.getPageNo(), totalRowSize, param.getPageSize(), list));
        return  ret;
    }

    @Override
    public void add(RankingDetail param) {
        String url = "http://api-sit.yonghuivip.com/web/ranking/mock/refreshRank?shopId="+param.getShopId()+"&platform=ios";
        String res = HttpClientUtils.sendGetRequest(url,5);
        log.info(param.getShopId()+"榜单数据重建,res:{}",res);
        if(0 == JSONObject.parseObject(res, BaseResult.class).getCode()){
            log.info("操作成功");
            param.setCreateTime(new Date());
            rankingDetailMapper.insertSelective(param);
        }else{
            log.error("榜单重建失败,res={}",res);
        }
    }
}
