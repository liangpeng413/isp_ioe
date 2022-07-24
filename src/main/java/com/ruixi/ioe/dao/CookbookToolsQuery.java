package com.ruixi.ioe.dao;

import com.ruixi.ioe.dao.page.PageBase;
import lombok.Data;

/**
 * @author liang
 * @className CookbootToolsQuery
 * @description TODO
 * @date 2022/7/24 8:29 下午
 */
@Data
public class CookbookToolsQuery extends PageBase {

    private String associationType;

    private String skuCode;

    private String memberId;

    private String cookbookId;
}
