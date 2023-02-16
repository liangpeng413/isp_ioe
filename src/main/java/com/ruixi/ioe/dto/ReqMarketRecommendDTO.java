package com.ruixi.ioe.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * @author liang
 * @className ReqMarketRecommendDTO
 * @description TODO
 * @date 2023/2/16 2:17 下午
 */
@Data
public class ReqMarketRecommendDTO {
    private String shopId;
    private Long sellerId;
    private Long cityId;
    private Long memberId;
    private String  sceneSrc;
    private String topicName;
    private Double lng = null;
    private Double lat = null;
    private Integer saleChannelId;
    private String version;
    private String distinctId = null;
    private Integer page;
    private Integer pageSize;
    private String deviceId;
    private List<String> excludeSkuCodes = new ArrayList<>();
    private String traceId;
    private String requestId = null;
    private Integer sceneId;
    private String modelCode;
}
