declare global {
  namespace Express {
    interface Request {
      currentUser?: User; // Or replace User with your user type/interface
    }
  }
}
