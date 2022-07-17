package com.ruixi.ioe;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
//扫描mapper
@MapperScan("com.ruixi.ioe.mapper")
public class IoeApplication {

    public static void main(String[] args) {
        SpringApplication.run(IoeApplication.class, args);
    }

}
