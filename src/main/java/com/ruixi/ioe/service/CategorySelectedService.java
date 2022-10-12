package com.ruixi.ioe.service;

import com.ruixi.ioe.dao.CategorySelected;

import java.util.Map;

/**
 * @author liang
 * @className CategorySelectedService
 * @description TODO
 * @date 2022/10/12 3:25 下午
 */
public interface CategorySelectedService {

    Map<String, Object> getList(CategorySelected param);

    void createSelected(CategorySelected param);
}
