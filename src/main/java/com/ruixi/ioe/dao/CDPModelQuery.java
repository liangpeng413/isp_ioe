package com.ruixi.ioe.dao;

import lombok.Data;

/**
 * @author liang
 * @className ShopCommon
 * @description TODO
 * @date 2023/2/16 11:19 上午
 */
@Data
public class CDPModelQuery {
    private String shopId;

    private Long sellerId;

    private String version;

    private Long memberId;

    private Long cityId;

    private String isSit;

}
