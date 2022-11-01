package com.ruixi.ioe.mapper;

import com.ruixi.ioe.dao.RankingDetail;

import java.util.List;

public interface RankingDetailMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(RankingDetail record);

    int insertSelective(RankingDetail record);

    RankingDetail selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(RankingDetail record);

    int updateByPrimaryKey(RankingDetail record);

    List<RankingDetail> selectByList(RankingDetail param);

    int countList(RankingDetail param);
}
