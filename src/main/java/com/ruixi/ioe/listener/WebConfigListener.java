package com.ruixi.ioe.listener;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;
import java.util.Random;

/**
 * Created by zhangxiongbiao on 16-12-19.
 */
@Component
@WebListener
@Slf4j
public class WebConfigListener implements ServletContextListener {



    private static final String PAGE_RANDOM = "20180621"+ new Random().nextInt();

    @Override
    public void contextInitialized(ServletContextEvent servletContextEvent) {
        ServletContext servletContext = servletContextEvent.getServletContext();
        String appName = "http://localhost:8081/yh-test";
        String ctx = appName;
        log.info("ctx=",ctx);
        String jsRoot = ctx+"/static/js";
        String cssRoot = ctx+"/static/css";
        String imgRoot = ctx+"/static/img";
        String fileRoot = ctx+"/static/file";
        servletContext.setAttribute("ctx",ctx);
        servletContext.setAttribute("jsRoot",jsRoot);
        servletContext.setAttribute("cssRoot",cssRoot);
        servletContext.setAttribute("imgRoot",imgRoot);
        servletContext.setAttribute("fileRoot",fileRoot);
        servletContext.setAttribute("staticRoot",ctx+"/static");
        servletContext.setAttribute("random", PAGE_RANDOM);
        log.info("web配置初始化ctx:{},jsRoot:{},cssRoot:{},imgRoot:{}","fileRoot",ctx,jsRoot,cssRoot,imgRoot,fileRoot);

    }

    @Override
    public void contextDestroyed(ServletContextEvent servletContextEvent) {

    }

}
