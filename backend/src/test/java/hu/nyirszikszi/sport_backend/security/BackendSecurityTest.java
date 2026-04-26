package hu.nyirszikszi.sport_backend.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class BackendSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testLoginWithInvalidCredentials_ShouldReturnUnauthorized() throws Exception {
        String loginJson = "{\"email\":\"rossz@email.hu\", \"passwordHash\":\"hibasjelszo\"}";

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void testCreateFieldWithoutToken_ShouldReturnForbidden() throws Exception {
        String newFieldJson = "{\"name\":\"Új Pálya\", \"type\":\"Foci\", \"pricePerHour\":5000}";

        mockMvc.perform(post("/api/fields")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(newFieldJson))
                .andExpect(status().isForbidden());
    }
}