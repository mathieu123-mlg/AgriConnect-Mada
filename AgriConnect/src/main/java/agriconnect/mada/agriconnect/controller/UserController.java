package agriconnect.mada.agriconnect.controller;

import agriconnect.mada.agriconnect.entity.User;
import agriconnect.mada.agriconnect.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return service.getAllUsers();
    }
}