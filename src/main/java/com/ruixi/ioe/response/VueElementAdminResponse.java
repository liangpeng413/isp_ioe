package com.ruixi.ioe.response;

import lombok.Data;
import org.springframework.stereotype.Component;

import java.io.Serializable;

/**
 * @author liang
 * @className VueElementAdminResponse
 * @description TODO
 * @date 2022/7/7 5:51 下午
 */
@Component
@Data
public class VueElementAdminResponse implements Serializable {
    private static final long serialVersionUID = -8668034013803393986L;
    private Integer code;
    private String message;
    private Object data;
}

