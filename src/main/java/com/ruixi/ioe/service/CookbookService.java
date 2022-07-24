package com.ruixi.ioe.service;

import com.ruixi.ioe.dao.CookbookToolsQuery;
import com.ruixi.ioe.dto.CreateCookbookParamDTO;

import java.util.Map;

/**
 * @author liang
 * @className CookbookService
 * @description TODO
 * @date 2022/7/24 8:35 下午
 */
public interface CookbookService {

    public Map<String, Object> getList(CookbookToolsQuery param);

    void createCookbookTools(CreateCookbookParamDTO param);
}
