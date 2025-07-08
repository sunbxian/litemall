package org.linlinjava.litemall.db.service;

import com.github.pagehelper.PageHelper;
import org.linlinjava.litemall.db.dao.GrabberMapper;
import org.linlinjava.litemall.db.dao.LitemallTicketUserMapper;
import org.linlinjava.litemall.db.dao.LitemallUserMapper;
import org.linlinjava.litemall.db.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class LitemallTicketUserService {
    @Resource
    private LitemallTicketUserMapper ticketUserMapper;

    public LitemallTicketUser findById(Integer orderId) {
        return ticketUserMapper.selectByPrimaryKey(orderId);
    }

    public List<LitemallTicketUser> querySelective(Integer userId, Integer designatedGoodId, Integer page, Integer limit, String sort, String order) {
        LitemallTicketUserExample example = new LitemallTicketUserExample();
        LitemallTicketUserExample.Criteria criteria = example.createCriteria();

        if (designatedGoodId != null && designatedGoodId > 0) {
            criteria.andDesignatedGoodIdEqualTo(designatedGoodId);
        }
        criteria.andUserIdEqualTo(userId);
        criteria.andDeletedEqualTo(false);

        if (!StringUtils.isEmpty(sort) && !StringUtils.isEmpty(order)) {
            example.setOrderByClause(sort + " " + order);
        }

        PageHelper.startPage(page, limit);
        return ticketUserMapper.selectByExample(example);
    }

    public int add(LitemallTicketUser ticketUser) {
        ticketUser.setAddTime(LocalDateTime.now());
        ticketUser.setUpdateTime(LocalDateTime.now());
        return ticketUserMapper.insertSelective(ticketUser);
    }

    public int updateByPrimaryKeySelective(LitemallTicketUser order) {
        return ticketUserMapper.updateByPrimaryKeySelective(order);
    }

    public int updateSelective(Integer orderId) {
        LitemallTicketUserExample example = new LitemallTicketUserExample();
        LitemallTicketUserExample.Criteria criteria = example.createCriteria();

        criteria.andOrderIdEqualTo(orderId);  // WHERE条件

        LitemallTicketUser ticketUser = new LitemallTicketUser();
        ticketUser.setDeleted(true);

        return ticketUserMapper.updateByExampleSelective(ticketUser, example);
    }

}
