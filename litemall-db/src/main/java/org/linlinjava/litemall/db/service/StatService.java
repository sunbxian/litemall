package org.linlinjava.litemall.db.service;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import org.linlinjava.litemall.db.dao.StatMapper;
import org.linlinjava.litemall.db.domain.OrderVo;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StatService {
    @Resource
    private StatMapper statMapper;


    public List<Map> statUser() {
        return statMapper.statUser();
    }

    public List<Map> statOrder(LocalDateTime start, LocalDateTime end) {
        List<String> querys = new ArrayList<>(2);
        DateTimeFormatter df = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        querys.add(" order_status IN (401, 402) ");
        if (start != null) {
            querys.add(" add_time >= '" + df.format(start) + "' " );
        }
        if (end != null) {
            querys.add(" add_time < '" + df.format(end) + "' " );
        }
        String query = StringUtils.collectionToDelimitedString(querys, "and");

        return statMapper.statOrder(query);
    }

    public List<Map> statGoods() {
        return statMapper.statGoods();
    }

    public Map<String, Object> statUserOrder(String nickname, LocalDateTime start, LocalDateTime end, Integer page, Integer limit) {
        List<String> querys = new ArrayList<>(2);
        DateTimeFormatter df = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        if (!StringUtils.isEmpty(nickname)) {
            querys.add(" u.nickname like '%" + nickname + "%' ");
        }

        if (start != null) {
            querys.add(" o.add_time >= '" + df.format(start) + "' " );
        }
        if (end != null) {
            querys.add(" o.add_time < '" + df.format(end) + "' " );
        }
        String query = StringUtils.collectionToDelimitedString(querys, "and");
//        String nickname, String consignee, String orderSn, LocalDateTime start, LocalDateTime end, List<Short> orderStatusArray, Integer page, Integer limit, String sort, String order

        PageHelper.startPage(page, limit);
        Page<Map> list = (Page) statMapper.statUserOrder(query);

        Map<String, Object> data = new HashMap<String, Object>(5);
        data.put("list", list);
        data.put("total", list.getTotal());
        data.put("page", list.getPageNum());
        data.put("limit", list.getPageSize());
        data.put("pages", list.getPages());

        return data;
    }

    public List<Map> statGrabOrder(LocalDateTime start, LocalDateTime end) {
        List<String> querys = new ArrayList<>(2);
        DateTimeFormatter df = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        querys.add(" o.grab_user_id IS NOT NULL ");
        querys.add(" g.type IN (0)");
        querys.add(" o.order_status IN (401, 402) ");
        if (start != null) {
            querys.add(" o.add_time >= '" + df.format(start) + "' " );
        }
        if (end != null) {
            querys.add(" o.add_time < '" + df.format(end) + "' " );
        }
        String query = StringUtils.collectionToDelimitedString(querys, "and");
        return statMapper.statGrabOrder(query);
    }

}
