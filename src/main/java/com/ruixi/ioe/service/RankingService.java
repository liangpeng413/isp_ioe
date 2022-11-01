package com.ruixi.ioe.service;

import com.ruixi.ioe.dao.RankingDetail;

import java.util.Map;

/**
 * @author liang
 * @className rankingService
 * @description TODO
 * @date 2022/11/1 6:03 下午
 */
public interface RankingService
{
    Map<String, Object> getList(RankingDetail queryParam);

    void add(RankingDetail param);
}
