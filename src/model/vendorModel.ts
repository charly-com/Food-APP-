import { DataTypes, Model } from "sequelize";

import { db } from "../config";
import { FoodInstance } from "./foodModel";

export interface VendorAttributes {
    id: string;
    name: string;
    ownerName: string;
    pincode: string;
    email: string;
    salt: string;
    address: string;
    phone: string;
    password: string;
    serviceAvailable: boolean;
    rating: number;
    role: string;
}

export class VendorInstance extends Model<VendorAttributes> {}

VendorInstance.init({
  id: {
    type:DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false 
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: 'Email is required'
            },
            isEmail: {
                msg: 'Email is invalid'
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Password is required'
            },
            notEmpty: {
                msg: 'provide a password'
            }
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ownerName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    salt: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Phone Number is required'
            },
            notEmpty: {
                msg: 'provide a phone number'
            }
    }
  },
    pincode: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    rating: {
        type: DataTypes.NUMBER,
        allowNull: true,
    },
    serviceAvailable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,

    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
    },
   

},
{
    sequelize: db,
    tableName: 'vendor'
});

VendorInstance.hasMany(FoodInstance, {foreignKey: 'vendorId', as: 'food'})

FoodInstance.belongsTo(VendorInstance, {foreignKey: 'vendorId', as: 'vendor'})