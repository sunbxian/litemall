package org.linlinjava.litemall.wx.web;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.linlinjava.litemall.core.util.ResponseUtil;
import org.linlinjava.litemall.core.validator.Order;
import org.linlinjava.litemall.core.validator.Sort;
import org.linlinjava.litemall.db.domain.LitemallBottleUser;
import org.linlinjava.litemall.db.domain.LitemallTicketUser;
import org.linlinjava.litemall.db.service.LitemallBottleUserService;
import org.linlinjava.litemall.db.service.LitemallTicketUserService;
import org.linlinjava.litemall.wx.annotation.LoginUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/wx/bottle")
@Validated
public class WxBottleController {
    private final Log logger = LogFactory.getLog(WxBottleController.class);

    @Autowired
    private LitemallBottleUserService bottleUserService;

    /**
     * 水票列表
     *
     * @param userId   用户ID
     * @param page     分页页数
     * @param limit     分页大小
     * @param sort     排序字段
     * @param order     排序方式
     * @return 订单列表
     */
    @GetMapping("list")
    public Object list(@LoginUser Integer userId,
                       @RequestParam(defaultValue = "1") Integer page,
                       @RequestParam(defaultValue = "10") Integer limit,
                       @Sort @RequestParam(defaultValue = "add_time") String sort,
                       @Order @RequestParam(defaultValue = "desc") String order) {
        List<LitemallBottleUser> bottleUserList = bottleUserService.querySelective(userId, page, limit, sort, order);
        return ResponseUtil.okList(bottleUserList);
    }
}