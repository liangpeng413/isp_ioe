package com.ruixi.ioe.mapper;

import com.ruixi.ioe.dao.CookbookTools;
import com.ruixi.ioe.dao.CookbookToolsQuery;

import java.util.List;

public interface CookbookToolsMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(CookbookTools record);

    int insertSelective(CookbookTools record);

    CookbookTools selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(CookbookTools record);

    int updateByPrimaryKey(CookbookTools record);

    List<CookbookTools> selectByQueryPage(CookbookToolsQuery param);

    int selectByQueryCount(CookbookToolsQuery param);
}
