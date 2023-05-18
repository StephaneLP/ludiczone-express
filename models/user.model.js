const User =  (sequelize, DataTypes) => {
    return sequelize.define("User", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        first_name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: {msg: "Le champ 'prénom' ne peut pas être vide."}
            },
        },
        last_name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: {msg: "Le champ 'nom' ne peut pas être vide."}
            },
        },
        nick_name: {
            type: DataTypes.STRING(12),
            allowNull: false,
            unique: {msg: "Enregistrement impossible : ce pseudo est déjà pris."},
            validate: {
                notEmpty: {msg: "Le champ 'pseudo' ne peut pas être vide."}
            },
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: {msg: "Enregistrement impossible : cet email est déjà utilisé."},
            validate: {
                notEmpty: {msg: "Le champ 'email' ne peut pas être vide."}
            },
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: {msg: "Le champ 'mot de passe' ne peut pas être vide."}
            },
        },
        role: {
            type: DataTypes.STRING(10),
            allowNull: false,
            validate: {
                notEmpty: {msg: "Le champ 'rôle' ne peut pas être vide."}
            },
            defaultValue: "user",
        },
    }, {
        tableName: 'user',
        timestamps: true,
        underscored: true,
    })
}

module.exports =  User