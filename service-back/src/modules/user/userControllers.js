import { PrismaClient } from "@prisma/client";
import { compare, genSalt, hash } from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const userController = {
  //register
  register: async (req, res) => {
    const { nom, email, password } = req.body;
    if (email && password && nom) {
      console.log("yes");
      try {
        const find = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });
        console.log(find, "yesssssssssssssssssss");
        if (find) {
          res.status(409).json({ message: "l'utilisateur exsite déjà" });
        } else {
          const salt = await genSalt(10);
          const hashedPassword = await hash(password, salt);
          const adduser = await prisma.user.create({
            data: {
              email: email,
              name: nom,
              password: hashedPassword,
            },
          });
          res.status(200).json(adduser);
        }
      } catch (e) {
        res.status(500).json(e);
      }
    }
  },

  //login
  login: async (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
      try {
        const findUser = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });
        if (findUser) {
          const comparePassword = await compare(password, findUser.password);
          if (comparePassword) {
            const token = jwt.sign(
              {
                userId: findUser.id,
              },
              process.env.JWT_SECRET,
              {
                expiresIn: "1h",
              }
            );
            res.status(200).json({
              token,
              user: findUser,
            });
          } else {
            res.status(401).json({
              message: "Mot de passe incorrect",
            });
          }
        } else {
          res.status(401).json({
            message: "Utilisateur non trouvé",
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  },

  //get all user
  getAllUser: async (req, res) => {
    try {
      const users = await prisma.user.findMany();
      res.status(200).json(users);
    } catch (e) {
      console.log(e);
    }
  },

  //get user by id
  findUser: async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: JSON.parse(req.params.id),
        },
      });
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404);
      }
    } catch (e) {
      console.log(e);
    }
  },
};

export default userController;
