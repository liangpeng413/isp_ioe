package com.ruixi.ioe.service;

import com.ruixi.ioe.dao.User;
import com.ruixi.ioe.dto.ResUserDTO;
import org.springframework.stereotype.Service;

/**
 * @author liang
 * @className UserService
 * @description TODO
 * @date 2022/7/11 5:04 下午
 */
public interface UserService {
    User queryUser(ResUserDTO param);
}
