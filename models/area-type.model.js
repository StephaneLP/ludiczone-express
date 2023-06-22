const AreaType = (sequelize, DataTypes) => {
    return sequelize.define("AreaType", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: {msg: "Enregistrement impossible : ce nom de type de loisir est déjà pris."},
            validate: {
                notEmpty: {msg: "Le champ 'name' ne peut pas être vide."}
            },
        },
        description: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        picture: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'area_type',
        timestamps: true,
        underscored: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    })
}

module.exports = AreaType