const userDB = require("../model/userModel")
const otpDB = require("../model/otpModel")
const viewStaticDB = require("../model/staticModel")
// const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const validator = require("email-validator")
const nodemailer = require("nodemailer")
const otpGenerator = require("otp-generator")
const { consumers } = require("nodemailer/lib/xoauth2")
// const { use } = require("../routers/userRoutes")
const express = require("express")
var mobileNoRegEx = /^[7-9]{1}[0-9]{9}$/
var passwordRegEx = /^([A-Z][a-z]+)([!@#\$&*])([0-9])+/


const userSignup = async (req, res) => {
    const { firstName, lastName, email, mobileNumber, countryCode, password, address, dateOfBirth } = req.body


    if (firstName && lastName && email && mobileNumber && countryCode && password && address && dateOfBirth) {
        console.log(firstName + "\n" + lastName + "\n" + email + "\n" + mobileNumber + "\n" + countryCode + "\n" + password + "\n" + address + "\n" + dateOfBirth);

        if (validator.validate(email)) {
            let email1 = await userDB.findOne({ email: email })
            if (mobileNoRegEx.test(mobileNumber)) {
                let mobno = await userDB.findOne({ mobileNumber: mobileNumber })
                if (email1) {
                    res.send("Emaild id is aleady registered kindly enter new email id.")

                } else if (mobno) {
                    res.send("Mobile no is aleady registered kindly enter new Mobile No.")
                } else if (!email1 && !mobno) {
                    const type = "USER"
                    if (passwordRegEx.test(password)) {
                        const salt = await bcrypt.genSalt(10);
                        const hashpass = await bcrypt.hash(password, salt)

                        const doc = new userDB({
                            firstName: firstName,
                            lastName: lastName,
                            email: email,
                            mobileNumber: mobileNumber,
                            countryCode: countryCode,
                            password: hashpass,
                            address: address,
                            dateOfBirth: dateOfBirth,
                            userType: type
                        })

                        await doc.save();
                        console.log("Data saved successfully");



                        //Generating otp
                        const otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })

                        //Send otp on entered email id
                        const transporter = nodemailer.createTransport({
                            service: "gmail",
                            auth: {
                                user: "rahul.kirte@indicchain.com",
                                pass: "nvzasxqnwvdkxdse"
                            }
                        })

                        const options = {
                            from: "rahul.kirte@indicchain.com",
                            to: email,
                            subject: "Account varification OTP",
                            text: "Your account varification OTP is " + otp
                        };
                        transporter.sendMail(options, (error) => {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log(otp);
                                return res.send("OTP Sent Successfully on your entered email id.")

                            }
                        })
                        const otpData = new otpDB({
                            email: email,
                            otp: otp
                        })
                        await otpData.save();
                        console.log("OTP saved successfully");

                        return res.status(200).send({ status: "Success", message: "User registered successfully" });
                    } else {
                        return res.send("Entered password is not in correct formar, Example-> Sample@123 ")
                    }

                } else {
                    return res.send("You enter incorrect Email ID.")
                }
            } else {
                res.send("Mobile No is not valid")
            }

        } else {
            return res.send("User Already exist")
        }
    } else {
        return res.status(400).send({ status: "Error", message: "All fields are required" })
    }
}

const otpVerify = async (req, res) => {
    const { email, otp } = req.body
    if (validator.validate(email)) {
        const account = await otpDB.findOne({ email: email })
        if (!account) {
            return res.send("Emaild Id is not registered. Please Enter registered email id.")
        } else {
            const verifyOTP = await otpDB.findOne({ otp: otp })
            if (!verifyOTP) {
                return res.send("Invalid OTP")
            } else {
                return res.send("OTP verified successfully")
            }
        }
    } else {
        return res.send("You enter incorrect Email ID.")
    }

}

const resendOTP = async (req, res) => {
    const { email } = req.body

    if (validator.validate(email)) {
        const account = await userDB.findOne({ email: email })

        if (!account) {
            return res.send("Email Id is not registered")
        } else {
            //Generating otp
            const otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })

            //Send otp on entered email id
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "rahul.kirte@indicchain.com",
                    pass: "nvzasxqnwvdkxdse"
                }
            })

            const options = {
                from: "rahul.kirte@indicchain.com",
                to: email,
                subject: "Account varification OTP",
                text: "Your account varification OTP is " + otp
            };
            transporter.sendMail(options, (error) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(otp);
                    return res.send("OTP Sent Successfully on your entered email id.")
                    // console.log("OTP Sent Successfully on your entered email id.", otp);
                }
            })
            const otpData = new otpDB({
                email: email,
                otp: otp
            })
            await otpData.save();
            console.log("OTP saved successfully");
        }
    } else {
        return res.send("You enter incorrect Email ID.")
    }
}

const forgetPass = async (req, res) => {
    const { email } = req.body

    if (validator.validate(email)) {
        const account = await userDB.findOne({ email: email })

        if (!account) {
            res.send("Email Id is not registered. Please enter registered email id.")
        } else {
            //Generating otp
            const otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false }, { expiresIn: "1m" })

            //Send otp on entered email id
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "rahul.kirte@indicchain.com",
                    pass: "nvzasxqnwvdkxdse"
                }
            })

            const options = {
                from: "rahul.kirte@indicchain.com",
                to: email,
                subject: "Account varification OTP",
                text: "Your account varification OTP is " + otp
            };
            transporter.sendMail(options, (error) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log("OTP Sent Successfully on your entered email id.");
                    return res.send("OTP Sent Successfully on your entered email id.")

                }
            })
            const otpData = new otpDB({
                email: email,
                otp: otp
            })
            await otpData.save();
            console.log("OTP saved successfully");
        }
    } else {
        return res.send("You enter incorrect Email ID.")
    }


}
const resetPass = async (req, res) => {
    const { email, password, confirmPass } = req.body
    const otp = req.params.otp;
    console.log(otp);

    if (validator.validate(email)) {
        const account = await userDB.findOne({ email: email })
        if (!account) {
            return res.send("Email Id is not registered.")
        } else {
            const validOTP = await otpDB.findOne({ otp: otp, email: email })
            console.log(validOTP);

            if (validOTP) {
                if (passwordRegEx.test(password)) {
                    if (password === confirmPass) {
                        const salt = await bcrypt.genSalt(10)
                        const hashpass = await bcrypt.hash(password, salt)

                        userDB.findByIdAndUpdate({ _id: account._id }, {
                            $set: {
                                password: hashpass
                            }
                        }).then(result => {
                            return res.send("Password is updated successfully.")
                        }).catch(error => {
                            res.send(error)
                        })
                    } else {
                        return req.send("Password and confirm Password is not matching.")
                    }
                } else {
                    return res.send("Entered password is not in correct formar, Example-> Sample@123 ")
                }


            } else {
                return res.send("Invalid OTP")
            }
        }
    } else {
        res.send("You entered incorrect Email ID.")
    }

}
const userLogin = async (req, res) => {
    const { email, password } = req.body
    const otp = req.params.otp
    console.log(otp);
    try {
        if (email && password) {
            if (validator.validate(email)) {
                const account = await userDB.findOne({ email: email })
                if (account) {
                    const checkLogin = await bcrypt.compare(password, account.password)

                    if (checkLogin) {
                        const validOTP = await otpDB.findOne({ otp: otp, email: email })
                        console.log(validOTP);
                        if (validOTP) {
                            res.status(200).send({ status: "Success", message: "User Login Successfully." })
                        } else {
                            res.status(400).send({ status: "Error", message: "Invalid OTP" })
                        }
                    } else {
                        res.status(400).send({ status: "Error", message: "Password is not correct." })
                    }
                } else {
                    res.status(400).send({ status: "Error", message: "User does't exist." })
                }
            } else {
                res.send("Invalid Email Id, Please enter valid email id")
            }
        } else {
            return res.send("All fields are required")
        }
    } catch (error) {
        res.send(error)
    }
}
const updateProfile = async (req, res) => {
    const userId = req.params.id
    const { firstName, lastName, email, mobileNumber, password, address, dateOfBirth } = req.body

    const checkEmail = await userDB.findOne({ email: email });
    const checkMobile = await userDB.findOne({ mobileNumber: mobileNumber })

    if (validator.validate(email)) {
        if (checkEmail) {
            return res.status(400).json({ "staus": false, "message": "This Email is already Exist" })
        } else if (checkMobile) {
            return res.status(400).json({ "staus": false, "message": "This Mobile Number  is already Exist" })
        } else {
            if (password != undefined || password != null) {
                if (passwordRegEx.test(password)) {
                    const salt = await bcrypt.genSalt(10);
                    const hashpass = await bcrypt.hash(password, salt)

                    if (mobileNoRegEx.test(mobileNumber)) {
                        FindUser = await userDB.findByIdAndUpdate({ _id: userId }, {
                            $set:
                            {
                                firstName: firstName,
                                lastName: lastName,
                                email: email,
                                mobileNumber: mobileNumber,
                                password: hashpass,
                                address: address,
                                dateOfBirth: dateOfBirth

                            }
                        });
                    } else {
                        res.send("Mobile No is not valid")
                    }
                } else {
                    return res.send("Entered password is not in correct formar, Example-> Sample@123 ")
                }

            } else {

                if (mobileNoRegEx.test(mobileNumber)) {
                    FindUser = await userDB.findByIdAndUpdate({ _id: userId }, {
                        $set:
                        {
                            firstName: firstName,
                            lastName: lastName,
                            email: email,
                            mobileNumber: mobileNumber,
                            address: address,
                            dateOfBirth: dateOfBirth

                        }
                    });
                } else {
                    res.send("Mobile No is not valid")
                }
            }
            return res.status(200).send({ status: "Success", message: "Profile Updated Sucessfully" })
        }
    } else {
        return res.send("You entered incorrect email id.")
    }


}

const fetchUser = async (req, res) => {
    const allUser = await userDB.find({ userType: "USER" })
    // console.log(allUser);
    return res.status(200).send(allUser)
}

const viewUser = async (req, res) => {
    const { email } = req.query
    console.log(email);
    if (validator.validate(email)) {
        const findUser = await userDB.findOne({ email: email })
        console.log(findUser);
        return res.status(200).send(findUser)
    } else {
        return res.send("You entered incorrect Email id.")
    }
}

const staticList = async (req, res) => {
    const list1 = await viewStaticDB.find()
    console.log(list1);
    res.status(200).send(list1)
}

const viewStatic = async (req, res) => {
    const type = req.params.type

    const result = await viewStaticDB.find({ type: type })
    console.log(result);
    res.status(200).send(result);
}

const editStatic = async (req, res) => {
    const id = req.params.id

    const { type, title, description } = req.body

    findStatic = await viewStaticDB.findByIdAndUpdate({ _id: id }, {
        $set: {
            type: type,
            title,
            description: description
        }
    })
    return res.status(200).send({ status: "Success", message: "Static content Updated Sucessfully" })
}


module.exports = {
    userSignup,
    otpVerify,
    resendOTP,
    forgetPass,
    resetPass,
    userLogin,
    updateProfile,
    fetchUser,
    viewUser,
    staticList,
    viewStatic,
    editStatic
}

