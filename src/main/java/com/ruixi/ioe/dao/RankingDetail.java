package com.ruixi.ioe.dao;

import com.ruixi.ioe.dao.page.PageBase;
import lombok.Data;

import java.util.Date;

@Data
public class RankingDetail extends PageBase {
    private Integer id;

    private String createName;

    private String shopId;

    private Date createTime;

}
