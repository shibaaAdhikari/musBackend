import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { SECRET_KEY } from '../env.js'; // Import the SECRET_KEY from your environment
import Account from '../models/accounts.js';



const signupUser = async (req, res) => {
  try {
      const { username, email, password, role } = req.body;

      // Check if the username or email is already taken
      const existingUser = await Account.findOne({
          where: {
              [Op.or]: [{ username }, { email }],
          },
      });

      if (existingUser) {
          return res.status(409).json({ message: 'Username or email already taken' });
      }

      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the user in the database
      const user = await Account.create({
          username,
          email,
          password: hashedPassword,
          role: role, // Assign the role 'user'
      });

      // Generate a token
      const token = jwt.sign({ role, userId: user.id }, SECRET_KEY, { expiresIn: '24h' });

      // Store the token ID in the same Account table
      user.tokenId = token;
      await user.save();

      res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password} = req.body;

    if (userType !== 'user') {
      return res.status(400).json({ message: 'Invalid userType' });
    }

    const user = await Account.findOne({
      where: { username },
      attributes: ['id', 'username', 'email', 'password'],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred', error });
  }
};

export { loginUser,signupUser };
