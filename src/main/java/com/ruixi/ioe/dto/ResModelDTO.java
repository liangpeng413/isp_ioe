package com.ruixi.ioe.dto;

import com.ruixi.ioe.dao.CDPModel;
import lombok.Data;

import java.util.List;

/**
 * @author liang
 * @className ResModelDTO
 * @description TODO
 * @date 2023/2/16 11:41 上午
 */
@Data
public class ResModelDTO {
    private Boolean success;
    private List<CDPModel> data;
}
