package com.ruixi.ioe.dao;

import lombok.Data;

import java.util.Date;

@Data
public class ScriptTable {
    private Integer id;

    private String scriptName;

    private String scriptUrl;

    private String scriptType;

    private String createUserName;

    private Date createTime;

    private Integer usageCount;

    private String scriptDesc;


}
