## Live Backend Docs
https://node-js-my-sql-sequalize.onrender.com/api-docs/

## Live Backend with auth
https://node-js-my-sql-sequalize.onrender.com/

# for migrating database
npm install --save-dev sequelize-cli

npx sequelize-cli migration:generate --name create-user

npx sequelize-cli db:migrate


# for token blacklist
npx sequelize-cli model:generate --name TokenBlacklist --attributes token:string:unique,expiresAt:date

### Relationships using pivot table for understanding
# This code defines a many-to-many relationship between User and Role using a pivot table named UserRole.
# User.belongsToMany(models.Role, ...) indicates that a User can belong to many Roles.
# { through: 'UserRole', foreignKey: 'userId' } specifies the name of the pivot table (UserRole) and the foreign key (userId) used in that table.

For Simplicity :
CREATE TABLE UserRoles (
    user_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES Roles(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id)
);
