package com.ruixi.ioe.mapper;

import com.ruixi.ioe.dao.CategorySelected;
import com.ruixi.ioe.dao.CookbookTools;

import java.util.List;

public interface CategorySelectedMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(CategorySelected record);

    int insertSelective(CategorySelected record);

    CategorySelected selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(CategorySelected record);

    int updateByPrimaryKey(CategorySelected record);

    List<CookbookTools> selectByQueryPage(CategorySelected param);

    int selectByQueryCount(CategorySelected param);

}
