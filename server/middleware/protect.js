// import jwt from 'jsonwebtoken';

// const auth = (req, res, next) => {
//   try {
//     const token = req.header('Authorization')?.replace('Bearer ', '');
    
//     if (!token) {
//       return res.status(401).json({ message: 'No token provided' });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Invalid token' });
//   }
// };

// export default auth;


// server/middleware/authMiddleware.js

// server/middleware/protect.js

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password'); // 🟢 This is required
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Token is invalid' });
    }
  } else {
    return res.status(401).json({ message: 'No token provided' });
  }
};

export default protect;
