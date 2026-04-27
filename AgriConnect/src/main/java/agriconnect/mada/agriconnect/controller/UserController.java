package agriconnect.mada.agriconnect.controller;

import agriconnect.mada.agriconnect.dto.UpdateUserRequest;
import agriconnect.mada.agriconnect.entity.User;
import agriconnect.mada.agriconnect.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    // GET ALL USERS
    @GetMapping
    public List<User> getAllUsers() {
        return service.getAllUsers();
    }

    // GET USER BY ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {

        User user = service.getUserById(id);

        return ResponseEntity.ok(user);
    }

    //PUT USER BY ID
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestBody UpdateUserRequest request
    ) {

        try {
            User user = new User();
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setPhone(request.getPhone());

            return ResponseEntity.ok(service.updateUser(id, user));

        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}