const Area = (sequelize, DataTypes) => {
    return sequelize.define("Area", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            // unique: {msg: "Ce nom est déjà pris."},
            validate: {
                notEmpty :{msg: "Le champ 'name' ne peut pas être vide."}
            },
        },
        description_short: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        description_long: {
            type: DataTypes.STRING(2000),
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        telephone: {
            type: DataTypes.STRING(12),
            allowNull: true,
        },
        address: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        address_pc: {
            type: DataTypes.STRING(5),
            allowNull: true,
        },
        address_city: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        url: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        picture: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        price: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        is_indoor: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'area',
        timestamps: true,
        underscored: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
      })
}

module.exports = Area