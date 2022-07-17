package com.ruixi.ioe.dao;

import com.ruixi.ioe.dao.page.PageBase;
import lombok.Data;

/**
 * @author liang
 * @className ScriptQuery
 * @description TODO
 * @date 2022/7/17 9:30 下午
 */
@Data
public class ScriptQuery {

    private String scriptName;

    private String scriptUrl;

    private String scriptType;

    /**size数*/
    private Integer pageSize;
    /**当前页数*/
    private Integer pageNo;
    private Integer startPage;


}
