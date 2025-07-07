package org.linlinjava.litemall.db.dao;

import org.linlinjava.litemall.db.domain.UserVo;

import java.util.List;

public interface GrabberMapper {
    /**
     * 查询用户及其所有地址
     */
    List<UserVo> selectUserWithAddress();
}