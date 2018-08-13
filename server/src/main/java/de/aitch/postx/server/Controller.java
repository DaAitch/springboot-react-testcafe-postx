package de.aitch.postx.server;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

import java.util.Arrays;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import de.aitch.postx.server.dto.Post;

@RestController()
@RequestMapping("/api")
public class Controller {

    @RequestMapping(method = GET, path = "/posts")
    public @ResponseBody Object getPosts() {
        return Arrays.asList(
                new Post()
                        .setTitle("TestCafe for testing UIs.")
                        .setBody("lorem ipsum"),
                new Post()
                        .setTitle("Write your own project specific TestCafe setup!")
                        .setBody("dolor sit amet")
        );
    }
}
