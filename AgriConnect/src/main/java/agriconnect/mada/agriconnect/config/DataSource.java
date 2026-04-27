package agriconnect.mada.agriconnect.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

@Configuration
public class DataSource {
    @Bean
    public Connection getDBConnection() {
        Dotenv dotenv = Dotenv.load();
        String jdbc_url = dotenv.get("JDBC_URL");
        String user = dotenv.get("USER");
        String password = dotenv.get("PASSWORD");

        try {
            return DriverManager.getConnection(jdbc_url, user, password);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
