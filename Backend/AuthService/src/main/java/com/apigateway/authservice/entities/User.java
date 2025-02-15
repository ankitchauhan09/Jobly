    package com.apigateway.authservice.entities;

    import lombok.AllArgsConstructor;
    import lombok.Data;
    import lombok.NoArgsConstructor;
    import lombok.ToString;
    import org.springframework.data.annotation.Id;
    import org.springframework.data.annotation.Transient;
    import org.springframework.data.relational.core.mapping.Column;
    import org.springframework.data.relational.core.mapping.Table;
    import org.springframework.security.core.GrantedAuthority;
    import org.springframework.security.core.authority.SimpleGrantedAuthority;
    import org.springframework.security.core.userdetails.UserDetails;

    import java.util.Collection;
    import java.util.List;

    @Table(name = "users")
    @NoArgsConstructor
    @AllArgsConstructor
    @Data
    @ToString
    public class User implements UserDetails{
        @Id
        private String id;
        @Column("name")
        private String name;
        @Column("email")
        private String email;
        @Column("description")
        private String description;
        @Column("password")
        @Transient
        private String password;
        @Column("contact")
        private String contact;
        @Column("role_name")
        private String roleName;
        @Column("address")
        private String address;
        @Column("socialLinks")
        private String socialLinks;
        @Column("skills")
        private String skills;
        @Column("educations")
        private String educations;
        @Column("profile_pic_url")
        private String profilePicUrl;

        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
            return List.of(new SimpleGrantedAuthority(roleName));
        }

        @Override
        public String getUsername() {
            return email;
        }

        @Override
        public String getPassword() {
            return password;
        }

        @Override
        public boolean isAccountNonExpired() {
            return true;
        }

        @Override
        public boolean isAccountNonLocked() {
            return true;
        }

        @Override
        public boolean isCredentialsNonExpired() {
            return true;
        }

        @Override
        public boolean isEnabled() {
            return true;
        }

    }
