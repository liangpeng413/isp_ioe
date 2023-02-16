package com.ruixi.ioe.dao;

import lombok.Data;

/**
 * @author liang
 * @className CDPModel
 * @description TODO
 * @date 2023/2/16 11:42 上午
 */
@Data
public class CDPModel {
    private String topicName;
    private String topicId;
    private String modelName;
    private String modelCode;
    private String modelPriceDesc;
    private String productRecRule;
    private String productSortRule;
}
