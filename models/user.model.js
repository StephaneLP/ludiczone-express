const userRoles = ['user', 'admin', 'superadmin']

const User =  (sequelize, DataTypes) => {
    return sequelize.define("User", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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
            type: DataTypes.STRING(254),
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
            validate: {
                areRolesValid(role){
                    if(!role){
                    throw new Error('Un utilisateur doit avoir au moins un rôle')
                    }
                    if(!userRoles.includes(role)){
                        throw new Error(`Les rôles d'un utilisateur doivent appartenir à la liste suivante : ${userRoles}`)
                    }
                }
            }
        },
    }, {
        tableName: 'user',
        timestamps: true,
        underscored: true,
    })
}

module.exports =  User