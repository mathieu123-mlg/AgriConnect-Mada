package agriconnect.mada.agriconnect.service;

import agriconnect.mada.agriconnect.entity.User;
import agriconnect.mada.agriconnect.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository repository;
    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    // GET ALL USERS
    public List<User> getAllUsers() {
        return repository.findAll();
    }

    //GET USER BY ID
    public User getUserById(Long id) {

        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    //UPDATE USER BY ID
    public User updateUser(Long id, User user) {

        return repository.update(id, user)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    //DELETE USER BY ID
    public void deleteUser(Long id) {

        boolean deleted = repository.deleteById(id);

        if (!deleted) {
            throw new RuntimeException("User not found with id: " + id);
        }
    }
}