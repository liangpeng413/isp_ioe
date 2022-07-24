package com.ruixi.ioe.service.impl;

import com.ruixi.ioe.core.ReturnCode;
import com.ruixi.ioe.dao.CookbookTools;
import com.ruixi.ioe.dao.CookbookToolsQuery;
import com.ruixi.ioe.dao.page.PageResult;
import com.ruixi.ioe.dto.CreateCookbookParamDTO;
import com.ruixi.ioe.enums.CookbookTypeEnum;
import com.ruixi.ioe.mapper.CookbookToolsMapper;
import com.ruixi.ioe.service.CookbookService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author liang
 * @className CookbookServiceImpl
 * @description TODO
 * @date 2022/7/24 8:36 下午
 */
@Slf4j
@Service
public class CookbookServiceImpl implements CookbookService {
    @Autowired
    private CookbookToolsMapper cookbookToolsMapper;

    @Override
    public Map<String, Object> getList(CookbookToolsQuery param) {
        Map<String, Object> ret = new HashMap<>(3);
        param.setStartPage((param.getPageNo()-1)*param.getPageSize());
        List<CookbookTools> list = cookbookToolsMapper.selectByQueryPage(param);
        int totalRowSize = cookbookToolsMapper.selectByQueryCount(param);
        ret.put("code", ReturnCode.SUCCESS);
        ret.put("message", ReturnCode.getReturnMsg(ReturnCode.SUCCESS));
        ret.put("pageResult", new PageResult(param.getPageNo(), totalRowSize, param.getPageSize(), list));
        return  ret;
    }

    @Override
    public void createCookbookTools(CreateCookbookParamDTO param) {
        try {
            CookbookTools tools = new CookbookTools();
            //用户关联菜谱
            if(CookbookTypeEnum.MEMBERID_AND_COOKBOOKID.getRespCode().equals(param.getAssociationType())){
                tools.setMemberId(param.getMemberId());
                StringBuffer buffer = new StringBuffer();
                //拼装关联菜谱字段数据
                tools.setCookbookId(buffer.toString());
                //调用算法接口
            }else{
                tools.setCookbookId("");
            }
            tools.setAssociationType(param.getAssociationType());
            tools.setCreateUserName(param.getCreateUserName());
            tools.setSkuCode(param.getSkuCode());
            tools.setCreateTime(new Date());
            cookbookToolsMapper.insertSelective(tools);
        } catch (Exception e) {
            log.error("创建菜谱工具失败",e);
        }
    }
}
