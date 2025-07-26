package org.linlinjava.litemall.admin.web;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.linlinjava.litemall.admin.annotation.RequiresPermissionsDesc;
import org.linlinjava.litemall.admin.service.AdminOrderService;
import org.linlinjava.litemall.admin.vo.StatVo;
import org.linlinjava.litemall.core.util.ResponseUtil;
import org.linlinjava.litemall.core.validator.Order;
import org.linlinjava.litemall.core.validator.Sort;
import org.linlinjava.litemall.db.service.StatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/stat")
@Validated
public class AdminStatController {
    private final Log logger = LogFactory.getLog(AdminStatController.class);

    @Autowired
    private StatService statService;

    @Autowired
    private AdminOrderService adminOrderService;

    @RequiresPermissions("admin:stat:user")
    @RequiresPermissionsDesc(menu = {"统计管理", "用户统计"}, button = "查询")
    @GetMapping("/user")
    public Object statUser() {
        List<Map> rows = statService.statUser();
        String[] columns = new String[]{"day", "users"};
        StatVo statVo = new StatVo();
        statVo.setColumns(columns);
        statVo.setRows(rows);
        return ResponseUtil.ok(statVo);
    }

    @RequiresPermissions("admin:stat:order")
    @RequiresPermissionsDesc(menu = {"统计管理", "订单统计"}, button = "查询")
    @GetMapping("/order")
    public Object statOrder(@RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime start,
                            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime end,
                            @RequestParam(defaultValue = "1") Integer page,
                            @RequestParam(defaultValue = "10") Integer limit) {
        Map<String, Object> data = (Map)statService.statOrder(start, end, page, limit);
        return ResponseUtil.ok(data);
    }

    @RequiresPermissions("admin:stat:goods")
    @RequiresPermissionsDesc(menu = {"统计管理", "商品统计"}, button = "查询")
    @GetMapping("/goods")
    public Object statGoods() {
        List<Map> rows = statService.statGoods();
        String[] columns = new String[]{"day", "orders", "products", "amount"};
        StatVo statVo = new StatVo();
        statVo.setColumns(columns);
        statVo.setRows(rows);
        return ResponseUtil.ok(statVo);
    }

    @RequiresPermissions("admin:stat:userOrder")
    @RequiresPermissionsDesc(menu = {"统计管理", "用户订单统计"}, button = "查询")
    @GetMapping("/userOrder")
    public Object statUserOrder(String nickname, @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime start,
                                @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime end,
                                  @RequestParam(defaultValue = "1") Integer page,
                                  @RequestParam(defaultValue = "10") Integer limit) {
        Map<String, Object> data = (Map)statService.statUserOrder(nickname, start, end, page, limit);
        return ResponseUtil.ok(data);
    }

    /**
     * 查询订单
     *
     * @param userId
     * @param page
     * @param limit
     * @param sort
     * @param order
     * @return
     */
    @RequiresPermissions("admin:stat:userOrderDetail")
    @RequiresPermissionsDesc(menu = {"统计管理", "用户订单详情"}, button = "查询")
    @GetMapping("/userOrderDetail")
    public Object userOrderDetail(Integer userId, String nickname, String grabName, String consignee, String orderSn,
                       @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime start,
                       @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime end,
                       @RequestParam(required = false) List<Short> orderStatusArray,
                       @RequestParam(required = false) List<Short> typeArray,
                       @RequestParam(defaultValue = "0") Integer ticketCount,
                       @RequestParam(defaultValue = "1") Integer page,
                       @RequestParam(defaultValue = "10") Integer limit,
                       @Sort @RequestParam(defaultValue = "add_time") String sort,
                       @Order @RequestParam(defaultValue = "desc") String order) {
        return adminOrderService.userOrderList(userId, nickname, grabName, consignee, orderSn, start, end, orderStatusArray, typeArray, ticketCount, page, limit, sort, order);
    }

    @RequiresPermissions("admin:stat:grabOrder")
    @RequiresPermissionsDesc(menu = {"统计管理", "配送员统计"}, button = "查询")
    @GetMapping("/grabOrder")
    public Object statGrabOrder(@RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime start,
                                @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime end) {
        List<Map> rows = statService.statGrabOrder(start, end);
        String[] columns = new String[]{"grab_user_id", "username", "nickname", "total_grab_orders", "total_water_delivered"};
        StatVo statVo = new StatVo();
        statVo.setColumns(columns);
        statVo.setRows(rows);

        return ResponseUtil.ok(statVo);
    }

    /**
     * 配送员订单详细查询
     *
     * @param garbUserId
     * @param page
     * @param limit
     * @param sort
     * @param order
     * @return
     */
    @RequiresPermissions("admin:stat:grabOrderDetail")
    @RequiresPermissionsDesc(menu = {"统计管理", "配送员订单详情"}, button = "查询")
    @GetMapping("/grabOrderDetail")
    public Object grabOrderDetail(Integer garbUserId, String nickname, String grabName, String consignee, String orderSn,
                                  @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime start,
                                  @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime end,
                                  @RequestParam(required = false) List<Short> orderStatusArray,
                                  @RequestParam(required = false) List<Short> typeArray,
                                  @RequestParam(defaultValue = "0") Integer ticketCount,
                                  @RequestParam(defaultValue = "1") Integer page,
                                  @RequestParam(defaultValue = "10") Integer limit,
                                  @Sort @RequestParam(defaultValue = "add_time") String sort,
                                  @Order @RequestParam(defaultValue = "desc") String order) {
        return adminOrderService.grabOrderList(garbUserId, nickname, grabName, consignee, orderSn, start, end, orderStatusArray, typeArray, ticketCount, page, limit, sort, order);
    }
}
