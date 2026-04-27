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

    public List<User> getAllUsers() {
        return repository.findAll();
    }
}