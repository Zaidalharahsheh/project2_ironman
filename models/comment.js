module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
        text: {

            type: DataTypes.STRING
        },
    });

    Comment.associate = function (models) {
        Comment.belongsTo(models.Todo, { foreignKey: 'todoId' });
        Comment.belongsTo(models.User, { foreignKey: 'userId'});
    }
    return Comment;
};

