package org.linlinjava.litemall.db.domain;

import java.util.List;

public class GrabberVo {
    private String nickname;
    private String avatar;

    private List<LitemallAddress> addressList;

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public List<LitemallAddress> getAddressList() {
        return addressList;
    }

    public void setAddressList(List<LitemallAddress> addressList) {
        this.addressList = addressList;
    }
}
