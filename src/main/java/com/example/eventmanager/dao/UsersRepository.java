package com.example.eventmanager.dao;


import com.example.eventmanager.domain.Image;
import com.example.eventmanager.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@PropertySource("queries/user.properties")
@Repository
public class UsersRepository implements CrudRepository<User> {

    private final NamedParameterJdbcTemplate namedJdbcTemplate;
    private final Environment env;
    private final ApplicationContext appContext;

    @Autowired
    public UsersRepository(NamedParameterJdbcTemplate namedJdbcTemplate, Environment env, ApplicationContext appContext) {
        this.namedJdbcTemplate = namedJdbcTemplate;
        this.env = env;
        this.appContext = appContext;
    }

    private final class UserMapper implements RowMapper<User> {
        @Override
        public User mapRow(ResultSet resultSet, int rowNum) throws SQLException {
            User user = new User();

            user.setId(resultSet.getLong("id"));
            user.setLogin(resultSet.getString("login"));
            user.setPassword(resultSet.getString("password"));
            user.setName(resultSet.getString("name"));
            user.setSurName(resultSet.getString("surname"));
            user.setEmail(resultSet.getString("email"));
            user.setBirth(resultSet.getDate("birth") != null ?
                    resultSet.getDate("birth").toLocalDate() : null);
            user.setPhone(resultSet.getString("phone"));
            user.setSex(resultSet.getBoolean("sex"));
            user.setImage(appContext.getBean(Image.class, resultSet.getLong("image_id")));
            user.setActive(resultSet.getBoolean("is_active"));
            user.setRegDate(resultSet.getDate("reg_date").toLocalDate());
            user.setConfLink(resultSet.getString("conf_link"));

            return user;
        }
    }

    public User findByUsername(String login) {
        try {
            Map<String, Object> namedParams = new HashMap<>();
            namedParams.put("login", login);
            return namedJdbcTemplate.queryForObject(env.getProperty("findByUsername"), namedParams, new UserMapper());
        } catch (EmptyResultDataAccessException e) {
            //TODO Logging
            return null;
        }
    }

    @Override
    public User findOne(Long id) {
        try {
            Map<String, Object> namedParams = new HashMap<>();
            namedParams.put("id", id);
            return namedJdbcTemplate.queryForObject(env.getProperty("findOne"), namedParams, new UserMapper());
        } catch (EmptyResultDataAccessException e) {
            //TODO Logging
            return null;
        }
    }

    @Override
    public Iterable<User> findAll() {
        return namedJdbcTemplate.query(env.getProperty("findAll"), new UserMapper());
    }

    @Override
    public void update(User user) {
        Map<String, Object> namedParams = new HashMap<>();
        namedParams.put("login", user.getLogin());
        namedParams.put("password", user.getPassword());
        namedParams.put("name", user.getName());
        namedParams.put("surname", user.getSurName());
        namedParams.put("email", user.getEmail());
        namedParams.put("birth", user.getBirth());
        namedParams.put("phone", !user.getPhone().equals("") ?
                user.getPhone() : null);
        namedParams.put("sex", user.getSex());
        namedParams.put("image_id", user.getImage() != null ?
                user.getImage().getId() : null);
        namedParams.put("is_active", user.isActive());
        namedParams.put("reg_date", user.getRegDate());
        namedParams.put("conf_link", user.getConfLink());
        namedParams.put("id", user.getId());

        namedJdbcTemplate.update(env.getProperty("update"), namedParams);
    }

    @Override
    public void delete(User user) {
        Map<String, Object> namedParams = new HashMap<>();
        namedParams.put("id", user.getId());
        namedJdbcTemplate.update(env.getProperty("delete"),namedParams);
    }

    public void changePass(User user) {
        Map<String, Object> namedParams = new HashMap<>();
        namedParams.put("password", user.getPassword());
        namedParams.put("id", user.getId());

        namedJdbcTemplate.update(env.getProperty("changePassword"), namedParams);
    }

    @Override
    public void save(User user) {
        if (user.getId() == null || !this.exists(user.getId())) {
            Map<String, Object> namedParams = new HashMap<>();
            namedParams.put("login", user.getLogin());
            namedParams.put("password", user.getPassword());
            namedParams.put("name", user.getName());
            namedParams.put("surname", user.getSurName());
            namedParams.put("email", user.getEmail());
            namedParams.put("birth", user.getBirth());
            namedParams.put("phone", user.getPhone());
            namedParams.put("sex", user.getSex());
            namedParams.put("image_id", user.getImage() != null ?
                    user.getImage().getId() : null);
            namedParams.put("is_active", user.isActive());
            namedParams.put("reg_date", LocalDate.now());
            namedParams.put("conf_link", user.getConfLink());

            namedJdbcTemplate.update(env.getProperty("save"), namedParams);
        } else {
            update(user);
        }
    }

}
