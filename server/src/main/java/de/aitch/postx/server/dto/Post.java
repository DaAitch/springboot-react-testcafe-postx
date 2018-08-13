package de.aitch.postx.server.dto;

public class Post {
    private String title;
    private String body;

    public String getTitle() {
        return title;
    }

    public Post setTitle(final String title) {
        this.title = title;
        return this;
    }

    public String getBody() {
        return body;
    }

    public Post setBody(final String body) {
        this.body = body;
        return this;
    }
}
