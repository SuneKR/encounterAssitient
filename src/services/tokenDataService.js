import http from "../http-common"

class TokenDataService {
    create(data) {  return http.post(`/tokens`, data)  }

    get(id) {  return http.get(`/tokens/${id}`)  }
    getAll() {  return http.get(`/tokens`)  }
    getSelected() {  return http.get(`/tokens/selected`)  }

    update(id, data) {  return http.put(`/tokens/${id}`, data)  }

    delete(id) {  http.delete(`/tokens/${id}`)  }
    deleteAll() {  http.delete(`/tokens`)  }
}

export default new TokenDataService()