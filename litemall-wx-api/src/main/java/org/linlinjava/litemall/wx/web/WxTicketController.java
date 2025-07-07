package org.linlinjava.litemall.wx.web;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.linlinjava.litemall.core.util.ResponseUtil;
import org.linlinjava.litemall.core.validator.Order;
import org.linlinjava.litemall.core.validator.Sort;
import org.linlinjava.litemall.db.domain.LitemallTicketUser;
import org.linlinjava.litemall.db.service.LitemallStorageService;
import org.linlinjava.litemall.db.service.LitemallTicketUserService;
import org.linlinjava.litemall.wx.annotation.LoginUser;
import org.linlinjava.litemall.wx.service.WxOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.constraints.NotNull;
import java.util.List;

@RestController
@RequestMapping("/wx/ticket")
@Validated
public class WxTicketController {
    private final Log logger = LogFactory.getLog(WxTicketController.class);

    @Autowired
    private LitemallTicketUserService ticketUserService;

    /**
     * 水票列表
     *
     * @param userId   用户ID
     * @param dGoodId  水票商品ID
     * @param page     分页页数
     * @param limit     分页大小
     * @param sort     排序字段
     * @param order     排序方式
     * @return 订单列表
     */
    @GetMapping("list")
    public Object list(@LoginUser Integer userId,
                       @RequestParam(defaultValue = "0") Integer dGoodId,
                       @RequestParam(defaultValue = "1") Integer page,
                       @RequestParam(defaultValue = "10") Integer limit,
                       @Sort @RequestParam(defaultValue = "add_time") String sort,
                       @Order @RequestParam(defaultValue = "desc") String order) {
        List<LitemallTicketUser> ticketUserList = ticketUserService.querySelective(userId, dGoodId, page, limit, sort, order);
        return ResponseUtil.okList(ticketUserList);
    }
}