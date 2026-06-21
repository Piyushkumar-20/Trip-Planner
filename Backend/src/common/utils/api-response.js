class ApiResponse {
  static ok(message, res, data = null) {
    return res.status(200).json({ success: true, message, data });
  }

  static created(message, res, data = null) {
    return res.status(201).json({ success: true, data, message });
  }

  static noContent(res) {
    return res.status(204).send();
  }
}

export default ApiResponse;
