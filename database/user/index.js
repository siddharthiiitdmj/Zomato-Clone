import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema(
    {
        fullname: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String },
        address: [{ details: { type: String }, for: { type: String } }],
        phoneNumber: [{ type: Number }],
    },
    {
        timestamps: true,
    }
);

//creating a jwt token
UserSchema.methods.generateJwtToken = function () {
    return jwt.sign({ user: this._id.toString() }, "ZomatoClone");
};

// check if user already exists with same email or phone number
UserSchema.statics.checkDuplicateUserByEmailOrPhone = async (
    email,
    phoneNumber
) => {
    const checkUserByEmail = await UserModel.findOne({ email });
    const checkUserByNumber = await UserModel.findOne({ phoneNumber });
    if (checkUserByEmail || checkUserByNumber) {
        throw new Error("User already exists!!");
    }
    return false;
};

//check sign in details of user
UserSchema.statics.findByEmailAndPassword = async ({ email, password }) => {
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error("Invalid email id!!!");
    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) throw new Error("Invalid password!!!");
    return user;
};

//hashing the password for storing in db
UserSchema.pre("save", function (next) {
    const user = this;

    //check if password is entered
    if (!user.isModified("password")) return next();

    bcrypt.genSalt(8, (error, salt) => {
        if (error) return next(error);

        bcrypt.hash(user.password, salt, (error, hashedPassword) => {
            if (error) return next(error);
            user.password = hashedPassword;
            return next();
        });
    });
});

export const UserModel = mongoose.model("Users", UserSchema);
