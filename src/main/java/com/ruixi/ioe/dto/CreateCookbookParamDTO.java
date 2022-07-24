package com.ruixi.ioe.dto;

import lombok.Data;

/**
 * @author liang
 * @className CreateCookbookParamDTO
 * @description TODO
 * @date 2022/7/24 9:42 下午
 */
@Data
public class CreateCookbookParamDTO {

    private String associationType;

    private String skuCode;

    private String memberId;

    private String cookbookIds;

    private String createUserName;
}
