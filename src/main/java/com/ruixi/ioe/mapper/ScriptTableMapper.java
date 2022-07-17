package com.ruixi.ioe.mapper;

import com.ruixi.ioe.dao.ScriptQuery;
import com.ruixi.ioe.dao.ScriptTable;

import java.util.List;

public interface ScriptTableMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(ScriptTable record);

    int insertSelective(ScriptTable record);

    ScriptTable selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(ScriptTable record);

    int updateByPrimaryKey(ScriptTable record);

    List<ScriptTable> selectByList(ScriptQuery queryParam);

    int countList(ScriptQuery param);
}
