// API Client
const api = {
  baseURL: "http://localhost:3000/api",

  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  // Get all todos
  async getTodos() {
    return this.request("/todos");
  },

  // Add new todo
  async addTodo(text) {
    return this.request("/todos", {
      method: "POST",
      body: JSON.stringify({ text }),
    });
  },

  // Update todo (text and/or completed status)
  async updateTodo(id, updates) {
    return this.request(`/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  },

  // Delete todo
  async deleteTodo(id) {
    return this.request(`/todos/${id}`, {
      method: "DELETE",
    });
  },

  // Toggle todo completion
  async toggleTodo(id, completed) {
    return this.updateTodo(id, { completed });
  },

  // Edit todo text
  async editTodo(id, text) {
    return this.updateTodo(id, { text });
  },
};