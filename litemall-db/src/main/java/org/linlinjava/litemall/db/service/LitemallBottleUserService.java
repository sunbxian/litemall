package org.linlinjava.litemall.db.service;

import com.github.pagehelper.PageHelper;
import org.linlinjava.litemall.db.dao.LitemallBottleUserMapper;
import org.linlinjava.litemall.db.dao.LitemallTicketUserMapper;
import org.linlinjava.litemall.db.domain.LitemallBottleUser;
import org.linlinjava.litemall.db.domain.LitemallBottleUserExample;
import org.linlinjava.litemall.db.domain.LitemallTicketUser;
import org.linlinjava.litemall.db.domain.LitemallTicketUserExample;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class LitemallBottleUserService {
    @Resource
    private LitemallBottleUserMapper bottleUserMapper;

    public LitemallBottleUser findById(Integer id) {
        return bottleUserMapper.selectByPrimaryKey(id);
    }

    public List<LitemallBottleUser> querySelective(Integer userId, Integer page, Integer limit, String sort, String order) {
        LitemallBottleUserExample example = new LitemallBottleUserExample();
        LitemallBottleUserExample.Criteria criteria = example.createCriteria();

        criteria.andUserIdEqualTo(userId);
        criteria.andDeletedEqualTo(false);

        if (!StringUtils.isEmpty(sort) && !StringUtils.isEmpty(order)) {
            example.setOrderByClause(sort + " " + order);
        }

        PageHelper.startPage(page, limit);
        return bottleUserMapper.selectByExample(example);
    }

    public int add(LitemallBottleUser ticketUser) {
        ticketUser.setAddTime(LocalDateTime.now());
        ticketUser.setUpdateTime(LocalDateTime.now());
        return bottleUserMapper.insertSelective(ticketUser);
    }

    public int updateSelective(LitemallBottleUser order) {
        return bottleUserMapper.updateByPrimaryKeySelective(order);
    }
}
