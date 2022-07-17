package com.ruixi.ioe.service;

import com.ruixi.ioe.dao.ScriptQuery;
import com.ruixi.ioe.dao.ScriptTable;

import java.util.Map;

/**
 * @author liang
 * @className ScriptService
 * @description TODO
 * @date 2022/7/17 9:34 下午
 */
public interface ScriptService {
    Map<String, Object> getList(ScriptQuery queryParam);

    void add(ScriptTable param);

    void check(Integer id);
}
