package com.example.eventmanager.domain;

public class FolderView {
    public interface ShortView {}
    public interface FullView extends ShortView,UserView.ShortView{}
}
