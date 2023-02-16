package com.ruixi.ioe.service;

import com.ruixi.ioe.dao.CDPModelQuery;

import java.util.Map;

/**
 * @author liang
 * @className CheckCDPModelSerivce
 * @description TODO
 * @date 2023/2/16 11:25 上午
 */
public interface CheckCDPModelService {
    Map<String, Object> toCheck(CDPModelQuery param) throws Exception;
}
