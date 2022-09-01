package com.ruixi.ioe.dao;

import lombok.Data;

import java.util.Date;

@Data
public class CookbookTools {
    private Integer id;

    private String associationType;

    private String skuCode;

    private String memberId;

    private String cookbookId;

    private String createUserName;

    private Date createTime;

    private String shopID;

    private String sceneID;

}
