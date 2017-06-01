package org.opengeoportal.harvester.mvc.bean;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.web.client.RestTemplate;

public class AuthenticationSuccessHandlerImpl
        implements AuthenticationSuccessHandler {

    private String dataIngestUrl;

    private String password;

    @Autowired
    public AuthenticationSuccessHandlerImpl(
            @Value("#{dataIngest['dataIngest.url']}") String dataIngestUrl,
            @Value("#{dataIngest['dataIngest.password']}") String password) {
        super();
        this.dataIngestUrl = dataIngestUrl;
        this.password = password;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest httpServletRequest,
            HttpServletResponse httpServletResponse,
            Authentication authentication)
            throws IOException, ServletException {
        HttpSession session = httpServletRequest.getSession();
        User authUser = (User) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        session.setAttribute("username", authUser.getUsername());
        session.setAttribute("authorities", authentication.getAuthorities());

        // Login on dataingest

        RestTemplate restTemplate = new RestTemplate();

        // Prepare JSON Object for the request
        JSONObject request = new JSONObject();

        request.put("username", authUser.getUsername());
        request.put("password", password);

        // Set Headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<String>(request.toString(),
                headers);

        ResponseEntity<String> createResponse = null;

        // Send request and parse result
        try {
            createResponse = restTemplate.exchange(dataIngestUrl + "/login", HttpMethod.POST, entity, String.class);
        } catch (Exception e) {
            System.out.println("DataIngest auth error " + e.getMessage());
            httpServletResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            httpServletResponse.sendRedirect("/loginfailed");
            return;
        }

        if (createResponse.getStatusCode()
                .equals(org.springframework.http.HttpStatus.OK)) {
            session.setAttribute("dataIngest_token",
                    createResponse.getHeaders().get("Authorization").get(0));
            httpServletResponse.setStatus(HttpServletResponse.SC_OK);
            httpServletResponse.sendRedirect("/");
        } else {
            httpServletResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            httpServletResponse.sendRedirect("/loginfailed");
            return;
        }

    }
}
