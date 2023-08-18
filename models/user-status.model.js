const UserStatus =  (sequelize, DataTypes) => {
    return sequelize.define("UserStatus", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: {msg: "Enregistrement impossible : ce libellé est déjà utilisé."},
            validate: {
                notEmpty: {msg: "Le champ 'name' ne peut pas être vide."}
            },
        },
    }, {
        tableName: 'user_status',
        timestamps: true,
        underscored: true,
    })
}

module.exports =  UserStatus