class ApiError extends Error {
  constructor(title, message, status) {
    super(message);
    this.title = title;
    this.status = status;
  }
}
export default ApiError;
