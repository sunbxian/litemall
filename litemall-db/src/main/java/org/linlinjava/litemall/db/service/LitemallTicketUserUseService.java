package org.linlinjava.litemall.db.service;

import org.linlinjava.litemall.db.dao.LitemallTicketUserUseMapper;
import org.linlinjava.litemall.db.domain.*;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class LitemallTicketUserUseService {
    @Resource
    private LitemallTicketUserUseMapper ticketUserUseMapper;

    public LitemallTicketUserUse findById(Integer orderId) {
        return ticketUserUseMapper.selectByPrimaryKey(orderId);
    }

    public List<LitemallTicketUserUse> findByOid(Integer orderId) {
        LitemallTicketUserUseExample example = new LitemallTicketUserUseExample();
        example.or().andOrderIdEqualTo(orderId).andDeletedEqualTo(false);
        return ticketUserUseMapper.selectByExample(example);
    }

    public int add(LitemallTicketUserUse ticketUserUse) {
        ticketUserUse.setAddTime(LocalDateTime.now());
        ticketUserUse.setUpdateTime(LocalDateTime.now());
        return ticketUserUseMapper.insertSelective(ticketUserUse);
    }

    public int updateSelective(LitemallTicketUserUse ticketUserUse) {
        return ticketUserUseMapper.updateByPrimaryKeySelective(ticketUserUse);
    }
}
