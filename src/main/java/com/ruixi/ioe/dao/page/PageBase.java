package com.ruixi.ioe.dao.page;

import lombok.Data;

/**
 * @author liang
 * @className PageBase
 * @description TODO
 * @date 2022/7/17 9:32 下午
 */
@Data
public class PageBase {
    /**size数*/
    private Integer pageSize;
    /**当前页数*/
    private Integer pageNo;
    private Integer startPage;
}
