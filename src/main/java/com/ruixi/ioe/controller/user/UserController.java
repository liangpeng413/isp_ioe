package com.ruixi.ioe.controller.user;

import com.alibaba.fastjson.JSONObject;
import com.ruixi.ioe.dao.User;
import com.ruixi.ioe.dto.ResUserDTO;
import com.ruixi.ioe.enums.VueElementAdminResponseEnum;
import com.ruixi.ioe.response.VueElementAdminResponse;
import com.ruixi.ioe.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * @author liang
 * @className controller
 * @description TODO
 * @date 2022/7/4 5:41 下午
 */
@Controller
@RequestMapping("user")
public class UserController {
    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @ResponseBody
    @PostMapping("/user/login")
    public VueElementAdminResponse login(@RequestBody ResUserDTO param){
        VueElementAdminResponse res = new VueElementAdminResponse();
        if(param != null && !param.getUsername().isEmpty() && !param.getPassword().isEmpty()){
            User user = userService.queryUser(param);
            res.setCode(VueElementAdminResponseEnum.SUCCESS.getRespCode());
            res.setMessage(VueElementAdminResponseEnum.SUCCESS.getRespDesc());
            HashMap<String, Object> map = new HashMap<>();
            map.put("token","admin-token");
            map.put("user",user);
            res.setData(map);

        }else{
            res.setCode(VueElementAdminResponseEnum.PARAM_ERROR.getRespCode());
            res.setMessage(VueElementAdminResponseEnum.PARAM_ERROR.getRespDesc());
        }

        //todo   登陆成功返回2000
        //todo   登陆失败失败返回50008
        return res;
    }

    @ResponseBody
    @RequestMapping(value = "/user/info")
    public Map info(@RequestParam("token") String token) {
        log.info(token);
        HashMap<String, Object> responseInfo = new HashMap<>();
        HashMap<String, Object> responseData = new HashMap<>();
        if(token.equals("admin-token")){
            String[] roles = new String[1];
            roles[0] = "admin";
            responseData.put("roles",roles);
            responseData.put("introduction","I am a super administrator");
            responseData.put("avatar","https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif");
            responseData.put("name","Super admin");
            responseInfo.put("code",20000);
            responseInfo.put("data",responseData);
            log.info(JSONObject.toJSONString(responseInfo));
        } else if(token.equals("editor-token")){
            String[] roles = new String[1];
            roles[0] = "editor";
            responseData.put("roles",roles);
            responseData.put("introduction","I am an editor");
            responseData.put("avatar","https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif");
            responseData.put("name","Normal Editor");
            responseInfo.put("code",20000);
            responseInfo.put("data",responseData);
            log.info(JSONObject.toJSONString(responseInfo));
        }
        return responseInfo;
    }

    @ResponseBody
    @PostMapping("/user/logout")
    public VueElementAdminResponse logout(@RequestParam(name = "token") String token){
        VueElementAdminResponse res = new VueElementAdminResponse();
        res.setCode(VueElementAdminResponseEnum.SUCCESS.getRespCode());
        res.setMessage(VueElementAdminResponseEnum.SUCCESS.getRespDesc());
        return res;
    }
}
