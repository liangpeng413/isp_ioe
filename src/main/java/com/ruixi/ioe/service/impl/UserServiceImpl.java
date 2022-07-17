package com.ruixi.ioe.service.impl;

import com.ruixi.ioe.dao.User;
import com.ruixi.ioe.dto.ResUserDTO;
import com.ruixi.ioe.mapper.UserMapper;
import com.ruixi.ioe.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**ØØ
 * @author liang
 * @className UserServiceImpl
 * @description TODO
 * @date 2022/7/11 5:06 下午
 */
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Override
    public User queryUser(ResUserDTO param) {
          User user = new User();
          user.setUserNumber(param.getUsername());
          user.setPassword(param.getPassword());
          User res = userMapper.selectByPrimaryUser(user);
          if(res != null){
              return res;
          }else{
              return null;
          }
    }
}
