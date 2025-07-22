package org.linlinjava.litemall.db.service;

import org.linlinjava.litemall.db.dao.StatMapper;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
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
