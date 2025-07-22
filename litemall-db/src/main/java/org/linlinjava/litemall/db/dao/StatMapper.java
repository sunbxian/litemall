package org.linlinjava.litemall.db.dao;

import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

public interface StatMapper {
    List<Map> statUser();

    List<Map> statOrder(@Param("query") String query);

    List<Map> statGoods();

    List<Map> statGrabOrder(@Param("query") String query);
}