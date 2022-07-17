package com.ruixi.ioe.service.impl;

import com.ruixi.ioe.core.ReturnCode;
import com.ruixi.ioe.dao.ScriptQuery;
import com.ruixi.ioe.dao.ScriptTable;
import com.ruixi.ioe.dao.page.PageResult;
import com.ruixi.ioe.mapper.ScriptTableMapper;
import com.ruixi.ioe.service.ScriptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author liang
 * @className ScriptServiceImpl
 * @description TODO
 * @date 2022/7/17 9:34 下午
 */
@Service
public class ScriptServiceImpl implements ScriptService {

    @Autowired
    private ScriptTableMapper scriptTableMapper;

    @Override
    public Map<String, Object> getList(ScriptQuery param) {
        Map<String, Object> ret = new HashMap<>(3);
        param.setStartPage((param.getPageNo()-1)*param.getPageSize());
        List<ScriptTable> list = scriptTableMapper.selectByList(param);
        int totalRowSize = scriptTableMapper.countList(param);
        ret.put("code", ReturnCode.SUCCESS);
        ret.put("message", ReturnCode.getReturnMsg(ReturnCode.SUCCESS));
        ret.put("pageResult", new PageResult(param.getPageNo(), totalRowSize, param.getPageSize(), list));
        return  ret;
    }

    @Override
    public void add(ScriptTable param) {
        param.setCreateTime(new Date());
        scriptTableMapper.insertSelective(param);
    }

    @Override
    public void check(Integer id) {
        Map<String, Object> ret = new HashMap<>(3);
        ScriptTable scriptTable = scriptTableMapper.selectByPrimaryKey(id);
        if(scriptTable != null && scriptTable.getUsageCount() != null){
            scriptTable.setUsageCount(scriptTable.getUsageCount()+1);
        }else{
            scriptTable.setUsageCount(1);
        }
        scriptTableMapper.updateByPrimaryKeySelective(scriptTable);
        if(scriptTable != null){
            ret.put("code", ReturnCode.SUCCESS);
            ret.put("message", ReturnCode.getReturnMsg(ReturnCode.SUCCESS));
        }
    }
}
