package com.ruixi.ioe.dao.page;

import lombok.Data;

/**
 * @author liang
 * @className BaseResult
 * @description TODO
 * @date 2022/11/1 8:58 下午
 */
@Data
public class BaseResult {
    private Integer code;
    private String message;
    private Long now;
}
